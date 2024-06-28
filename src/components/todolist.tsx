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
    const todos = useSelector((state: RootState) => state.todos);
    const groupSwitch = useSelector((state: RootState) => state.groupSwitch);

    const groupTodos = (groupCase: string) => {
        const groupKey = (key: string) => {
            return todos.reduce((acc, item) => {
                const groupValues = Array.isArray(item.data[key]) ? item.data[key] : [item.data[key]];
                groupValues.forEach((groupvalue) => {
                    if (!acc[groupvalue]) {
                        acc[groupvalue] = [];
                    }
                    acc[groupvalue].push(item);
                });
                return acc;
            }, {});
        };

        switch (groupCase) {
            case "date":
                return groupKey("timeOfCreation");
            case "priority":
                return groupKey("priority");
            case "tag":
                return groupKey("tags");
            case "none":
            default:
                return todos;
        }
    };
    const groupedTodos = Object.entries(groupTodos(groupSwitch));

    console.log(groupedTodos);

    return (
        <>
            <TodolistContainer>
                {todos.map((todo) => (
                    <TodoItem key={todo.key} data={todo.data} />
                ))}
            </TodolistContainer>
        </>
    );
};

export default TodoList;
