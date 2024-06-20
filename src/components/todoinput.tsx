import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addTodo } from "../store/todoSlice.ts";
import { v4 as uuidv4 } from "uuid";
import { TodoItemProps } from "../controls/types.ts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store.ts";

const InputContainer = styled.div`
    display: flex;
    height: 55px;
    margin: 5px 0 5px 0;
    padding: 0;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    align-items: center;
    justify-content: space-between;
`;

const InputForm = styled.input`
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 0 0 15px;

    font-family: "Ubuntu", sans-serif;
    color: #dfdfdf;
    font-size: 25px;

    background-color: #202020;
    border: none;
    outline: none;

    align-items: center;
    justify-content: left;
`;

const InputDate = styled.input``;

const InputButton = styled.button`
    display: flex;
    width: 50px;
    height: 45px;
    margin: 0 5px 0 0;
    padding: 0;

    background-color: #3b3b3b;
    border: none;
    border-radius: 5px;

    transition: 1s, flex-basis 0.1s;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    &:hover {
        background-color: #323232;
        transition: 0s;
    }

    &:active {
        background-color: #282828;
    }
`;

const TodoInput: React.FC = () => {
    const [content, setContent] = React.useState("");
    const [targetDate, setTargetDate] = React.useState("");
    const dispatch = useDispatch();

    const todosFromRedux = useSelector((state: RootState) => state.todos);

    const handleAddTodo = () => {
        const newTodo: TodoItemProps = {
            key: uuidv4(),
            data: {
                id: uuidv4(),
                content: content,
                priority: "medium" as "none" | "low" | "medium" | "high",
                doneStatus: false,
                tags: [],
                timeOfCreation: new Date(),
                timeOfCompletion: undefined,
                targetDate: new Date(targetDate),
                type: "parent",
                childrenKeys: [],
            },
        };

        dispatch(addTodo(newTodo));
        setContent("");
        setTargetDate("");
        console.log(todosFromRedux);
    };

    return (
        <>
            <InputContainer>
                <InputForm
                    type="text"
                    value={content}
                    placeholder="Вводить задачу сюда"
                    onChange={(e) => setContent(e.target.value)}
                />
                <InputDate
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                />
                <InputButton onClick={() => handleAddTodo()} />
            </InputContainer>
        </>
    );
};

export default TodoInput;
