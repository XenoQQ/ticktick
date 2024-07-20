import React from 'react';
import { styled, css } from 'styled-components';
import { TodoItemProps } from '../controls/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toggleDoneStatus, switchPriority, switchContent, deleteTodoFromFirebase, addTodo, switchTargetDate } from '../store/todoSlice';
import { v4 as uuidv4 } from 'uuid';
import PriorityMenu from './prioritymenu';
import Datepicker from './datepicker';
import IconSettings from '../assets/images/icon-menu.png';
import IconDelete from '../assets/images/icon-delete.png';
import IconArrows from '../assets/images/arrow-down.png';
import IconSub from '../assets/images/icon-sub.png';

const Wrapper = styled.div`
    position: relative;

    display: flex;
    height: auto;

    padding: 13px 13px 13px 13px;

    border: none;
    border-radius: 5px;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    flex-grow: 1;

    &:hover {
        background-color: #2a2a2a;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5px;
        width: calc(100% - 10px);
        height: 1px;
        background-color: #323232;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
`;

const MainContainer = styled.div`
    display: flex;

    width: 100%;
    height: 15px;

    justify-content: flex-start;
    align-items: center;
`;

const Checkbox = styled.div<{ checked: boolean; priority: string }>`
    display: flex;
    height: 15px;
    aspect-ratio: 1/1;

    margin-right: 10px;
    margin-left: 5px;

    border: 1px solid;
    border-radius: 3px;
    border-color: ${({ priority }) => {
        switch (priority) {
            case 'none':
            default:
                return '#535353';
            case 'low':
                return '#4772fa';
            case 'medium':
                return '#FAA80C';
            case 'high':
                return '#D52b24';
        }
    }};

    transition: 0.5s ease;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    &::before {
        content: '';
        display: block;
        position: relative;
        top: 40%;
        left: 50%;
        width: 5px;
        height: 8px;
        border: solid;
        border-width: 0 2px 2px 0;
        border-color: ${({ priority }) => {
            switch (priority) {
                case 'none':
                default:
                    return '#535353';
                case 'low':
                    return '#4772fa';
                case 'medium':
                    return '#FAA80C';
                case 'high':
                    return '#D52b24';
            }
        }};
        transform: translate(-50%, -50%) rotate(35deg);
        opacity: ${({ checked }) => (checked ? '1' : '0')};
        transition: 0.5s ease;
    }
`;

const Textfield = styled.div<{ checked: boolean }>`
    display: flex;
    min-width: 20px;
    height: 100%;

    margin: 0 10px 0 0;

    background-color: transparent;

    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: ${({ checked }) => (checked ? '#535353' : '#bebebe')};

    text-decoration: ${({ checked }) => (checked ? 'line-through' : 'none')};

    list-style: none;
    align-items: center;

    outline: none;
    &:focus {
        outline: none;
    }
`;

const DateContainer = styled.div`
    display: flex;
    width: auto;
    height: 15px;

    margin-left: auto;

    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    color: #5c5c5c;

    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
        color: #757575;
    }

    transition: 0.5s ease;
`;

const DatePickerWrapper = styled.div`
    position: absolute;
    right: 70px;
    top: 145px;

    height: 15px;
    width: 15px;

    margin-right: 3px;
`;

const OpenMenuButton = styled.div<{ activeButton: boolean }>`
    height: 20px;
    aspect-ratio: 1/1;

    margin-left: 10px;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  background-color: #2e2e2e;
                  box-shadow: 0 0 10px rgba(83, 83, 83, 0.498);
              `
            : css`
                  background-color: none;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const OpenMenuButtonImg = styled.img<{ activeButton: boolean }>`
    width: 100%;
    height: 100%;

    transition: 0.5s ease;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(180deg);
              `}
`;

const MenuContainer = styled.div`
    z-index: 9999;

    position: absolute;
    right: -70px;
    top: 30px;

    display: flex;
    width: auto;
    height: auto;

    padding: 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const PriorityButton = styled.div<{ activeButton: boolean }>`
    display: flex;

    width: 30px;
    height: 30px;

    border: 1px solid #535353;
    border-radius: 3px;

    justify-content: center;
    align-items: center;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  background-color: #2e2e2e;
                  box-shadow: 0 0 10px rgba(83, 83, 83, 0.498);
              `
            : css`
                  background-color: none;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const PriorityButtonImg = styled.img<{ activeButton: boolean }>`
    width: 70%;
    height: 90%;

    transition: 0.5s ease;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(180deg);
              `}
`;

const PriorityMenuWrapper = styled.div`
    z-index: 9999;

    position: absolute;
    top: 30px;
    right: 50px;
`;

const SubtaskButton = styled.div`
    display: flex;

    width: 30px;
    height: 30px;

    margin-left: 5px;

    border: 1px solid #535353;
    border-radius: 3px;
    background: no-repeat center/80% url(${IconSub});

    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const DeleteButton = styled.div`
    display: flex;

    width: 30px;
    height: 30px;

    margin-left: 5px;

    border: 1px solid #535353;
    border-radius: 3px;
    background: no-repeat center/80% url(${IconDelete});

    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const TagsContainer = styled.div`
    display: flex;
    width: 100%;
    height: 15px;

    margin-top: 13px;
    margin-left: 30px;

    justify-content: flex-start;
    align-items: center;
`;

const Tag = styled.div`
    display: flex;
    width: auto;
    height: 15px;

    margin-right: 3px;

    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    color: #757575;

    justify-content: center;
    align-items: center;
