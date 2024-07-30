import React from 'react';
import { styled, css } from 'styled-components';
import TodoItem from './todoitem';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { TodoItemProps, PriorityMap } from '../controls/types';
import { updateTodos } from '../store/todoSlice';
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

const TodoWholeContainer = styled.div<{ $overitem: boolean; $isallowed: boolean }>`
    border-radius: 5px;

    &:hover {
        background-color: #2a2a2a69;
    }

    ${({ $overitem, $isallowed }) =>
        $overitem
            ? $isallowed
                ? css`
                      box-shadow: 0 0 0 1px #4772fa;
                      background-color: #2a2a2a69;
                      z-index: 1000;

=                  `
                : css`
                      box-shadow: 0 0 0 1px #d52b24;
                      background-color: #2a2a2a69;
                      z-index: 1000;

=
                  `
            : css``}
`;

const OpenButton = styled.div<{ $isopen: boolean }>`
    z-index: 1000;
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

const SubItemContainer = styled.div<{ $overitem: boolean; $isallowed: boolean }>`
    width: 100%;
    height: 100%;

    position: relative;
    border-radius: 5px;

    ${({ $overitem, $isallowed }) =>
        $overitem
            ? $isallowed
                ? css`
                      box-shadow: 0 0 0 1px #4772fa;
                      background-color: #2a2a2a69;
                      z-index: 1000;
                  `
                : css`
                      box-shadow: 0 0 0 1px #d52b24;
                      background-color: #2a2a2a69;
                      z-index: 1000;
                  `
            : css``}
