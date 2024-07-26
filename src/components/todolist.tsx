import React from 'react';
import { styled, css } from 'styled-components';
import TodoItem from './todoitem';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TodoItemProps, PriorityMap } from '../controls/types';
import IconOpen from '../assets/images/icon-open.png';

const TodolistContainer = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 5px;
`;

const SublistContainer = styled.div`
    display: flex;
    padding-left: 25px;
    flex-direction: column;
`;

const GroupHeader = styled.div`
    position: relative;

    display: flex;
    height: 25px;

    margin-top: 5px;
    padding: 8px 0;
    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 15px;
`;

const Grouptitle = styled.div`
    display: flex;

    width: auto;
    margin: 4px 0 0 19px;
`;

const TodoWholeContainer = styled.div`
    border-radius: 5px;

    &:hover {
        background-color: #2a2a2a69;
    }
`;

const OpenButton = styled.div<{ $isopen: boolean }>`
    z-index: 8888;

    position: absolute;

    top: 13px;

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

const TodoItemContainer = styled.div`
    position: relative;

    width: 100%;

    display: flex;

    flex-direction: row;
`;

const TodoList: React.FC = () => {
    const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
    const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

    const todos = useSelector((state: RootState) => state.todos);
    const options = useSelector((state: RootState) => state.options);

    React.useEffect(() => {
        const newOpenGroups: Record<string, boolean> = {};
        Object.keys(groupTodos(options.groupOption)).forEach((key) => {
            newOpenGroups[key] = true;
        });
        setOpenGroups(newOpenGroups);
    }, [options.groupOption, todos]);

    const toggleOpenGroup = (key: string) => {
        setOpenGroups((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    React.useEffect(() => {
        const newOpenItems: Record<string, boolean> = {};
        todos.todos.forEach((todo) => {
            newOpenItems[todo.data.id] = true;
        });
        setOpenItems(newOpenItems);
    }, [todos]);

    const toggleOpenItem = (id: string) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const sortedTodos = () => {
        const todosCopy = [...todos.todos];
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
                    groupValues.forEach((groupValue: string) => {
                        if (!acc[groupValue]) {
                            acc[groupValue] = [];
                        }
                        acc[groupValue].push(item);
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
        low: 'Низкий приоритет',
        medium: 'Средний приоритет',
        high: 'Высокий приоритет',
    };

    type GroupedTodos = [string, TodoItemProps[]][];

    const groupedTodos: GroupedTodos = Object.entries(groupTodos(options.groupOption));

    const monthNames = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];

    const groupTitle = (groupOption: string, key: string) => {
        const formatDate = (dateString: string | null) => {
            if (!dateString) {
                return '';
            }

            const date = new Date(dateString);

            const day = String(date.getDate());
            const month = String(monthNames[date.getMonth() + 1]);

            return dateString !== 'null' ? `${day} ${month}` : 'Без даты';
        };
        switch (groupOption) {
            case 'date':
                return formatDate(key.toString());
            case 'priority':
                return groupKeyTranslations[key];
            case 'tag':
                return key === 'none' ? 'Нет меток' : key;
            case 'none':
            default:
                return '';
        }
    };

    return (
        <>
            {groupedTodos.map(([key, group]) => (
                <TodolistContainer key={key}>
                    {key && key !== 'undefined' && (
                        <GroupHeader>
                            <OpenButton $isopen={!!openGroups[key]} onClick={() => toggleOpenGroup(key)} />
                            <Grouptitle>{groupTitle(options.groupOption, key)}</Grouptitle>
                        </GroupHeader>
                    )}
                    {(options.groupOption === 'none' || openGroups[key]) &&
                        group.map(
                            (todo) =>
                                !todo.data.parentId && (
                                    <TodoWholeContainer key={todo.data.id}>
                                        <TodoItemContainer>
                                            {todos.todos.find((elem) => elem.data.parentId === todo.data.id) && (
                                                <OpenButton
                                                    $isopen={!!openItems[todo.data.id]}
                                                    onClick={() => toggleOpenItem(todo.data.id)}
                                                />
                                            )}
                                            <TodoItem key={todo.key} data={todo.data}></TodoItem>
                                        </TodoItemContainer>
                                        {openItems[todo.data.id] && (
                                            <SublistContainer>
                                                {sortedTodos()
                                                    .filter((subTodo) => subTodo.data.parentId === todo.data.id)
                                                    .map((subTodo) => (
                                                        <TodoItem key={subTodo.key} data={subTodo.data} />
                                                    ))}
                                            </SublistContainer>
                                        )}
                                    </TodoWholeContainer>
                                ),
                        )}
                </TodolistContainer>
            ))}
        </>
    );
};

export default TodoList;
