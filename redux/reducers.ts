import { InitialState, Action } from "@/redux/types";

const initialState: InitialState = {
  userData: {
    id: "",
    name: "",
    email: "",
  },
};

export const reducers = (
  state = initialState,
  action: Action
): InitialState => {
  switch (action.type) {
    case "USER_DATA":
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};
