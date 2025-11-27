import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {
    open: false,
    editing: null
};
const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        openModal(state) {
            state.open = true;
            state.editing = null;
        },
        editModal(state, action) {
            state.open = true;
            state.editing = action.payload;
        },
        closeModal(state) {
            state.open = false;
            state.editing = null;
        }
    },
});

export const { openModal, closeModal, editModal } = roleSlice.actions;
export default roleSlice.reducer;