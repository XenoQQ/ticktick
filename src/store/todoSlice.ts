import { v4 as uuidv4 } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoItemProps } from "../controls/types";

const initialState: TodoItemProps[] = [];

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoItemProps>) => {
            const newTodo: TodoItemProps = {
                ...action.payload,
                data: {
                    ...action.payload.data,
                },
            };

            state.push(newTodo);
        },
    },
});

export const { addTodo } = todoSlice.actions;
export default todoSlice.reducer;
