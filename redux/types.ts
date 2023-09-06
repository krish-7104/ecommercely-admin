export type InitialState = {
  userData: User;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Action = {
  type: String;
  payload: any;
};
