import React, { useState } from 'react';
import { styled, css } from 'styled-components';

import { TodoItemData } from '../controls/types';

import TodoItem from './todoitem';
import TodoSubItem from './todoSubItem';

import IconOpen from '../assets/images/icon-open.png';

const Wrapper = styled.div`
    position: relative;
`;

const SubTodosWrapper = styled.div`
    display: flex;
    padding-left: 25px;
    flex-direction: column;
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

const TodoContainer: React.FC<{ data: TodoItemData }> = ({ data }) => {
    const [isSubOpen, setIsSubOpen] = useState<boolean>(true);

    return (
        <Wrapper>
            {data.children.length > 0 && <OpenButton $isopen={isSubOpen} onClick={() => setIsSubOpen((prevstate) => !prevstate)} />}
            <TodoItem data={data} />
            {isSubOpen && (
                <SubTodosWrapper>
                    {data.children.map((child) => (
                        <TodoSubItem key={child.key} data={child.data} />
                    ))}
                </SubTodosWrapper>
            )}
        </Wrapper>
    );
};

export default TodoContainer;
