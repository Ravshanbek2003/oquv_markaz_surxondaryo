/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Snippet = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export interface AddSnippetRequest {
  title: string;
}
export interface AddSnippetResponse {
  msg: string;
}

export interface GetAllSnippetsRequest {}
export interface GetAllSnippetsResponse {
  snippets: Snippet[];
}

export interface GetSnippetRequest {
  id: string;
}
export interface GetSnippetResponse extends Snippet {}

export interface UpdateSnippetRequest {
  id: string;
  body: {
    title?: string;
  };
}
export interface UpdateSnippetResponse {
  msg: string;
}

export interface DeleteSnippetRequest {
  id: string;
}
export interface DeleteSnippetResponse {
  msg: string;
}
