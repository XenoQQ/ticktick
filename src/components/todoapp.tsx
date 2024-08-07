import React from 'react';
import { styled, keyframes } from 'styled-components';
import { useSelector } from 'react-redux';

import { RootState } from '../store/store';

import TodoList from './todolist';
import TodoInput from './todoinput';
import TodoToolbar from './todotoolbar';
import useFirebaseSync from './utils/useFirebaseSync';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AppBody = styled.div`
    position: relative;
    top: 30px;

    display: flex;
    width: 600px;
    min-height: 600px;

    margin: 0 auto;
    padding: 10px;

    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.backgroundColor};
    box-shadow: ${({ theme }) => theme.boxShadow.default};

    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;

    @media (max-width: 768px) {
        width: 95vw;
        padding: 0 2.5vw;
        min-height: 100vh;
        top: 0px;
        border-radius: 0px;
    }
`;

const TodoTitle = styled.h1`
    display: flex;

    margin: 20px 0;

    font-size: 2.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.uiTextColor};

    justify-content: center;
    align-items: center;

    user-select: none;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const Spinner = styled.div`
    position: absolute;

    border: 4px solid ${({ theme }) => theme.colors.uiTextColor};
    border-top: 4px solid ${({ theme }) => theme.colors.backgroundColor};
    border-radius: 50%;

    width: 10px;
    height: 10px;
    animation: ${spin} 2s linear infinite;
`;

const TodoApp: React.FC = () => {
    useFirebaseSync();

    const { loading, error } = useSelector((state: RootState) => state.todos);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AppBody>
            <TodoTitle>TodoApp</TodoTitle>
            <TodoInput />
            <TodoToolbar />
            {loading && <Spinner />}
            <TodoList />
        </AppBody>
    );
};

export default TodoApp;
