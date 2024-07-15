import { collection, addDoc } from 'firebase/firestore';
import { db } from '../index';
import { createAction } from '@reduxjs/toolkit';
import { TodoItemProps } from '../controls/types';
import { AppThunk } from './store';

export const addTodoRequest = createAction('ADD_TODO_REQUEST');
export const saveTodosSuccess = createAction('SAVE_TODOS_SUCCESS');
export const saveTodosFailure = createAction<string>('SAVE_TODOS_FAILURE');

export const saveTodosToFirebase = (todos: TodoItemProps[]): AppThunk => {
    return async (dispatch) => {
        try {
            const todosCollection = collection(db, 'todos');

            for (const todo of todos) {
                // Добавляем отладочное сообщение
                console.log('Saving todo:', todo);

                // Проверка структуры данных
                if (!todo.key || !todo.data) {
                    throw new Error('Invalid todo structure');
                }

                await addDoc(todosCollection, todo);
            }

            dispatch(saveTodosSuccess());
        } catch (error) {
            console.error('Error saving todos to Firebase: ', error);
            if (error instanceof Error) {
                dispatch(saveTodosFailure(error.message));
            } else {
                dispatch(saveTodosFailure('An unknown error occurred'));
            }
        }
    };
};
