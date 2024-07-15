import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TodoItemProps } from '../controls/types';
import { db } from '../index';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const initialState: {
    todos: TodoItemProps[];
    loading: boolean;
    error: string | null;
} = {
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

export const saveTodoToFirebase = createAsyncThunk<TodoItemProps, TodoItemProps, { rejectValue: string }>(
    'todos/saveTodoToFirebase',
    async (todo, { rejectWithValue }) => {
        try {
            const todosCollection = collection(db, 'todos');
            await addDoc(todosCollection, todo);
            return todo; // Возвращаем todo, чтобы оно было доступно в fulfilled
        } catch (error) {
            console.error('Error saving todo to Firebase: ', error);
            return rejectWithValue('Failed to save todo');
        }
    },
);

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
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
            .addCase(saveTodoToFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveTodoToFirebase.fulfilled, (state, action) => {
                state.todos.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(saveTodoToFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
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
            });
    },
});

export const { toggleDoneStatus, sortTodos, deleteTodo, switchPriority, switchContent } = todoSlice.actions;
export default todoSlice.reducer;
