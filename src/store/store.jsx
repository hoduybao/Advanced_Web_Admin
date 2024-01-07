import { configureStore } from "@reduxjs/toolkit";
import manageClassSlice from "./classes/classSlice";
import adminSlice from "./admin/userSlice";
import { manageAccountSlice } from "./accounts/classSlice";

export const store = configureStore({
  reducer: {
    admin: adminSlice,
    manageClass: manageClassSlice,
    manageAccount: manageAccountSlice,
  },
});
