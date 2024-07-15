import React from 'react';
import { styled, css } from 'styled-components';
import { addTodo } from '../store/todoSlice';
import { addTag } from '../store/hashtagSlice';
import { v4 as uuidv4 } from 'uuid';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

import Datepicker from './datepicker';
import PriorityMenu from './prioritymenu';
import IconArrows from '../assets/images/arrow-down.png';
import CalendarIconPng from '../assets/images/calendar-icon.png';

const Wrapper = styled.div<{ priority: string }>`
    position: relative;
    display: flex;
    height: 45px;
    padding: 5px;
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
    box-shadow: ${({ priority }) => {
        switch (priority) {
            case 'none':
            default:
                return '0 0 0px #535353;';
            case 'low':
                return '0 0 5px #4772fa, inset 0 0 5px #4772fa;';
            case 'medium':
                return '0 0 5px #FAA80C, inset 0 0 5px #FAA80C;';
            case 'high':
                return '0 0 5px #D52b24, inset 0 0 5px #D52b24;';
        }
    }};
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.5s ease;
    user-select: none;
`;

const InputField = styled.input`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 0 0 10px;
    font-family: 'Ubuntu', sans-serif;
    font-size: 25px;
    color: #dfdfdf;
    background-color: #202020;
    border: none;
    outline: none;
    align-items: center;
    justify-content: left;
    span.tag {
        color: blue;
    }
`;
const CalendarIcon = styled.div`
    height: 100%;
    aspect-ratio: 1/1;

    background: no-repeat center/70% url(${CalendarIconPng});

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const DatePickerWrapper = styled.div`
    position: absolute;
    right: 45px;
    top: 150px;

    height: 30px;
    width: 30px;

    margin-right: 5px;
`;

const OpenPriorityButton = styled.button<{ activeButton: boolean }>`
    display: flex;
    height: calc(100% - 6px);
    aspect-ratio: 1/1;
    margin-right: 3px;
    background: none;
    border: none;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    transition: 0.5s ease;
    cursor: pointer;
    ${({ activeButton }) =>
        activeButton
            ? css`
                  opacity: 0.7;
              `
            : css`
                  opacity: 1;
              `}
    &:hover {
        opacity: 0.5;
    }
`;

const OpenPriorityButtonImg = styled.img<{ activeButton: boolean }>`
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

const PriorityMenuWrapper = styled.div`
    position: absolute;
    right: -5px;
    top: -1px;
`;

const TodoInput: React.FC = () => {
    const [content, setContent] = React.useState<string>('');
    const [targetDate, setTargetDate] = React.useState<Date | null>(null);
    const [priorityMenuContainerVisible, setPriorityMenuContainerVisible] = React.useState<boolean>(false);
    const [priority, setPriority] = React.useState<'none' | 'low' | 'medium' | 'high'>('none');
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const priorityMenuContainerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const calendarButtonRef = React.useRef<HTMLDivElement>(null);
    const datePickerRef = React.useRef<HTMLDivElement>(null);

    const dispatch: AppDispatch = useDispatch();

    const handleAddTodo = async () => {
        if (content) {
            const tags = content.match(/#[\p{L}\p{N}_]+/gu) ?? ['none'];
            const contentWithoutTags = content.replace(/#[\p{L}\p{N}_]+/gu, '').trim();

            const sortedTags = tags.sort((a, b) => a.localeCompare(b));

            const newTodo: TodoItemProps = {
                key: uuidv4(),
                data: {
                    id: uuidv4(),
                    content: contentWithoutTags,
                    priority: priority,
                    doneStatus: false,
                    tags: sortedTags,
                    timeOfCreation: new Date().toString(),
                    timeOfCompletion: null,
                    targetDate: targetDate?.toString() ?? null,
                    type: 'parent',
                    childrenKeys: [],
                },
            };

            dispatch(addTodo(newTodo));
            dispatch(addTag(sortedTags));
            setContent('');
            setPriority('none');
            setTargetDate(null);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handlePrioritySelect = (priority: 'none' | 'low' | 'medium' | 'high') => {
        setPriority(priority);
        setPriorityMenuContainerVisible(false);
        inputRef.current?.focus();
    };

    const handleDateSelect = (date: Date | null) => {
        setTargetDate(date);
        inputRef.current?.focus();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            priorityMenuContainerRef.current &&
            !priorityMenuContainerRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setPriorityMenuContainerVisible(false);
        }

        if (
            calendarButtonRef.current &&
            !calendarButtonRef.current.contains(event.target as Node) &&
            datePickerRef.current &&
            !datePickerRef.current.contains(event.target as Node)
        ) {
            setCalendarVisible(false);
        }
    };

    React.useEffect(() => {
        if (priorityMenuContainerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [priorityMenuContainerVisible]);

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

    return (
        <Wrapper priority={priority}>
            <InputField ref={inputRef} onKeyDown={handleKeyDown} type="text" value={content} onChange={(e) => setContent(e.target.value)} />
            <CalendarIcon
                ref={calendarButtonRef}
                onClick={() => setCalendarVisible((prevstate) => !prevstate)}
                title="Выбрать дату выполнения"
            />
            {calendarVisible && (
                <DatePickerWrapper ref={datePickerRef}>
                    <Datepicker value={targetDate} onChange={handleDateSelect} />
                </DatePickerWrapper>
            )}

            <OpenPriorityButton
                ref={buttonRef}
                onClick={() => setPriorityMenuContainerVisible((prevstate) => !prevstate)}
                title="Приоритет"
                activeButton={priorityMenuContainerVisible}
            >
                <OpenPriorityButtonImg src={IconArrows} activeButton={priorityMenuContainerVisible} />
            </OpenPriorityButton>
            {priorityMenuContainerVisible && (
                <PriorityMenuWrapper>
                    <PriorityMenu
                        ref={priorityMenuContainerRef}
                        onSelect={handlePrioritySelect}
                        onClose={() => setPriorityMenuContainerVisible(false)}
                    />
                </PriorityMenuWrapper>
            )}
        </Wrapper>
    );
};

export default TodoInput;
