import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { dateReducer } from "./dateReducer";

export const globalStore = configureStore({
  reducer: { userReducer, dateReducer },
});
