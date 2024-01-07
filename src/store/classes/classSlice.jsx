import { createSlice } from "@reduxjs/toolkit";
export const manageClassSlice = createSlice({
  name: "manageClass",
  initialState: {
    listclasses:[],
    isLoading: false,
    mes: "",
  },

  reducers: {
    clearMessage: (state) => {
      state.mes = "";
    },
  },
 
});
export const { clearMessage } = manageClassSlice.actions;

export default manageClassSlice.reducer;
