import { Modal, RoomForm } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddRooms = ({ onClose, open, roomId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_room.title",
  });
  return (
    <Modal
      title={roomId ? `${t("title_1")}` : `${t("title_2")}`}
      open={open}
      onClose={onClose}
    >
      <RoomForm roomId={roomId} onClose={onClose} />
    </Modal>
  );
};
