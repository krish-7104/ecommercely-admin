import { InitialState, Action } from "@/redux/types";

let initialState: InitialState = {
  userData: {
    message: "",
    user: {
      userId: "",
      name: "",
      email: "",
    },
  },
};

export const Reducers = (state = initialState, action: Action) => {
  switch (action.type) {
    case "USER_DATA":
      return { ...state, userData: action.payload };
    default:
      break;
  }
};
