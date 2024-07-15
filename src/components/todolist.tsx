import React from 'react';
import { styled } from 'styled-components';
import TodoItem from './todoitem';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TodoItemProps, PriorityMap } from '../controls/types';

const TodolistContainer = styled.div`
    display: flex;

    margin-top: 5px;

    flex-direction: column;
`;

const Grouptitle = styled.div`
    padding: 5px 0 5px 5px;
    margin-top: 5px;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 15px;
`;

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const groupSwitch = useSelector((state: RootState) => state.groupSwitch);

    const groupTodos = (groupCase: string) => {
        const groupKey = (key: string) => {
            return todos.reduce(
                (acc: Record<string, TodoItemProps[]>, item) => {
                    const groupValues = Array.isArray(item.data[key]) ? item.data[key] : [item.data[key]];
                    groupValues.forEach((groupvalue: string) => {
                        if (!acc[groupvalue]) {
                            acc[groupvalue] = [];
                        }
                        acc[groupvalue].push(item);
                    });
                    return acc;
                },
                {} as Record<string, TodoItemProps[]>,
            );
        };

        switch (groupCase) {
            case 'date':
                return groupKey('targetDate');
            case 'priority':
                return groupKey('priority');
            case 'tag':
                return groupKey('tags');
            case 'none':
            default:
                return groupKey('');
        }
    };

    const groupKeyTranslations: PriorityMap = {
        none: 'Нет',
        low: 'Не то чтобы очень важно',
        medium: 'Ну так, средней важности',
        high: 'Пиздец как важно, прямо очень!',
    };

    type GroupedTodos = [string, TodoItemProps[]][];

    const groupedTodos: GroupedTodos = Object.entries(groupTodos(groupSwitch));

    const groupTitle = (groupOption: string, key: string) => {
        const formatDate = (dateString: string | null) => {
            if (!dateString) {
                return '';
            }

            const date = new Date(dateString);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return dateString !== 'null' ? `${day}/${month}/${year}` : 'Без даты';
        };
        switch (groupOption) {
            case 'date':
                return formatDate(key.toString());
            case 'priority':
                return groupKeyTranslations[key];
            case 'tag':
                return key;
            case 'none':
            default:
                return '';
        }
    };

    return (
        <>
            {groupedTodos.map(([key, group]) => (
                <TodolistContainer key={key}>
                    {key && key !== 'undefined' && <Grouptitle>{groupTitle(groupSwitch, key)}</Grouptitle>}
                    {group.map((todo) => (
                        <TodoItem key={todo.key} data={todo.data} />
                    ))}
                </TodolistContainer>
            ))}
        </>
    );
};

export default TodoList;
