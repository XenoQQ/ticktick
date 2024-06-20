import React from "react";
import styled from "styled-components";
import TodoItem from "./todoitem.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";

const TodolistContainer = styled.div`
    display: flex;

    flex-direction: column;
`;

const TodoList: React.FC = () => {
    const todosFromRedux = useSelector((state: RootState) => state.todos);
    return (
        <>
            <TodolistContainer>
                {todosFromRedux.map((todo) => (
                    <TodoItem key={todo.key} data={todo.data} />
                ))}
            </TodolistContainer>
        </>
    );
};

export default TodoList;
