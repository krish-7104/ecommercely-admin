export type InitialState = {
  userData: User;
};

export type User = {
  message: string;
  user: { userId: string; name: string; email: string };
};

export type Action = {
  type: String;
  payload: any;
};
