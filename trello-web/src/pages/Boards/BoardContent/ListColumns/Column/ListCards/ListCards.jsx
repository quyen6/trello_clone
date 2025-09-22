import Card from "./Card/Card";

import Box from "@mui/material/Box";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useOutletContext } from "react-router-dom";
const ListCards = (props) => {
  const { cards } = props;
  const { resolvedMode } = useOutletContext();
  return (
    <SortableContext
      items={cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          p: "0 5px 5px 5px",
          m: "0 5px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - 
                ${theme.spacing(5)} - 
                ${theme.trello.columnHeaderHeight} - 
                ${theme.trello.columnFooterHeight})`,
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: resolvedMode === "dark" ? "#eee" : "#01a3a4",
          },
        }}
      >
        {cards?.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
};

export default ListCards;
