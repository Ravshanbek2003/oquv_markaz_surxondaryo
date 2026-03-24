export type User = {
  _id: string;
  fullName: string;
};

export type Comment = {
  _id: string;
  student: string;
  user: User;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export interface AddCommentRequest {
  message: string;
  student: string;
}
export interface AddCommentResponse {
  msg: string;
}

export interface GetAllCommentsRequest {
  studentId: string;
}
export interface GetAllCommentsResponse {
  comments: Comment[];
}

export interface GetCommentRequest {
  commentId: string;
}
export interface GetCommentResponse {
  _id: string;
  student: string;
  user: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCommentRequest {
  commentId: string;
  body: Partial<{
    message: string;
  }>;
}
export interface UpdateCommentResponse {
  msg: string;
}

export interface DeleteCommentRequest {
  commentId: string;
}
export interface DeleteCommentResponse {
  msg: string;
}
