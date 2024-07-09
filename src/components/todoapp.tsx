import React from 'react';
import { styled } from 'styled-components';
import TodoList from './todolist';
import TodoInput from './todoinput';
import TodoToolbar from './todotoolbar';
import HashtagSettings from './hashtagsettings';

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
`;

const Todoapp: React.FC = () => {
    return (
        <>
            <Appbody>
                <TodoTitle>TodoApp</TodoTitle>
                <TodoInput />
                <HashtagSettings />
                <TodoToolbar />
                <TodoList />
            </Appbody>
        </>
    );
};

export default Todoapp;
