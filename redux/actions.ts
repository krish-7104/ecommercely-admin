import { User } from "@/redux/types";

export const setUserHandler = (data: User) => ({
  type: "USER_DATA",
  payload: data,
});
