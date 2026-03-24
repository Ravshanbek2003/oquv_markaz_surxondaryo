/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Category = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export interface AddCategoryRequest {
  title: string;
}
export interface AddCategoryResponse {
  msg: string;
}

export interface GetCategoriesRequest {}
export interface GetCategoriesResponse {
  categories: Category[];
}

export interface GetCategoryRequest {
  id: string;
}
export interface GetCategoryResponse extends Category {}

export interface UpdateCategoryRequest {
  id: string;
  body: {
    title?: string;
  };
}
export interface UpdateCategoryResponse {
  msg: string;
}

export interface DeleteCategoryRequest {
  id: string;
}
export interface DeleteCategoryResponse {
  msg: string;
}
