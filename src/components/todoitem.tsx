import React from 'react';
import styled, { keyframes } from 'styled-components';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import { toggleDoneStatus } from '../store/todoSlice';

const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const Container = styled.div`
    display: flex;
    height: 45px;
    padding: 5px;

    margin: 5px 0 0 0;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    animation: ${fadeIn} 1s ease;
`;

const Checkbox = styled.div<{ checked: boolean; priority: string }>`
    margin-right: 10px;

    display: flex;
    height: calc(100% - 6px);

    aspect-ratio: 1/1;
    border-radius: 5px;
    border: 3px solid;
    border-color: ${({ priority }) => {
        switch (priority) {
            case 'none':
                return '#3b3b3b';
            case 'low':
                return '#4772fa';
            case 'medium':
                return '#FAA80C';
            case 'high':
                return '#D52b24';
            default:
                return '#3b3b3b';
        }
    }};

    transition: 1s;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }

    &::before {
        content: '';
        display: block;
        position: relative;
        top: 40%;
        left: 50%;
        width: 16px;
        height: 27px;
        border: solid;
        border-width: 0 4px 4px 0;
        border-color: ${({ priority }) => {
            switch (priority) {
                case 'none':
                    return '#3b3b3b';
                case 'low':
                    return '#4772fa';
                case 'medium':
                    return '#FAA80C';
                case 'high':
                    return '#D52b24';
                default:
                    return '#3b3b3b';
            }
        }};
        transform: translate(-50%, -50%) rotate(35deg);
        opacity: ${({ checked }) => (checked ? '1' : '0')};
        transition: opacity 0.3s ease;
    }
`;

const Textfield = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    font-size: 25px;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 25px;

    background-color: #202020;

    list-style: none;
    align-items: center;
`;

/* const Menubutton = styled.button``; */

const TodoItem: React.FC<TodoItemProps> = ({ data }) => {
    const dispatch = useDispatch();

    const handleComplete = () => {
        dispatch(toggleDoneStatus(data.id));
        console.log(data);
    };
    return (
        <>
            <Container draggable>
                <Checkbox checked={data.doneStatus} priority={data.priority} onClick={() => handleComplete()} />
                <Textfield>{data.content}</Textfield>
            </Container>
        </>
    );
};

export default TodoItem;
