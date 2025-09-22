import Box from "@mui/material/Box";

import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
  // closestCenter,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { useEffect, useState, useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import _, { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatter";
import { useOutletContext } from "react-router-dom";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

const BoardContent = (props) => {
  const {
    board,
    moveColumns,
    moveCardInTheSameColumn,
    moveCardToDifferentColumn,
  } = props;
  const { resolvedMode } = useOutletContext();
  const [orderedColumns, setOrderedColumns] = useState([]);

  // cùng 1 thời điểm thì chỉ có 1 phần tử đc kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnDataWhenDraggingCard, setOldColumnDataWhenDraggingCard] =
    useState(null);

  //Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix truongf hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  // Tìm 1 Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      // Tìm vị trí index của cái overCard trong column đích nơi card sắp được thả
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // Logic tinhs toans "CardIndex mới" - lấy chuẩn từ code thư viện dnd kit
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = _.cloneDeep(prevColumns);

      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        // Xóa Card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Thêm PlaceholderCard nếu Column rỗng: bị kéo hết Card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        // Cập nhậtlại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        // Kiểm tra Card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        // Thêm cái Card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        // Xóa cái Placeholder Card nếu trong Column có tồn tại ít nhất 1 Card
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => !c.FE_PlaceholderCard
        );

        // Cập nhậtlại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      // Nếu func này được gọi từ handleDragEnd nghia là đã kéo thả xong, lúc này mới xử lý gọi API 1 lần ở đây
      if (triggerFrom === "handleDragEnd") {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnDataWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }

      return nextColumns;
    });
  };

  // Trigger Khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // Nếu là kéo Card thì mới thực hiện những hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnDataWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì khi kéo Column
    if (activeDragItemType === "ACTIVE_DRAG_ITEM_TYPE_COLUMN") return;

    // Nếu kéo Card thì xử lý thểm để có thể kéo Card qua lại giữa các Column
    const { active, over } = event;

    // Cần đẩm bảo nếu không tồn tại active hoặc over (khi kéo thả ra khỏi phạm vị container) thì không làm gì tránh crash trang
    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;
    // Tìm 2 cái Columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        "handleDragOver"
      );
    }
  };

  //  Trigger Khi kết thúc hành động kéo 1 phần tử => hành động thả (drag)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Cần đẩm bảo nếu không tồn tại active hoặc over (khi kéo thả ra khỏi phạm vị container) thì không làm gì tránh crash trang
    if (!active || !over) return;
    // console.log("🚀 ~ handleDragEnd ~ event:", event);

    // Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;
      // Tìm 2 cái Columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      // Kéo thả Card qua 2 Column khác nhau

      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnDataWhenDraggingCard (set vào state từ bước handleStartStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDagOver tới đây state của Card đã bị cập nhật một lần

      if (oldColumnDataWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          "handleDragEnd"
        );
      } else {
        // Kéo thả Card trong 1 Column

        // Lấy vị trí cũ từ thằng oldColumnDataWhenDraggingCard
        const oldCardIndex = oldColumnDataWhenDraggingCard?.cards.findIndex(
          (c) => c._id === activeDragItemId
        );
        // Lấy vị trí mới từ thằng over
        const newCardIndex = overColumn?.cards.findIndex(
          (c) => c._id === overCardId
        );

        // dùng arrayMove vì kéo Card trong 1 Cloumn thì tương tự với logic kéo Column trong 1 Board Content
        const dndOrderedCards = arrayMove(
          oldColumnDataWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        const dndOrderedCardIds = dndOrderedCards.map((c) => c._id);

        setOrderedColumns((prevColumns) => {
          const nextColumns = _.cloneDeep(prevColumns);

          // Tìm tới cái Column mà chúng ta đang thả
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id
          );

          // Cập nhật 2gias trị cards và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds;

          return nextColumns;
        });
        //
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnDataWhenDraggingCard._id
        );
      }
    }

    // Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // Lấy vị trí cũ từ thằng active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        // Lấy vị trí mới từ thằng over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );

        // dùng arrayMove để sắp xếp lại columns ban đầu
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );

        // Vẫn gọi update state để tránh delay hoặc flickering
        setOrderedColumns(dndOrderedColumns);

        /**
         * Gọi lên props function moveColumns nằm ở component cha cao nhất (boards/_id.jsx)
         * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store
         * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên. (Đổi với component con nằm càng sâu thì càng khổ :D)
         * Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất  nhiều.
         */
        moveColumns(dndOrderedColumns);
      }
    }

    // Những xử liệu sau khi kéo thả luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnDataWhenDraggingCard(null);
  };

  // Animation code DragOverlay
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // Thuật toán phát hiện va chạm
      const pointerIntersections = pointerWithin(args);

      // Kéo 1 cái card có image lớn và kéo phía trên cùng ra khỏi khu vực kéo thả
      if (!pointerIntersections?.length) return;

      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args);

      //Tìm overId đầu tiên
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng closestCorners thấy mượt mà hơn
        const checkColumn = orderedColumns.find((c) => c._id === overId);
        if (checkColumn) {
          // console.log("🚀 ~ BoardContent ~ overId before :", overId);
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds.includes(container.id)
                );
              }
            ),
          })[0]?.id;
          // console.log("🚀 ~ BoardContent ~ overId after :", overId);
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );
  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm
      // collisionDetection={closestCorners} // dùng bị bug flickering
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          backgroundColor: resolvedMode === "dark" ? "#34495e" : "#f5f7fa",
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
            activeDragItemData && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD &&
            activeDragItemData && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
