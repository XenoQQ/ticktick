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
        toggleDoneStatus: (state, action: PayloadAction<string>) => {
            const todo = state.find((todo) => todo.data.id === action.payload);
            if (todo) {
                todo.data.doneStatus = !todo.data.doneStatus;
            }
        },
    },
});

export const { addTodo, toggleDoneStatus } = todoSlice.actions;
export default todoSlice.reducer;
