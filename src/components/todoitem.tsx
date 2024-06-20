import React from "react";
import styled from "styled-components";
import Checkmark from "../assets/icon-checked-grey.png";
import { TodoItemProps } from "../controls/types";

const Container = styled.div`
    display: flex;
    height: 45px;
    padding: 5px;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;
`;

const Checkbox = styled.div<{ checked: boolean }>`
    display: flex;
    height: calc(100% - 6px);
    aspect-ratio: 1/1;
    border-radius: 5px;
    border: 3px solid #3b3b3b;
    background: no-repeat center url(${Checkmark});
    background-size: ${({ checked }) => (checked ? "100%" : "0%")};
    transition: background-size 0.3s;
    cursor: pointer;
`;

const Textfield = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    color: #757575;
    font-size: 25px;

    border: 1px solid red;

    background-color: #202020;

    list-style: none;
    align-items: center;
`;

/* const Menubutton = styled.button``; */



const TodoItem: React.FC<TodoItemProps> = ({ data }) => {
    return (
        <>
            <Container draggable>
                <Checkbox checked={data.doneStatus} />
                <Textfield>{data.content}</Textfield>
            </Container>
        </>
    );
};

export default TodoItem;
