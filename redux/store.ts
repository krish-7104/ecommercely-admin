"use client";
import { legacy_createStore as createStore } from "redux";
import { Reducers } from "./reducers";

const mystore = createStore(Reducers);

export default mystore;
