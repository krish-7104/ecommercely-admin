"use client";
import { legacy_createStore as createStore } from "redux";
import { reducers } from "@/redux/reducers";

const mystore = createStore(reducers);

export default mystore;
