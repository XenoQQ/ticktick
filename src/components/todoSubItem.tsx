import React, { useCallback, useState, useEffect, useRef } from 'react';
import { styled, css } from 'styled-components';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store/store';
import { updateSubTodo, deleteTodoFromFirebase } from '../store/todoSlice';
import { TodoSubItemData, VisibleState, VisibleStateKey } from '../controls/types';

import PriorityMenu from './prioritymenu';
import Datepicker from './datepicker';

import IconSettings from '../assets/images/icon-menu.png';
import IconDelete from '../assets/images/icon-delete.png';
import IconArrows from '../assets/images/arrow-down.png';

const Wrapper = styled.div`
    position: relative;

    display: flex;

    border: none;
    border-radius: 5px;

    justify-content: space-between;
    align-items: center;
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

const TodoWrapper = styled.div`
    display: flex;

    width: 100%;
    height: 15px;

    margin: 15px 0;

    justify-content: flex-start;
    align-items: center;
`;

const Checkbox = styled.div<{ $checked: boolean; $priority: string }>`
    display: flex;
    height: 15px;
    aspect-ratio: 1/1;

    margin-right: 10px;
    margin-left: 20px;

    border: 1px solid;
    border-radius: 3px;
    border-color: ${({ $priority }) => {
        switch ($priority) {
            case 'none':
            default:
                return ({ theme }) => theme.colors.noPriority;
            case 'low':
                return ({ theme }) => theme.colors.lowPriority;
            case 'medium':
                return ({ theme }) => theme.colors.mediumPriority;
            case 'high':
                return ({ theme }) => theme.colors.highPriority;
        }
    }};

    transition: 0.5s ease;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    ${({ $checked }) =>
        $checked
            ? css`
                  opacity: 0.8;
              `
            : css``}

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
        border-color: ${({ $priority }) => {
            switch ($priority) {
                case 'none':
                default:
                    return ({ theme }) => theme.colors.noPriority;
                case 'low':
                    return ({ theme }) => theme.colors.lowPriority;
                case 'medium':
                    return ({ theme }) => theme.colors.mediumPriority;
                case 'high':
                    return ({ theme }) => theme.colors.highPriority;
            }
        }};
        transform: translate(-50%, -50%) rotate(35deg);
        opacity: ${({ $checked }) => ($checked ? '1' : '0')};
        transition: 0.5s ease;
    }
`;

const Textfield = styled.div<{ $checked: boolean }>`
    display: flex;
    min-width: 20px;

    background-color: transparent;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 14px;
    color: ${({ $checked }) => ($checked ? ({ theme }) => theme.colors.uiTextColor : ({ theme }) => theme.colors.activeTextColor)};

    text-decoration: ${({ $checked }) => ($checked ? 'line-through' : 'none')};

    align-items: center;

    outline: none;

    @media (max-width: 768px) {
        font-size: ${({ theme }) => theme.typography.fontSizeMobile};
    }
`;

const DateContainer = styled.div<{ $activebutton: boolean }>`
    display: flex;
    width: auto;

    margin-left: auto;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.uiTextColor};

    justify-content: center;
    align-items: center;

    border-radius: 3px;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  background-color: ${({ theme }) => theme.colors.activeButtonBackground};
                  box-shadow: ${({ theme }) => theme.boxShadow.activeButton};
              `
            : css``}
`;

const DatePickerWrapper = styled.div`
    z-index: 9999;

    position: absolute;
    right: -200px;
    top: 30px;

    margin-right: 3px;

    @media (max-width: 768px) {
        right: -5px;
    }
`;

const OpenMenuButton = styled.div<{ $activebutton: boolean }>`
    display: flex;

    height: 20px;
    aspect-ratio: 1/1;

    margin: 0 10px;

    transition: 0.5s ease;

    cursor: pointer;

    justify-content: center;
    align-items: center;

    border-radius: 3px;

    &:hover {
        opacity: 0.7;
    }

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  background-color: ${({ theme }) => theme.colors.activeButtonBackground};
                  box-shadow: ${({ theme }) => theme.boxShadow.activeButton};
              `
            : css``}
