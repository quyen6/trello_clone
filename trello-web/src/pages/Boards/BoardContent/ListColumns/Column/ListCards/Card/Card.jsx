import { Checkbox, Card as MuiCard } from "@mui/material";

import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  showModalActiveCard,
  updateCurrentActiveCard,
} from "~/redux/activeCard/activeCardSlice";
const Card = (props) => {
  const dispatch = useDispatch();
  const { card } = props;
  const { resolvedMode } = useOutletContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // Fix bug: transform
  const dndKitCardStyles = {
    // touchAction: "none", // Dành cho sensor default dạng PointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid rgb(0,134,137)" : undefined,
  };

  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };

  // Cập nhật data cho activeCard trong Redux
  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card));
    // Hiện Modal lên
    dispatch(showModalActiveCard());
  };
  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        onClick={setActiveCard}
        sx={{
          cursor: "pointer",
          // boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
          overflow: "unset",
          display: card?.FE_PlaceholderCard ? "none" : "block",
          border: "2px solid transparent",
          "&:hover": {
            borderColor: resolvedMode === "dark" ? "pink" : "rgb(0,137,134)",
          },
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} />}
        <CardContent
          sx={{
            p: 1.5,
            "&:last-child": {
              p: 1.5,
            },
            display: "flex",
            alignItems: "center",
            gap: 1,
            // position: "relative",
            "&:hover .hover-actions": {
              display: "block",
            },
          }}
        >
          <Checkbox
            className="hover-actions"
            {...label}
            defaultChecked
            color="success"
            size="small"
            sx={{
              "&.MuiCheckbox-root": {
                padding: 0,
              },
              display: "none",
              transition: "display 0.2s ease",
            }}
          />
          <Typography>{card?.title}</Typography>
        </CardContent>
        {shouldShowCardActions() && (
          <CardActions sx={{ p: "0 4px 8px 4px" }}>
            {!!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size="small" startIcon={<ModeCommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size="small" startIcon={<AttachmentIcon />}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
    </>
  );
};

export default Card;
