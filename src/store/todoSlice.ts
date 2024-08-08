import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TodosState, TodoItemProps, TodoSubItemProps, UpdateTodoProps, UpdateSubTodoProps } from '../controls/types';
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
            return todoSnapshot.docs.map((doc) => doc.data() as TodoItemProps);
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
            await Promise.all(todos.map((todo) => setDoc(doc(todosCollection, todo.data.id), todo)));
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
        addSubTodo: (state, action: PayloadAction<TodoSubItemProps>) => {
            const parentTodo = state.todos.find((todo) => todo.data.id === action.payload.data.parentId);
            if (parentTodo) {
                parentTodo.data.children.push(action.payload);
            }
        },
        updateTodo: (state, action: PayloadAction<UpdateTodoProps>) => {
            const updateType = action.payload.updateType;
            const todo = state.todos.find((todo) => todo.data.id === action.payload.id);
            switch (updateType) {
                case 'doneStatus':
                    if (todo) {
                        const newStatus = !todo.data.doneStatus;
                        todo.data.doneStatus = newStatus;
                        if (newStatus === true) {
                            todo.data.children?.forEach((child) => (child.data.doneStatus = true));
                        }
                    }
                    break;
                case 'priority':
                    if (todo && action.payload.priority) {
                        todo.data.priority = action.payload.priority;
                    }
                    break;
                case 'content':
                    if (todo && action.payload.content) {
                        todo.data.content = action.payload.content;
                        const tags = action.payload.tags;
                        if (tags) {
                            if (tags.length > 0) {
                                const newTags = tags.filter((tag) => tag !== 'none' || !todo.data.tags.includes(tag));
                                newTags.map((tag) => todo.data.tags.push(tag));
                                const sortedNewTags = newTags.sort((a, b) => a.localeCompare(b));
                                if (sortedNewTags.length === 0) {
                                    sortedNewTags.push('none');
                                }
                                todo.data.tags = sortedNewTags;
                            }
                        }
                    }

                    break;
                case 'targetDate':
                    if (todo && action.payload.targetDate !== undefined) {
                        todo.data.targetDate = action.payload.targetDate;
                    }
                    break;
            }
        },
        updateSubTodo: (state, action: PayloadAction<UpdateSubTodoProps>) => {
            const updateType = action.payload.updateType;
            const parentTodo = state.todos.find((todo) => todo.data.id === action.payload.parentId);
            const todo = parentTodo?.data.children.find((todo) => todo.data.id === action.payload.id);
            switch (updateType) {
                case 'doneStatus':
                    if (todo) {
                        const newStatus = !todo.data.doneStatus;
                        todo.data.doneStatus = newStatus;
                        if (newStatus === false && parentTodo?.data.doneStatus === true) {
                            parentTodo.data.doneStatus = newStatus;
                        }
                    }
                    break;
                case 'priority':
                    if (todo && action.payload.priority) {
                        todo.data.priority = action.payload.priority;
                    }
                    break;
                case 'content':
                    if (todo && action.payload.content) {
                        todo.data.content = action.payload.content;
                    }
                    break;
                case 'targetDate':
                    if (todo && action.payload.targetDate !== undefined) {
                        todo.data.targetDate = action.payload.targetDate;
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
            /*             .addCase(deleteTodoFromFirebase.fulfilled, (state, action) => {
                const todoId = action.meta.arg;

                state.todos = state.todos.filter((todo) => todo.data.id !== todoId && todo.data.parentId !== todoId);

                state.loading = false;
            }) */
            .addCase(deleteTodoFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addTodo, addSubTodo, deleteTag, updateTodos, updateTodo, updateSubTodo } = todoSlice.actions;
export default todoSlice.reducer;
