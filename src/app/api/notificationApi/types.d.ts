export type Notification = {
  _id: string;
  title: string;
  createdAt: string;
  seen: number;
};

export interface AddNotificationRequest {
  title: string;
  branch: string;
  users?: string[];
  message: string;
}
export interface AddNotificationResponse {
  msg: string;
}

export interface GetAllNotificationsRequest {
  type: "new" | "all";
  id: string;
}
export interface GetAllNotificationsResponse {
  notifications: Notification[];
}

export interface GetNotificationRequest {
  id: string;
}
export interface GetNotificationResponse extends Notification {
  branch: string;
  updatedAt: string;
  message: string;
  users: string[];
}

export interface UpdateNotificationRequest {
  id: string;
  body: {
    title?: string;
    message?: string;
    users?: string[];
  };
}
export interface UpdateNotificationResponse {
  msg: string;
}

export interface DeleteNotificationRequest {
  id: string;
}
export interface DeleteNotificationResponse {
  msg: string;
}
