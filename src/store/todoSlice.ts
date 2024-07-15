import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TodoItemProps } from '../controls/types';
import { db } from '../index';
import { collection, setDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

export type TodosState = {
    todos: TodoItemProps[];
    loading: boolean;
    error: string | null;
};

const initialState: TodosState = {
    todos: [],
    loading: false,
    error: null,
};

type SortCase = 'date' | 'name' | 'tag' | 'priority' | 'none';

type SwitchPriority = {
    id: string;
    priority: 'none' | 'low' | 'medium' | 'high';
};

type SwitchContent = {
    id: string;
    content: string;
};

export const fetchTodosFromFirebase = createAsyncThunk<TodoItemProps[], void, { rejectValue: string }>(
    'todos/fetchTodosFromFirebase',
    async (_, { rejectWithValue }) => {
        try {
            const todosCollection = collection(db, 'todos');
            const todoSnapshot = await getDocs(todosCollection);
            const todos = todoSnapshot.docs.map((doc) => doc.data() as TodoItemProps);
            return todos;
        } catch (error) {
            console.error('Error fetching todos from Firebase: ', error);
            return rejectWithValue('Failed to fetch todos');
        }
    },
);

export const syncTodosWithFirebase = createAsyncThunk<void, TodoItemProps[], { rejectValue: string }>(
    'todos/syncTodosWithFirebase',
    async (todos, { rejectWithValue }) => {
        try {
            const todosCollection = collection(db, 'todos');
            for (const todo of todos) {
                const todoDoc = doc(todosCollection, todo.data.id);
                await setDoc(todoDoc, todo);
            }
        } catch (error) {
            console.error('Error syncing todos with Firebase: ', error);
            return rejectWithValue('Failed to sync todos');
        }
    },
);

export const deleteTodoFromFirebase = createAsyncThunk<void, string, { rejectValue: string }>(
    'todos/deleteTodoFromFirebase',
    async (todoId, { rejectWithValue }) => {
        try {
            const todoDoc = doc(db, 'todos', todoId);
            await deleteDoc(todoDoc);
        } catch (error) {
            console.error('Error deleting todo from Firebase: ', error);
            return rejectWithValue('Failed to delete todo');
        }
    },
);

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<TodoItemProps>) => {
            state.todos.push(action.payload);
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            const index = state.todos.findIndex((todo) => todo.data.id === action.payload);
            if (index !== -1) {
                state.todos.splice(index, 1);
            }
        },
        toggleDoneStatus: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload);
            if (todo) {
                todo.data.doneStatus = !todo.data.doneStatus;
            }
        },
        switchPriority: (state, action: PayloadAction<SwitchPriority>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.priority = action.payload.priority;
            }
        },
        switchContent: (state, action: PayloadAction<SwitchContent>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.content = action.payload.content;
            }
        },
        sortTodos: (state, action: PayloadAction<SortCase>) => {
            switch (action.payload) {
                case 'date':
                    state.todos.sort((a, b) => {
                        const dateA = a.data.targetDate ? new Date(a.data.targetDate).getTime() : null;
                        const dateB = b.data.targetDate ? new Date(b.data.targetDate).getTime() : null;

                        if (dateA === null) return 1;
                        if (dateB === null) return -1;
                        return dateA - dateB;
                    });
                    break;
                case 'name':
                    state.todos.sort((a, b) => a.data.content.localeCompare(b.data.content));
                    break;
                case 'tag':
                    state.todos.sort((a, b) => a.data.tags[0].localeCompare(b.data.tags[0]));
                    break;
                case 'priority': {
                    const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
                    state.todos.sort((a, b) => priorityOrder[a.data.priority] - priorityOrder[b.data.priority]);
                    break;
                }
                case 'none':
                default:
                    state.todos.sort((a, b) => {
                        const dateA = a.data.timeOfCreation ? new Date(a.data.timeOfCreation).getTime() : null;
                        const dateB = b.data.timeOfCreation ? new Date(b.data.timeOfCreation).getTime() : null;

                        if (dateA === null) return 1;
                        if (dateB === null) return -1;
                        return dateA - dateB;
                    });
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodosFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodosFromFirebase.fulfilled, (state, action) => {
                state.todos = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTodosFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(syncTodosWithFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(syncTodosWithFirebase.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(syncTodosWithFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteTodoFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTodoFromFirebase.fulfilled, (state, action) => {
                state.todos = state.todos.filter((todo) => todo.data.id !== action.meta.arg);
                state.loading = false;
            })
            .addCase(deleteTodoFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addTodo, toggleDoneStatus, sortTodos, deleteTodo, switchPriority, switchContent } = todoSlice.actions;
export default todoSlice.reducer;
