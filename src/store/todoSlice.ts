import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodoItemProps } from '../controls/types';

const initialState: TodoItemProps[] = [];

type SortCase = 'date' | 'name' | 'tag' | 'priority' | 'none';

type SwitchPriority = {
    id: string;
    priority: 'none' | 'low' | 'medium' | 'high';
};

type SwitchContent = {
    id: string;
    content: string;
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoItemProps>) => {
            state.push({ ...action.payload });
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            const index = state.findIndex((todo) => todo.data.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        toggleDoneStatus: (state, action: PayloadAction<string>) => {
            const todo = state.find((todo) => todo.data.id === action.payload);
            if (todo) {
                todo.data.doneStatus = !todo.data.doneStatus;
            }
        },
        switchPriority: (state, action: PayloadAction<SwitchPriority>) => {
            const todo = state.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.priority = action.payload.priority;
            }
        },
        switchContent: (state, action: PayloadAction<SwitchContent>) => {
            const todo = state.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.content = action.payload.content;
            }
        },
        sortTodos: (state, action: PayloadAction<SortCase>) => {
            switch (action.payload) {
                case 'date':
                    state.sort((a, b) => {
                        const dateA = a.data.targetDate ? new Date(a.data.targetDate).getTime() : null;
                        const dateB = b.data.targetDate ? new Date(b.data.targetDate).getTime() : null;

                        if (dateA === null) return 1;
                        if (dateB === null) return -1;
                        return dateA - dateB;
                    });
                    break;
                case 'name':
                    state.sort((a, b) => a.data.content.localeCompare(b.data.content));
                    break;
                case 'tag':
                    state.sort((a, b) => a.data.tags[0].localeCompare(b.data.tags[0]));
                    break;
                case 'priority': {
                    const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
                    state.sort((a, b) => priorityOrder[a.data.priority] - priorityOrder[b.data.priority]);
                    break;
                }
                case 'none':
                default:
                    state.sort((a, b) => {
                        const dateA = a.data.timeOfCreation ? new Date(a.data.timeOfCreation).getTime() : null;
                        const dateB = b.data.timeOfCreation ? new Date(b.data.timeOfCreation).getTime() : null;

                        if (dateA === null) return 1;
                        if (dateB === null) return -1;
                        return dateA - dateB;
                    });
                    break;
                    break;
            }
        },
    },
});

export const { addTodo, toggleDoneStatus, sortTodos, deleteTodo, switchPriority, switchContent } = todoSlice.actions;
export default todoSlice.reducer;
