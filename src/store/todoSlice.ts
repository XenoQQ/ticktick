import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TodoItemProps, TodosState, SwitchPriority, SwitchContent, SwitchTargetDate } from '../controls/types';
import { db } from '../index';
import { collection, setDoc, getDocs, doc, query, where, deleteDoc } from 'firebase/firestore';

const initialState: TodosState = {
    todos: [],
    loading: false,
    error: null,
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
            const subTasksQuery = query(collection(db, 'todos'), where('data.parentId', '==', todoId));
            const subTasksSnapshot = await getDocs(subTasksQuery);

            const subTaskIds = subTasksSnapshot.docs.map((subTaskDoc) => subTaskDoc.id);

            const idsToDelete = [...subTaskIds, todoId];

            for (const id of idsToDelete) {
                const docRef = doc(db, 'todos', id);
                await deleteDoc(docRef);
            }
        } catch (error) {
            console.error('Error deleting todo from Firebase: ', error);
            return rejectWithValue('Failed to delete todo');
        }
    },
);

interface DeleteTagPayload {
    id: string;
    tag: string;
}

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        updateTodos: (state, action: PayloadAction<TodoItemProps[]>) => {
            state.todos = action.payload;
        },
        addTodo: (state, action: PayloadAction<TodoItemProps>) => {
            state.todos.push(action.payload);
        },
        toggleDoneStatus: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload);
            if (todo) {
                todo.data.doneStatus = !todo.data.doneStatus;
                if (!todo.data.parentId) {
                    const subTodos = state.todos.filter((subTodo) => subTodo.data.parentId === action.payload);
                    subTodos?.forEach((subTodo) => {
                        if (todo.data.doneStatus === true) {
                            subTodo.data.doneStatus = true;
                        }
                    });
                }
            }
        },
        deleteTag: (state, action: PayloadAction<DeleteTagPayload>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.tags = todo.data.tags.filter((tag) => tag !== action.payload.tag);
                if (todo.data.tags.length === 0) {
                    todo.data.tags.push('none');
                }
            }
        },
        switchTargetDate: (state, action: PayloadAction<SwitchTargetDate>) => {
            const todo = state.todos.find((todo) => todo.data.id === action.payload.id);
            if (todo) {
                todo.data.targetDate = action.payload.targetDate;
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
            const tags = action.payload.tags;
            if (todo) {
                todo.data.content = action.payload.content;
                if (tags) {
                    tags.map((tag) => todo.data.tags.push(tag));
                    const newTags = todo.data.tags.filter((tag) => tag !== 'none');
                    const sortedNewTags = newTags.sort((a, b) => a.localeCompare(b));
                    if (sortedNewTags.length === 0) {
                        sortedNewTags.push('none');
                    }
                    todo.data.tags = sortedNewTags;
                }
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
                const todoId = action.meta.arg;

                state.todos = state.todos.filter((todo) => todo.data.id !== todoId && todo.data.parentId !== todoId);

                state.loading = false;
            })
            .addCase(deleteTodoFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addTodo, toggleDoneStatus, switchPriority, switchContent, switchTargetDate, deleteTag, updateTodos } = todoSlice.actions;
export default todoSlice.reducer;
