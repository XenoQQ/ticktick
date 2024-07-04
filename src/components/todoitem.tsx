import React from 'react';
import { styled, keyframes, css } from 'styled-components';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import { toggleDoneStatus, deleteTodo } from '../store/todoSlice';
import IconMenu from '../assets/images/icon-menu.png';

const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Container = styled.div<{ onFadeOut: boolean }>`
    position: relative;

    display: flex;
    height: 45px;

    padding: 5px;
    margin: 5px 0 0 0;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    ${({ onFadeOut }) =>
        onFadeOut
            ? css`
                  animation: ${fadeOut} 1s ease;
              `
            : css`
                  animation: ${fadeIn} 1s ease;
              `}
`;

const Checkbox = styled.div<{ checked: boolean; priority: string }>`
    display: flex;
    height: calc(100% - 6px);
    aspect-ratio: 1/1;

    margin-right: 10px;

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

    background-color: #202020;

    font-family: 'Ubuntu', sans-serif;
    font-size: 25px;
    color: #757575;

    list-style: none;
    align-items: center;
`;

const MenuButton = styled.div`
    height: calc(100% - 6px);
    aspect-ratio: 1/1;

    border: 3px solid #3b3b3b;
    border-radius: 5px;
    background: no-repeat center/80% url(${IconMenu});

    transition: 1s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }
`;

const MenuContainer = styled.div`
    position: absolute;
    right: -157px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    width: 134px;
    height: 54px;

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
    const [onFadeOut, setOnFadeOut] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const handleComplete = () => {
        dispatch(toggleDoneStatus(data.id));
    };

    const handleMenuVisible = () => {
        setMenuVisible((prevstate) => !prevstate);
    };

    const handleDelete = () => {
        setMenuVisible(false);
        setOnFadeOut(true);
        setTimeout(() => {
            dispatch(deleteTodo(data.id));
        }, 1000);
    };

    return (
        <>
            <Container draggable onFadeOut={onFadeOut}>
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
