import React, { useState, useCallback, useRef, useEffect } from 'react';
import { styled, css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store/store';
import { addTodo } from '../store/todoSlice';
import { addTag } from '../store/hashtagSlice';

import { TodoItemProps, Colors } from '../controls/types';

import Datepicker from './datepicker';
import PriorityMenu from './prioritymenu';

import IconArrows from '../assets/images/arrow-down.png';
import DatepickerButtonPng from '../assets/images/calendar-icon.png';

const priorityColor = (priority: 'high' | 'medium' | 'low' | 'none', colors: Colors) => {
    switch (priority) {
        case 'high':
            return colors.highPriority;
        case 'medium':
            return colors.mediumPriority;
        case 'low':
            return colors.lowPriority;
        case 'none':
        default:
            return colors.noPriority;
    }
};

const Wrapper = styled.div<{ $priority: 'high' | 'medium' | 'low' | 'none' }>`
    position: relative;

    display: flex;
    height: 30px;
    padding: 5px;

    border: 1px solid;
    border-radius: 3px;
    border-color: ${({ $priority, theme }) => priorityColor($priority, theme.colors)};
    box-shadow: ${({ $priority, theme }) => {
        if ($priority !== 'none') {
            return `0 0 5px ${priorityColor($priority, theme.colors)}, inset 0 0 5px ${priorityColor($priority, theme.colors)}`;
        } else {
            return 'none';
        }
    }};

    justify-content: space-between;
    align-items: center;

    transition: border-color 0.5s ease;

    user-select: none;
    cursor: text;

    @media (max-width: 768px) {
        height: auto;
    }
`;

const InputField = styled.input`
    display: flex;
    width: 100%;
    height: 15px;

    margin-left: 10px;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 15px;
    color: ${({ theme }) => theme.colors.activeTextColor};

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: none;
    outline: none;

    justify-content: flex-start;
    align-items: center;

    @media (max-width: 768px) {
        font-size: ${({ theme }) => theme.typography.fontSizeMobile};
    }
`;

const DatepickerButton = styled.div<{ $activebutton: boolean }>`
    height: 100%;
    aspect-ratio: 1/1;

    background: no-repeat center/70% url(${DatepickerButtonPng});

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  opacity: 0.7;
              `
            : css`
                  opacity: 1;
              `}

    @media (max-width: 768px) {
        height: 30px;
        width: 30px;
    }
`;

const DatepickerWrapper = styled.div`
    position: absolute;
    right: -195px;
    top: 25px;

    @media (max-width: 768px) {
        right: -5px;
        top: 30px;
    }
`;

const OpenPriorityMenuButton = styled.button<{ $activebutton: boolean }>`
    display: flex;
    height: 100%;
    aspect-ratio: 1/1;

    background: none;
    border: none;
    border-radius: 5px;

    align-items: center;
    justify-content: center;

    transition: 0.5s ease;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  opacity: 0.7;
              `
            : css`
                  opacity: 1;
              `}

    @media (max-width: 768px) {
        height: 30px;
        width: 30px;
    }
`;

const OpenPriorityMenuButtonImg = styled.img<{ $activebutton: boolean }>`
    height: 25px;
    aspect-ratio: 1/1.5;

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(180deg);
              `}

    @media (max-width: 768px) {
        height: 25px;
    }
`;

const PriorityMenuWrapper = styled.div`
    position: absolute;
    right: 15px;
    top: 25px;

    @media (max-width: 768px) {
        right: 140px;
        top: 30px;
    }