`;

const OpenMenuButtonImg = styled.img<{ $activebutton: boolean }>`
    width: 120%;
    height: 120%;

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(180deg);
              `}
`;

const MenuWrapper = styled.div`
    z-index: 9999;
    position: absolute;
    top: 30px;
    right: -60px;

    display: flex;
    width: auto;
    height: auto;

    padding: 5px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;
    box-shadow: ${({ theme }) => theme.boxShadow.default};

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        right: 0px;
    }
`;

const OpenPriorityMenuButton = styled.div<{ $activebutton: boolean }>`
    display: flex;

    width: 25px;
    aspect-ratio: 1/1;

    margin-right: 5px;

    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;

    justify-content: center;
    align-items: center;

    cursor: pointer;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  background-color: ${({ theme }) => theme.colors.activeButtonBackground};
                  box-shadow: ${({ theme }) => theme.boxShadow.activeButton};
              `
            : css``}

    &:hover {
        opacity: 0.7;
    }
`;

const OpenPriorityMenuButtonImg = styled.img<{ $activebutton: boolean }>`
    width: 70%;
    height: 90%;

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(180deg);
              `}
`;

const DeleteButton = styled.div`
    display: flex;

    width: 25px;
    aspect-ratio: 1/1;

    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;
    background: no-repeat center/80% url(${IconDelete});

    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const PriorityMenuWrapper = styled.div`
    z-index: 9999;
    position: absolute;
    right: -40px;
    top: 25px;

    @media (max-width: 768px) {
        right: -5px;
    }
