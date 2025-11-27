import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Company {
    id: number | string;
    name: string;
    is_active: boolean;
}
 
export interface CompanyState {
    open: boolean;
    editing: Company | null;
}

const initialState: CompanyState = {
    open: false,
    editing: null
};

const companySlice = createSlice({
    name: 'Company',
    initialState,
    reducers: {
        openModal(state) {
            state.open = true;
            state.editing = null
        },
        editCompany(state, action: PayloadAction<Company>) {
            state.open = true;
            state.editing = action.payload;
        }, 
        closeModal(state) {
            state.open = false;
            state.editing = null
        }
    },
});

export const { openModal, editCompany, closeModal } = companySlice.actions;
export default companySlice.reducer;