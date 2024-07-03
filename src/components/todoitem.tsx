import React from 'react';
import { styled, keyframes } from 'styled-components';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import { toggleDoneStatus, deleteTodo } from '../store/todoSlice';
import IconMenu from '../assets/images/icon-menu.png';

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

const MenuButton = styled.div`
    width: 40px;
    aspect-ratio: 1/1;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    background: no-repeat center/80% url(${IconMenu});
`;

const MenuContainer = styled.div`
    position: absolute;
    right: -100px;
    top: 150px;

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

const DeleteButton = styled.div`
    width: 30px;
    height: 30px;

    border: 3px solid #3b3b3b;
    border-radius: 5px;
`;

const TodoItem: React.FC<TodoItemProps> = ({ data }) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const handleComplete = () => {
        dispatch(toggleDoneStatus(data.id));
    };

    const handleMenuVisible = () => {
        setMenuVisible((prevstate) => !prevstate);
    };

    const handleDelete = () => {
        dispatch(deleteTodo(data.id));
    };
    return (
        <>
            <Container draggable>
                <Checkbox checked={data.doneStatus} priority={data.priority} onClick={() => handleComplete()} />
                <Textfield>{data.content}</Textfield>
                <MenuButton onClick={() => handleMenuVisible()} />
                {menuVisible && (
                    <MenuContainer>
                        <DeleteButton onClick={() => handleDelete()} />
                    </MenuContainer>
                )}
            </Container>
        </>
    );
};

export default TodoItem;
