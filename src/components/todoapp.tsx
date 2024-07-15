import React from 'react';
import { styled } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodosFromFirebase, syncTodosWithFirebase } from '../store/todoSlice';
import TodoList from './todolist';
import TodoInput from './todoinput';
import TodoToolbar from './todotoolbar';
import HashtagSettings from './hashtagsettings';
import { AppDispatch, RootState } from '../store/store';

const Appbody = styled.div`
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);

    display: flex;
    width: 600px;
    min-height: 600px;
    margin: 0;
    padding: 10px;

    border: none;
    border-radius: 10px;
    background-color: #202020;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: column;
    flex-wrap: wrap;
    justify-items: flex-start;
`;

const TodoTitle = styled.div`
    display: flex;
    margin: 20px 0 25px 0;

    font-size: 40px;
    font-family: 'Ubuntu', sans-serif;
    color: #757575;

    justify-content: center;
    align-items: center;

    user-select: none;
`;

const Loader = styled.div`
    display: flex;
    margin: 20px 0 25px 0;

    font-size: 40px;
    font-family: 'Ubuntu', sans-serif;
    color: #757575;

    justify-content: center;
    align-items: center;

    user-select: none;
`;

const Todoapp: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.todos);

    const todos = useSelector((state: RootState) => state.todos.todos);

    React.useEffect(() => {
        dispatch(fetchTodosFromFirebase());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(syncTodosWithFirebase(todos));
    }, [todos, dispatch]);

    const LoaderElem = () => {
        if (loading) {
            return <Loader>Loading...</Loader>;
        }
        return;
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Appbody>
                <TodoTitle>TodoApp</TodoTitle>
                <TodoInput />
                <HashtagSettings />
                <TodoToolbar />
                {LoaderElem()}
                <TodoList />
            </Appbody>
        </>
    );
};

export default Todoapp;