`;

const TodoList: React.FC = () => {
    const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
    const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
    const [openDoneTodos, setOpenDoneTodos] = React.useState<boolean>(true);

    const todos = useSelector((state: RootState) => state.todos);
    const options = useSelector((state: RootState) => state.options);

    React.useEffect(() => {
        const newOpenGroups: Record<string, boolean> = {};
        Object.keys(groupTodos(options.groupOption)).forEach((key) => {
            newOpenGroups[key] = true;
        });
        setOpenGroups(newOpenGroups);
    }, [options.groupOption]);

    const toggleOpenGroup = (key: string) => {
        setOpenGroups((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const toggleOpenDoneTodos = () => {
        setOpenDoneTodos((prevstate) => !prevstate);
    };

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
            case 'createDate':
                return todosCopy.sort((a, b) => {
                    const dateA = a.data.timeOfCreation ? new Date(a.data.timeOfCreation).getTime() : null;
                    const dateB = b.data.timeOfCreation ? new Date(b.data.timeOfCreation).getTime() : null;

                    if (dateA === null) return 1;
                    if (dateB === null) return -1;
                    return dateA - dateB;
                });

            case 'none':
            default:
                return todosCopy;
        }
    };

    const undoneTodos = () => {
        const todos = [...sortedTodos()];
        return todos.filter((todo) => !todo.data.doneStatus);
    };

    const doneTodos = () => {
        const todos = [...sortedTodos()];
        return todos.filter((todo) => todo.data.doneStatus);
    };

    const groupTodos = (groupCase: string) => {
        const groupKey = (key: string) => {
            if (key === 'targetDate') {
                return undoneTodos().reduce(
                    (acc: Record<string, TodoItemProps[]>, item: TodoItemProps) => {
                        const groupValues = [
                            'Без даты',
                            'Просрочено',
                            'Сегодня',
                            'Завтра',
                            'Следующие 7 дней',
                            'Следующие 30 дней',
                            'Позже',
                        ];
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                        groupValues.forEach((groupValue: string) => {
                            if (!acc[groupValue]) {
                                acc[groupValue] = [];
                            }
                        });

                        if (!item.data.parentId) {
                            if (!item.data.targetDate) {
                                acc['Без даты'].push(item);
                            } else {
                                const targetDate = new Date(item.data.targetDate);
                                const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

                                if (targetDay < today) {
                                    acc['Просрочено'].push(item);
                                } else if (targetDay.getTime() === today.getTime()) {
                                    acc['Сегодня'].push(item);
                                } else {
                                    const tomorrow = new Date(today);
                                    tomorrow.setDate(today.getDate() + 1);
                                    const next7Days = new Date(today);
                                    next7Days.setDate(today.getDate() + 7);
                                    const next30Days = new Date(today);
                                    next30Days.setDate(today.getDate() + 30);

                                    if (targetDay.getTime() === tomorrow.getTime()) {
                                        acc['Завтра'].push(item);
                                    } else if (targetDay <= next7Days) {
                                        acc['Следующие 7 дней'].push(item);
                                    } else if (targetDay <= next30Days) {
                                        acc['Следующие 30 дней'].push(item);
                                    } else {
                                        acc['Позже'].push(item);
                                    }
                                }
                            }
                        }

                        console.log(acc);
                        return acc;
                    },
                    {} as Record<string, TodoItemProps[]>,
                );
            } else {
                return undoneTodos().reduce(
                    (acc: Record<string, TodoItemProps[]>, item: TodoItemProps) => {
                        const groupValues = Array.isArray(item.data[key]) ? item.data[key] : [item.data[key]];
                        groupValues.forEach((groupValue: string) => {
                            if (!acc[groupValue]) {
                                acc[groupValue] = [];
                            }
                            if (!item.data.parentId) {
                                acc[groupValue].push(item);
                            }
                        });

                        return acc;
                    },

                    {} as Record<string, TodoItemProps[]>,
                );
            }
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

    const groupTitle = (groupOption: string, key: string) => {
        const formatDate = (key: string) => {
            switch (key) {
                case 'Без даты':
                case 'Просрочено':
                case 'Сегодня':
                case 'Завтра':
                case 'Следующие 7 дней':
                case 'Следующие 30 дней':
                case 'Позже':
                    return key;
                default:
                    return 'Неизвестная группа';
            }
        };

        switch (groupOption) {
            case 'date':
                return formatDate(key);
            case 'priority':
                return groupKeyTranslations[key] || 'Неизвестный приоритет';
            case 'tag':
                return key === 'none' ? 'Нет меток' : key;
            case 'none':
            default:
                return '';
        }
    };

    type DragInterface = {
        id: string | null;
        parentId: string | null;
    };

    const [currentDragItemIds, setCurrentDragItemIds] = React.useState<DragInterface>({ id: null, parentId: null });

    const [enteredItem, setEnteredItem] = React.useState<string | null>(null);
    const [isAllowed, setIsAllowed] = React.useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();

    const dragStartHandler = (e: React.DragEvent, id: string, parentId: string | null) => {
        e.stopPropagation();
        setCurrentDragItemIds({ id, parentId });
    };

    const dragEnterHandler = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setEnteredItem(id);

        const enteredTodo = todos.todos.find((todo) => todo.data.id === id);

        if ((!currentDragItemIds.parentId && enteredTodo?.data.parentId) || enteredTodo?.data.doneStatus) {
            setIsAllowed(false);
        } else {
            setIsAllowed(true);
        }
    };

    const dragOverHandler = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const dragEndHandler = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setEnteredItem(null);
        setCurrentDragItemIds({ id: null, parentId: null });
    };

    const dragDropHandler = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();

        const currentItemId = currentDragItemIds.id;
        const currentItemParentId = currentDragItemIds.parentId;

        if (currentItemId) {
            const newTodos = todos.todos.map((todo) => ({ ...todo, data: { ...todo.data } }));

            const currentIndex = newTodos.findIndex((todo) => todo.data.id === currentItemId);
            const dropIndex = newTodos.findIndex((todo) => todo.data.id === id);

            if (currentItemId && !newTodos[dropIndex].data.doneStatus) {
                if (!currentItemParentId && !newTodos[dropIndex].data.parentId) {
                    newTodos.splice(dropIndex, 0, newTodos.splice(currentIndex, 1)[0]);
                    dispatch(updateTodos(newTodos));
                } else if (currentItemParentId) {
                    if (currentItemParentId === newTodos[dropIndex].data.parentId) {
                        newTodos.splice(dropIndex, 0, newTodos.splice(currentIndex, 1)[0]);
                        dispatch(updateTodos(newTodos));
                    } else if (newTodos[dropIndex].data.parentId && currentItemParentId !== newTodos[dropIndex].data.parentId) {
                        newTodos[currentIndex].data.parentId = newTodos[dropIndex].data.parentId;
                        newTodos.splice(dropIndex, 0, newTodos.splice(currentIndex, 1)[0]);
                        dispatch(updateTodos(newTodos));
                    } else if (!newTodos[dropIndex].data.parentId) {
                        newTodos[currentIndex].data.parentId = id;
                        newTodos.splice(dropIndex, 0, newTodos.splice(currentIndex, 1)[0]);
                        dispatch(updateTodos(newTodos));
                    }
                }
            }

            setEnteredItem(null);
        }
    };

    const [isDataLoaded, setIsDataLoaded] = React.useState(false);
    const [isEffectTriggered, setIsEffectTriggered] = React.useState(false);

    React.useEffect(() => {
        if (!isEffectTriggered && todos.todos.length > 0) {
            const newOpenItems: Record<string, boolean> = {};
            todos.todos.forEach((todo) => {
                newOpenItems[todo.data.id] = true;
            });
            setOpenItems(newOpenItems);
            setIsDataLoaded(true);
            setIsEffectTriggered(true);
        }
    }, [isEffectTriggered, todos.todos]);

    React.useEffect(() => {
        if (todos.todos.length > 0 && !isDataLoaded) {
            setIsDataLoaded(true);
        }
    }, [todos.todos, isDataLoaded]);

    return (
        <>
            {groupedTodos.map(
                ([key, group]) =>
                    group.length > 0 && (
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
                                            <TodoWholeContainer
                                                key={todo.data.id}
                                                $overitem={todo.data.id === enteredItem && currentDragItemIds.id !== enteredItem}
                                                $isallowed={isAllowed}
                                            >
                                                <TodoItemContainer
                                                    draggable={
                                                        options.groupOption === 'none' && options.sortOption === 'none' ? true : false
                                                    }
                                                    onDragStart={(e) => dragStartHandler(e, todo.data.id, null)}
                                                    onDrop={(e) => dragDropHandler(e, todo.data.id)}
                                                    onDragOver={(e) => dragOverHandler(e)}
                                                    onDragEnter={(e) => dragEnterHandler(e, todo.data.id)}
                                                    onDragEnd={(e) => dragEndHandler(e)}
                                                >
                                                    {todos.todos.find((elem) => elem.data.parentId === todo.data.id) && (
                                                        <OpenButton
                                                            $isopen={!!openItems[todo.data.id]}
                                                            onClick={() => toggleOpenItem(todo.data.id)}
                                                        />
                                                    )}
                                                    <TodoItem key={todo.key} data={todo.data} />
                                                </TodoItemContainer>
                                                {openItems[todo.data.id] && (
                                                    <SublistContainer>
                                                        {undoneTodos()
                                                            .filter((subTodo) => subTodo.data.parentId === todo.data.id)
                                                            .map((subTodo) => (
                                                                <SubItemContainer
                                                                    key={subTodo.key}
                                                                    draggable={
                                                                        options.groupOption === 'none' && options.sortOption === 'none'
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onDragStart={(e) => dragStartHandler(e, subTodo.data.id, todo.data.id)}
                                                                    onDragOver={(e) => dragOverHandler(e)}
                                                                    onDragEnd={(e) => dragEndHandler(e)}
                                                                    onDrop={(e) => dragDropHandler(e, subTodo.data.id)}
                                                                    onDragEnter={(e) => dragEnterHandler(e, subTodo.data.id)}
                                                                    $overitem={enteredItem === subTodo.data.id}
                                                                    $isallowed={isAllowed}
                                                                >
                                                                    <TodoItem key={subTodo.data.id} data={subTodo.data} />
                                                                </SubItemContainer>
                                                            ))}
                                                        {doneTodos()
                                                            .filter((subTodo) => subTodo.data.parentId === todo.data.id)
                                                            .map((subTodo) => (
                                                                <SubItemContainer
                                                                    key={subTodo.key}
                                                                    draggable={false}
                                                                    onDragStart={(e) => dragStartHandler(e, subTodo.data.id, todo.data.id)}
                                                                    onDragOver={(e) => dragOverHandler(e)}
                                                                    onDragEnd={(e) => dragEndHandler(e)}
                                                                    onDrop={(e) => dragDropHandler(e, subTodo.data.id)}
                                                                    onDragEnter={(e) => dragEnterHandler(e, subTodo.data.id)}
                                                                    $overitem={enteredItem === subTodo.data.id}
                                                                    $isallowed={isAllowed}
                                                                >
                                                                    <TodoItem key={subTodo.data.id} data={subTodo.data} />
                                                                </SubItemContainer>
                                                            ))}
                                                    </SublistContainer>
                                                )}
                                            </TodoWholeContainer>
                                        ),
                                )}
                        </TodolistContainer>
                    ),
            )}
            <GroupHeader>
                <OpenButton $isopen={openDoneTodos} onClick={() => toggleOpenDoneTodos()} />
                <Grouptitle>Выполненные задачи</Grouptitle>
            </GroupHeader>
            {openDoneTodos &&
                doneTodos().map(
                    (todo) =>
                        !todo.data.parentId && (
                            <TodolistContainer key={todo.data.id}>
                                <TodoWholeContainer
                                    key={todo.data.id}
                                    draggable={false}
                                    onDragStart={(e) => dragStartHandler(e, todo.data.id, null)}
                                    onDrop={(e) => dragDropHandler(e, todo.data.id)}
                                    onDragOver={(e) => dragOverHandler(e)}
                                    onDragEnter={(e) => dragEnterHandler(e, todo.data.id)}
                                    $overitem={todo.data.id === enteredItem}
                                    $isallowed={isAllowed}
                                >
                                    <TodoItemContainer>
                                        {todos.todos.find((elem) => elem.data.parentId === todo.data.id) && (
                                            <OpenButton $isopen={!!openItems[todo.data.id]} onClick={() => toggleOpenItem(todo.data.id)} />
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
                            </TodolistContainer>
                        ),
                )}
        </>
    );
};

export default TodoList;
