import React, { useState } from 'react';
import { styled, css } from 'styled-components';

import { TodoItemProps } from '../controls/types';

import TodoContainer from './todoContainer';

import IconOpen from '../assets/images/icon-open.png';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 5px;
`;

const Header = styled.div`
    position: relative;

    display: flex;
    height: 25px;

    margin-top: 5px;
    padding: 10px 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.uiTextColor};
    font-size: 15px;
`;

const Title = styled.div`
    display: flex;

    width: auto;
    margin: 5px 0 0 20px;
`;

const OpenButton = styled.div<{ $isopen: boolean }>`
    z-index: 1000;
    position: absolute;

    top: 15px;

    width: 15px;
    height: 15px;

    background: no-repeat center/80% url(${IconOpen});

    ${({ $isopen }) =>
        !$isopen
            ? css`
                  transform: rotate(-90deg);
              `
            : css``}

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

interface GroupProps {
    title: string;
    todos: TodoItemProps[];
}

const GroupOfTodos: React.FC<GroupProps> = ({ title, todos }) => {
    const [isGroupOpen, setIsGroupOpen] = useState<boolean>(true);

    return (
        <Wrapper>
            {title !== '' && (
                <Header>
                    <OpenButton $isopen={isGroupOpen} onClick={() => setIsGroupOpen((prevstate) => !prevstate)} />
                    <Title>{title}</Title>
                </Header>
            )}
            {isGroupOpen && todos.map((todo) => <TodoContainer key={todo.key} data={todo.data} />)}
        </Wrapper>
    );
};

export default GroupOfTodos;
