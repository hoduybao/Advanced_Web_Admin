import { createSlice } from "@reduxjs/toolkit";
export const manageAccountSlice = createSlice({
  name: "manageAccount",
  initialState: {
    listAccount:[],
    isLoading: false,
    mes: "",
  },

  reducers: {
    clearMessage: (state) => {
      state.mes = "";
    },
  },
 
});
export const { clearMessage } = manageAccountSlice.actions;

export default manageAccountSlice.reducer;
