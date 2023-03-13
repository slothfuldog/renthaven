import { configureStore } from "@reduxjs/toolkit";
import {userReducer} from "./userReducer";

export const globalStore = configureStore({
    reducer: {userReducer}
})