`;

const MemoizedDatepicker = React.memo(Datepicker);
const MemoizedPriorityMenu = React.memo(PriorityMenu);

const TodoInput: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [priorityMenuContainerVisible, setPriorityMenuContainerVisible] = useState<boolean>(false);
    const [datepickerVisible, setDatepickerVisible] = useState<boolean>(false);

    const targetDateRef = useRef<Date | null>(null);
    const priorityRef = useRef<'none' | 'low' | 'medium' | 'high'>('none');

    const inputFieldRef = useRef<HTMLInputElement>(null);
    const openPriorityMenuButtonRef = useRef<HTMLButtonElement>(null);
    const priorityMenuWrapperRef = useRef<HTMLDivElement>(null);
    const datepickerButtonRef = useRef<HTMLDivElement>(null);
    const datepickerRef = useRef<HTMLDivElement>(null);

    const dispatch: AppDispatch = useDispatch();

    const handleAddTodo = (): void => {
        if (!content.trim()) return;

        const tags = content.match(/#[\p{L}\p{N}_]+/gu) ?? ['none'];
        const contentWithoutTags = content.replace(/#[\p{L}\p{N}_]+/gu, '').trim();

        if (!contentWithoutTags) return;

        const sortedTags = tags.sort((a, b) => a.localeCompare(b));

        const newTodo: TodoItemProps = {
            key: uuidv4(),
            data: {
                id: uuidv4(),
                content: contentWithoutTags,
                priority: priorityRef.current,
                doneStatus: false,
                tags: sortedTags,
                timeOfCreation: new Date().toString(),
                timeOfCompletion: null,
                targetDate: targetDateRef.current?.toString() ?? null,
                parentId: null,
            },
        };

        dispatch(addTodo(newTodo));
        dispatch(addTag(sortedTags));
        setContent('');
        priorityRef.current = 'none';
        targetDateRef.current = null;
    };

    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            handleAddTodo();
            event.currentTarget.textContent = '';
        }
    };

    const handlePrioritySelect = useCallback((priority: 'none' | 'low' | 'medium' | 'high'): void => {
        priorityRef.current = priority;
        setPriorityMenuContainerVisible(false);
        inputFieldRef.current?.focus();
    }, []);

    const handleDateSelect = useCallback((date: Date | null): void => {
        targetDateRef.current = date;
        setDatepickerVisible(false);
        inputFieldRef.current?.focus();
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent): void => {
        if (
            priorityMenuWrapperRef.current &&
            !priorityMenuWrapperRef.current.contains(event.target as Node) &&
            openPriorityMenuButtonRef.current &&
            !openPriorityMenuButtonRef.current.contains(event.target as Node)
        ) {
            setPriorityMenuContainerVisible(false);
        }

        if (
            datepickerButtonRef.current &&
            !datepickerButtonRef.current.contains(event.target as Node) &&
            datepickerRef.current &&
            !datepickerRef.current.contains(event.target as Node)
        ) {
            setDatepickerVisible(false);
        }
    }, []);

    useEffect(() => {
        if (priorityMenuContainerVisible || datepickerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [priorityMenuContainerVisible, datepickerVisible]);

    return (
        <Wrapper $priority={priorityRef.current} onClick={() => inputFieldRef.current?.focus()}>
            <InputField
                ref={inputFieldRef}
                type="text"
                onKeyDown={handleEnterKeyDown}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <DatepickerButton
                ref={datepickerButtonRef}
                onClick={() => setDatepickerVisible((prevstate) => !prevstate)}
                title="Дата выполнения"
                $activebutton={datepickerVisible}
            />
            {datepickerVisible && (
                <DatepickerWrapper ref={datepickerRef}>
                    <MemoizedDatepicker value={targetDateRef.current} onChange={handleDateSelect} />
                </DatepickerWrapper>
            )}
            <OpenPriorityMenuButton
                ref={openPriorityMenuButtonRef}
                onClick={() => setPriorityMenuContainerVisible((prevstate) => !prevstate)}
                title="Приоритет"
                $activebutton={priorityMenuContainerVisible}
            >
                <OpenPriorityMenuButtonImg src={IconArrows} $activebutton={priorityMenuContainerVisible} />
            </OpenPriorityMenuButton>
            {priorityMenuContainerVisible && (
                <PriorityMenuWrapper ref={priorityMenuWrapperRef}>
                    <MemoizedPriorityMenu onSelect={handlePrioritySelect} onClose={() => setPriorityMenuContainerVisible(false)} />
                </PriorityMenuWrapper>
            )}
        </Wrapper>
    );
};

export default TodoInput;
