import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {
    open: false,
    editing: null
};
const planSlice = createSlice({
    name: 'blocks',
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

export const { openModal, closeModal, editModal } = planSlice.actions;
export default planSlice.reducer;