// src/store/features/ownerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OwnerState { // ← EXPORT QILINDI
  open: boolean;
  mode: "create" | "edit";
  selectedSubscription: {
    id: number | null;
    price: string;
    currency: "USD" | "UZS";
    start_date: string;
  } | null;
}

const initialState: OwnerState = {
  open: false,
  mode: "create",
  selectedSubscription: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    openModal: (state) => {
      state.open = true;
      state.mode = "create";
      state.selectedSubscription = null;
    },
    openEditModal: (
      state,
      action: PayloadAction<{
        id: number;
        price: string;
        currency: "USD" | "UZS";
        start_date: string;
      }>
    ) => {
      state.open = true;
      state.mode = "edit";
      state.selectedSubscription = action.payload;
    },
    closeModal: (state) => {
      state.open = false;
      state.mode = "create";
      state.selectedSubscription = null;
    },
  },
});

export const { openModal, openEditModal, closeModal } = ownerSlice.actions;
export default ownerSlice.reducer;
