export type FormValue = {
  course_name: string;
  course_img: string | File;
  lesson_duration: string;
  course_duration: string;
  course_price: string;
  course_description?: string;
};

export type Props = {
  onClose: () => void;
  courseId?: string;
};
