import { CourseForm, Modal } from "@/components";
import { Props } from "./types";
import { useTranslation } from "react-i18next";

export const AddCourse = ({ onClose, open, courseId }: Props) => {
  const { t } = useTranslation("", {
    keyPrefix: "settings.office.add_course.title",
  });
  return (
    <Modal
      title={courseId ? t("title_1") : t("title_2")}
      open={open}
      onClose={onClose}
    >
      <CourseForm courseId={courseId} onClose={onClose} />
    </Modal>
  );
};
