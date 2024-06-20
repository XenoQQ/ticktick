import React from "react";
import styled from "styled-components";
import TodoList from "./todolist.tsx";
import TodoInput from "./todoinput.tsx";

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

    flex-direction: column;
`;

const Todoapp: React.FC = () => {
    return (
        <>
            <Appbody>
                <TodoInput />
                <TodoList />
            </Appbody>
        </>
    );
};

export default Todoapp;
