import React from 'react';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';

import { RootState } from '../store/store';
import { TodoItemProps, GroupedTodos } from '../controls/types';
import { sortTodos, groupTodos, groupTitle } from './utils/todoUtils';

import GroupOfTodos from './groupOfTodos';

const Wrapper = styled.div`
    position: relative;

    margin-top: 5px;
`;

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const options = useSelector((state: RootState) => state.options);

    const sortedTodos = sortTodos(todos.todos, options.sortOption);

    const undoneTodos = (): TodoItemProps[] => {
        const todos = [...sortedTodos];
        return todos.filter((todo) => !todo.data.doneStatus);
    };

    const doneTodos = (): TodoItemProps[] => {
        const todos = [...sortedTodos];
        return todos.filter((todo) => todo.data.doneStatus);
    };

    const groupedTodos: GroupedTodos = Object.entries(groupTodos(undoneTodos(), options.groupOption)).map(([key, props]) => ({
        key: key,
        title: groupTitle(options.groupOption, key),
        items: props,
    }));

    return (
        <Wrapper>
            {groupedTodos.length > 0 &&
                groupedTodos.map(
                    (group) => group.items.length > 0 && <GroupOfTodos key={group.key} title={group.title} todos={group.items} />,
                )}
            {doneTodos().length > 0 && <GroupOfTodos title="Выполненные задачи" todos={doneTodos()} />}
        </Wrapper>
    );
};

export default TodoList;
