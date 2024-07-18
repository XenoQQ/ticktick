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

const SublistContainer = styled.div`
    display: flex;

    padding-left: 20px;

    flex-direction: column;
`;

const Grouptitle = styled.div`
    padding: 5px 0 5px 5px;
    margin-top: 5px;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 20px;
`;

const TodoList: React.FC = () => {
    const todos = useSelector((state: RootState) => state.todos);
    const options = useSelector((state: RootState) => state.options);

    const sortedTodos = () => {
        const todosCopy = [...todos.todos]; // Создаем копию массива
        switch (options.sortOption) {
            case 'date':
                return todosCopy.sort((a, b) => {
                    const dateA = a.data.targetDate ? new Date(a.data.targetDate).getTime() : null;
                    const dateB = b.data.targetDate ? new Date(b.data.targetDate).getTime() : null;

                    if (dateA === null) return 1;
                    if (dateB === null) return -1;
                    return dateA - dateB;
                });

            case 'name':
                return todosCopy.sort((a, b) => a.data.content.localeCompare(b.data.content));

            case 'tag':
                return todosCopy.sort((a, b) => a.data.tags[0].localeCompare(b.data.tags[0]));

            case 'priority': {
                const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
                return todosCopy.sort((a, b) => priorityOrder[a.data.priority] - priorityOrder[b.data.priority]);
            }
            case 'none':
            default:
                return todosCopy.sort((a, b) => {
                    const dateA = a.data.timeOfCreation ? new Date(a.data.timeOfCreation).getTime() : null;
                    const dateB = b.data.timeOfCreation ? new Date(b.data.timeOfCreation).getTime() : null;

                    if (dateA === null) return 1;
                    if (dateB === null) return -1;
                    return dateA - dateB;
                });
        }
    };

    const groupTodos = (groupCase: string) => {
        const groupKey = (key: string) => {
            return sortedTodos().reduce(
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

    const groupedTodos: GroupedTodos = Object.entries(groupTodos(options.groupOption));

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
                    {key && key !== 'undefined' && <Grouptitle>{groupTitle(options.groupOption, key)}</Grouptitle>}
                    {group.map(
                        (todo) =>
                            !todo.data.parentId && (
                                <>
                                    <TodoItem key={todo.key} data={todo.data} />
                                    <SublistContainer>
                                        {todos.todos
                                            .filter((subTodo) => subTodo.data.parentId === todo.data.id)
                                            .map((subTodo) => (
                                                <TodoItem key={subTodo.key} data={subTodo.data} />
                                            ))}
                                    </SublistContainer>
                                </>
                            ),
                    )}
                </TodolistContainer>
            ))}
        </>
    );
};

export default TodoList;
