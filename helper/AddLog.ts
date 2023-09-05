import axios from "axios";

type LogType = {
  type: string;
  message: string;
  userId: string;
};

export const addLogHandler = async (values: LogType) => {
  const resp = await axios.post("/api/logs/addlog", values);
  return resp;
};
