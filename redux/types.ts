export type InitialState = {
  userData: User;
};

export type User = {
  userId: string;
  name: string;
  email: string;
};

export type Action = {
  type: String;
  payload: any;
};