`;

const MemoizedPriorityMenu = React.memo(PriorityMenu);

const TodoSubItem: React.FC<{ data: TodoSubItemData }> = ({ data }) => {
    const [visibleState, setVisibleState] = useState<VisibleState>({
        menu: false,
        priorityMenu: false,
        datepicker: false,
        hashtagSettings: false,
    });

    const editableDivRef = useRef<HTMLDivElement>(null);
    const openMenuButtonRef = useRef<HTMLDivElement>(null);
    const menuWrapperRef = useRef<HTMLDivElement>(null);
    const dateContainerRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const openPriorityMenuButtonRef = useRef<HTMLDivElement>(null);
    const priporityMenuWrapperRef = useRef<HTMLDivElement>(null);

    const dispatch: AppDispatch = useDispatch();

    const toggleVisibility = (key: VisibleStateKey): void => {
        setVisibleState((prevstate) => ({ ...prevstate, [key]: !prevstate[key] }));
    };

    const handleComplete = (): void => {
        dispatch(updateSubTodo({ updateType: 'doneStatus', parentId: data.parentId, id: data.id }));
    };

    const handleContentChange = (event?: React.FocusEvent<HTMLDivElement>): void => {
        const updatedContent = event?.currentTarget.textContent || editableDivRef.current?.textContent;

        if (updatedContent) {
            const contentWithoutTags = updatedContent.replace(/#[\p{L}\p{N}_]+/gu, '').trim();

            dispatch(updateSubTodo({ updateType: 'content', parentId: data.parentId, id: data.id, content: contentWithoutTags }));

            if (event?.currentTarget) {
                event.currentTarget.textContent = contentWithoutTags;
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (editableDivRef.current) {
                editableDivRef.current.blur();
            }
        }
    };

    const formatDate = (dateString: string | null): string => {
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

        if (!dateString) {
            return 'Без даты';
        }

        const date = new Date(dateString);

        const day = String(date.getDate());
        const month = String(monthNames[date.getMonth() + 1]);

        return `${day} ${month}`;
    };

    const handleDateSelect = useCallback(
        (date: Date | null): void => {
            dispatch(
                updateSubTodo({ updateType: 'targetDate', parentId: data.parentId, id: data.id, targetDate: date?.toString() ?? null }),
            );
            setVisibleState((prevstate) => ({ ...prevstate, datepicker: false }));
        },
        [dispatch, data.id],
    );

    const handlePrioritySelect = useCallback(
        (priority: 'none' | 'low' | 'medium' | 'high'): void => {
            dispatch(updateSubTodo({ updateType: 'priority', parentId: data.parentId, id: data.id, priority }));
            setVisibleState((prevstate) => ({ ...prevstate, menu: false, priorityMenu: false, hashtagSettings: false }));
        },
        [dispatch, data.id],
    );

    const handleDelete = (): void => {
        setVisibleState({ ...visibleState, menu: false, priorityMenu: false, hashtagSettings: false });
        dispatch(deleteTodoFromFirebase(data.id));
    };

    const isClickedOutside = (event: MouseEvent, refs: React.RefObject<HTMLElement>[]): boolean => {
        return refs.every((ref) => ref.current && !ref.current.contains(event.target as Node));
    };

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (isClickedOutside(event, [dateContainerRef, datePickerRef])) {
                setVisibleState({ ...visibleState, datepicker: false });
            }

            if (isClickedOutside(event, [menuWrapperRef, openMenuButtonRef])) {
                setVisibleState({ ...visibleState, menu: false, priorityMenu: false, hashtagSettings: false });
                return;
            }

            if (isClickedOutside(event, [openPriorityMenuButtonRef, priporityMenuWrapperRef])) {
                setVisibleState({ ...visibleState, priorityMenu: false });
            }
        },
        [visibleState],
    );

    const handleClickInside = (): void => {
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

    useEffect(() => {
        const isAnyvisible = Object.values(visibleState).some((value) => value === true);

        if (isAnyvisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visibleState]);

    return (
        <Wrapper onDoubleClick={() => handleClickInside()}>
            <TodoWrapper>
                <Checkbox $checked={data.doneStatus} $priority={data.priority} onClick={() => handleComplete()} />
                <Textfield
                    $checked={data.doneStatus}
                    ref={editableDivRef}
                    onKeyDown={handleKeyDown}
                    contentEditable
                    onBlur={handleContentChange}
                    suppressContentEditableWarning
                >
                    {data.content}
                </Textfield>
                <DateContainer
                    $activebutton={visibleState.datepicker}
                    onClick={() => toggleVisibility('datepicker')}
                    ref={dateContainerRef}
                >
                    {formatDate(data.targetDate)}
                </DateContainer>
                {visibleState.datepicker && (
                    <DatePickerWrapper ref={datePickerRef}>
                        <Datepicker value={data.targetDate ? new Date(data.targetDate) : null} onChange={handleDateSelect} />
                    </DatePickerWrapper>
                )}
                <OpenMenuButton $activebutton={visibleState.menu} onClick={() => toggleVisibility('menu')} ref={openMenuButtonRef}>
                    <OpenMenuButtonImg src={IconSettings} $activebutton={visibleState.menu} />
                </OpenMenuButton>
                {visibleState.menu && (
                    <MenuWrapper ref={menuWrapperRef}>
                        <OpenPriorityMenuButton
                            ref={openPriorityMenuButtonRef}
                            $activebutton={visibleState.priorityMenu}
                            onClick={() => toggleVisibility('priorityMenu')}
                        >
                            <OpenPriorityMenuButtonImg $activebutton={visibleState.priorityMenu} src={IconArrows} />
                        </OpenPriorityMenuButton>
                        <DeleteButton onClick={() => handleDelete()} />
                        {visibleState.priorityMenu && (
                            <PriorityMenuWrapper ref={priporityMenuWrapperRef}>
                                <MemoizedPriorityMenu onSelect={handlePrioritySelect} />
                            </PriorityMenuWrapper>
                        )}
                    </MenuWrapper>
                )}
            </TodoWrapper>
        </Wrapper>
    );
};

export default TodoSubItem;