`;

const TodoItem: React.FC<TodoItemProps> = ({ data }) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
    const [priorityMenuContainerVisible, setPriorityMenuContainerVisible] = React.useState<boolean>(false);
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const menuContainerRef = React.useRef<HTMLDivElement>(null);
    const openMenuButtonRef = React.useRef<HTMLDivElement>(null);
    const editableDivRef = React.useRef<HTMLDivElement>(null);
    const dateContainerRef = React.useRef<HTMLDivElement>(null);
    const datePickerRef = React.useRef<HTMLDivElement>(null);

    const showSub = useSelector((state: RootState) => state.showSub);

    const dispatch: AppDispatch = useDispatch();

    const handleDelete = () => {
        setMenuVisible(false);
        dispatch(deleteTodoFromFirebase(data.id));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) {
            return 'Без даты';
        }

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuContainerRef.current &&
            !menuContainerRef.current.contains(event.target as Node) &&
            openMenuButtonRef.current &&
            !openMenuButtonRef.current.contains(event.target as Node)
        ) {
            setMenuVisible(false);
            setPriorityMenuContainerVisible(false);
        }

        if (
            dateContainerRef.current &&
            !dateContainerRef.current.contains(event.target as Node) &&
            datePickerRef.current &&
            !datePickerRef.current.contains(event.target as Node)
        ) {
            setCalendarVisible(false);
        }
    };

    React.useEffect(() => {
        if (menuVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible]);

    React.useEffect(() => {
        if (calendarVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [calendarVisible]);

    const handleComplete = () => {
        dispatch(toggleDoneStatus(data.id));
    };

    const handlePrioritySelect = (priority: 'none' | 'low' | 'medium' | 'high') => {
        dispatch(switchPriority({ id: data.id, priority }));
    };

    const handleContentChange = (event?: React.FocusEvent<HTMLDivElement>) => {
        const updatedContent = event?.currentTarget.textContent || editableDivRef.current?.textContent;

        if (updatedContent) {
            dispatch(switchContent({ id: data.id, content: updatedContent }));
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleContentChange();
            if (editableDivRef.current) {
                editableDivRef.current.blur();
            }
        }
    };

    const handleAddTodo = async () => {
        const newTodo: TodoItemProps = {
            key: uuidv4(),
            data: {
                id: uuidv4(),
                content: '',
                priority: 'none',
                doneStatus: false,
                tags: [],
                timeOfCreation: new Date().toString(),
                timeOfCompletion: null,
                targetDate: null,
                type: 'child',
                parentId: data.id,
            },
        };

        dispatch(addTodo(newTodo));
    };

    const handleClickInside = () => {
        if (editableDivRef.current) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editableDivRef.current);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
            editableDivRef.current.focus();
        }
    };

    const handleDateSelect = (date: Date | null) => {
        dispatch(switchTargetDate({ id: data.id, targetDate: date?.toString() ?? null }));
        setCalendarVisible(false);
    };

    return (
        <>
            <Wrapper draggable onDoubleClick={() => handleClickInside()}>
                <MainContainer>
                    <Checkbox checked={data.doneStatus} priority={data.priority} onClick={() => handleComplete()} />
                    <Textfield
                        checked={data.doneStatus}
                        ref={editableDivRef}
                        onKeyDown={handleKeyDown}
                        contentEditable
                        onBlur={handleContentChange}
                        suppressContentEditableWarning
                    >
                        {data.content}
                    </Textfield>
                    <DateContainer onClick={() => setCalendarVisible((prevstate) => !prevstate)} ref={dateContainerRef}>
                        {formatDate(data.targetDate)}
                    </DateContainer>
                    {calendarVisible && (
                        <DatePickerWrapper ref={datePickerRef}>
                            <Datepicker value={data.targetDate ? new Date(data.targetDate) : null} onChange={handleDateSelect} />
                        </DatePickerWrapper>
                    )}
                    <OpenMenuButton
                        onClick={() => setMenuVisible((prevstate) => !prevstate)}
                        activeButton={menuVisible}
                        ref={openMenuButtonRef}
                    >
                        <OpenMenuButtonImg src={IconSettings} activeButton={menuVisible} />
                    </OpenMenuButton>
                    {menuVisible && (
                        <>
                            <MenuContainer ref={menuContainerRef}>
                                <PriorityButton
                                    activeButton={priorityMenuContainerVisible}
                                    onClick={() => setPriorityMenuContainerVisible((prevstate) => !prevstate)}
                                >
                                    <PriorityButtonImg activeButton={priorityMenuContainerVisible} src={IconArrows} />
                                </PriorityButton>
                                {!data.parentId && <SubtaskButton onClick={() => handleAddTodo()} />}
                                <DeleteButton onClick={() => handleDelete()} />
                                {priorityMenuContainerVisible && (
                                    <PriorityMenuWrapper>
                                        <PriorityMenu
                                            onSelect={handlePrioritySelect}
                                            onClose={() => {
                                                setPriorityMenuContainerVisible(false), setMenuVisible(false);
                                            }}
                                        />
                                    </PriorityMenuWrapper>
                                )}
                            </MenuContainer>
                        </>
                    )}
                </MainContainer>
                {showSub && !data.parentId && (
                    <TagsContainer>
                        {data.tags.map((tag) => (
                            <Tag key={tag}>{tag !== 'none' ? tag : 'Нет меток'}</Tag>
                        ))}
                    </TagsContainer>
                )}
            </Wrapper>
        </>
    );
};

export default TodoItem;
