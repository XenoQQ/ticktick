import React from "react";
import styled from "styled-components";
import { addTodo } from "../store/todoSlice.ts";
import { v4 as uuidv4 } from "uuid";
import { TodoItemProps } from "../controls/types.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store.ts";
import Datepicker from "./datepicker.tsx";
import IconArrowDown from "../assets/arrow-down.png";

const InputContainer = styled.div<{ priority: string }>`
    display: flex;
    height: 55px;
    margin: 5px 0 5px 0;
    padding: 0;

    border: 3px solid;
    border-radius: 5px;
    border-color: ${({ priority }) => {
        switch (priority) {
            case "none":
                return "#3b3b3b";
            case "low":
                return "#4772fa";
            case "medium":
                return "#FAA80C";
            case "high":
                return "#D52b24";
            default:
                return "#3b3b3b";
        }
    }};

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

const PriorityButton = styled.button`
    display: flex;
    width: 30px;
    height: 25px;
    margin: 0 10px 0 0;
    padding: 0;

    background: no-repeat center/100% url(${IconArrowDown});
    border: none;
    border-radius: 5px;

    transition:
        1s,
        flex-basis 0.1s;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    &:hover {
        background-size: 120%;
        transition: background-size 0.3s ease;
    }
`;

const PriorityMenu = styled.div`
    position: absolute;
    right: -98px;
    top: 60px;

    display: flex;
    width: 140px;
    height: 60px;

    padding: 0 5px 0 5px;

    background-color: #202020;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    flex-direction: row;

    align-items: center;
    justify-content: space-between;

    flex-wrap: wrap;
`;

const PriorityMenuTitle = styled.div`
    display: flex;
    width: 100%;

    font-family: "Ubuntu", sans-serif;
    color: #757575;
    font-size: 15px;

    justify-content: center;
`;

const PriorityMenuButton = styled.div<{ boColor: string }>`
    display: flex;
    width: 25px;
    height: 25px;

    background-color: #202020;

    border: 3px solid ${({ boColor }) => boColor};
    border-radius: 5px;

    cursor: pointer;
`;

const TodoInput: React.FC = () => {
    const [content, setContent] = React.useState<string>("");
    const [targetDate, setTargetDate] = React.useState<Date | null>(null);
    const [priorityMenuVisible, setPriorityMenuVisible] = React.useState<boolean>(false);
    const [priority, setPriority] = React.useState<"none" | "low" | "medium" | "high">("none");

    const dispatch = useDispatch();
    const todosFromRedux = useSelector((state: RootState) => state.todos);

    const handleAddTodo = () => {
        if (content) {
            const tags = content.match(/#\w+/g) || [];
            const contentWithoutTags = content.replace(/#\w+/g, "").trim();

            const newTodo: TodoItemProps = {
                key: uuidv4(),
                data: {
                    id: uuidv4(),
                    content: contentWithoutTags,
                    priority: priority,
                    doneStatus: false,
                    tags: tags,
                    timeOfCreation: new Date().toString(),
                    timeOfCompletion: null,
                    targetDate: targetDate?.toString() ?? null,
                    type: "parent",
                    childrenKeys: [],
                },
            };

            dispatch(addTodo(newTodo));
            setContent("");
            setPriority("none");
            setTargetDate(null);
            console.log(todosFromRedux);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleAddTodo();
        }
    };

    const handlePriorityMenuClick = () => {
        setPriorityMenuVisible((prevstate) => !prevstate);
    };

    const handlePrioritySelect = (priority: "none" | "low" | "medium" | "high") => {
        setPriority(priority);
        setPriorityMenuVisible((prevstate) => !prevstate);
    };

    return (
        <>
            <InputContainer priority={priority}>
                <InputForm
                    id="input_form"
                    type="text"
                    value={content}
                    placeholder="Вводить задачу сюда"
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Datepicker value={targetDate} onChange={(date) => setTargetDate(date)} />

                <PriorityButton onClick={() => handlePriorityMenuClick()} />
                {priorityMenuVisible && (
                    <PriorityMenu>
                        <PriorityMenuTitle>Приоритет</PriorityMenuTitle>
                        <PriorityMenuButton boColor="#D52b24" onClick={() => handlePrioritySelect("high")} />
                        <PriorityMenuButton boColor="#FAA80C" onClick={() => handlePrioritySelect("medium")} />
                        <PriorityMenuButton boColor="#4772fa" onClick={() => handlePrioritySelect("low")} />
                        <PriorityMenuButton boColor="#3b3b3b" onClick={() => handlePrioritySelect("none")} />
                    </PriorityMenu>
                )}
            </InputContainer>
        </>
    );
};

export default TodoInput;
