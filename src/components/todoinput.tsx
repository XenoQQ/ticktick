import React from 'react';
import { styled, css } from 'styled-components';
import { addTodo } from '../store/todoSlice';
import { v4 as uuidv4 } from 'uuid';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import Datepicker from './datepicker';
import IconArrows from '../assets/images/arrow-down.png';

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
`;

const InputField = styled.div`
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
        opacity: 0.7;
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

const PriorityMenuContainer = styled.div`
    position: absolute;
    right: -150px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    width: 134px;
    height: 100%;

    padding: 0px 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const PriorityMenuContainerTitle = styled.div`
    display: flex;
    width: 100%;

    font-family: 'Ubuntu', sans-serif;
    font-size: 15px;
    color: #757575;

    justify-content: center;
`;

const PriorityMenuContainerButton = styled.div<{ bocolor: string }>`
    display: flex;
    width: 25px;
    height: 25px;

    background-color: #202020;
    border: 2px solid ${({ bocolor }) => bocolor};
    border-radius: 4px;

    cursor: pointer;
`;

const TodoInput: React.FC = () => {
    const [content, setContent] = React.useState<string>('');
    const [targetDate, setTargetDate] = React.useState<Date | null>(null);
    const [priorityMenuContainerVisible, setPriorityMenuContainerVisible] = React.useState<boolean>(false);
    const [priority, setPriority] = React.useState<'none' | 'low' | 'medium' | 'high'>('none');

    const inputRef = React.useRef<HTMLInputElement>(null);
    const priorityMenuContainerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const dispatch = useDispatch();

    const handleAddTodo = () => {
        if (content) {
            const formatDate = (currentDate: Date) => {
                let dd = currentDate.getDate();
                if (dd < 10) dd = 0 + dd;

                let mm = currentDate.getMonth() + 1;
                if (mm < 10) mm = 0 + mm;

                let yy = currentDate.getFullYear() % 100;
                if (yy < 10) yy = 0 + yy;

                return dd + '.' + mm + '.' + yy;
            };

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
                    timeOfCreation: formatDate(new Date()).toString(),
                    timeOfCompletion: null,
                    targetDate: targetDate?.toString() ?? null,
                    type: 'parent',
                    childrenKeys: [],
                },
            };

            dispatch(addTodo(newTodo));
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

    const handlePriorityMenuContainerClick = () => {
        setPriorityMenuContainerVisible((prevstate) => !prevstate);
    };

    const handlePrioritySelect = (priority: 'none' | 'low' | 'medium' | 'high') => {
        setPriority(priority);
        setPriorityMenuContainerVisible((prevstate) => !prevstate);
        inputRef.current?.focus();
    };

    const handleDateSelect = (date: Date | null) => {
        setTargetDate(date);
        inputRef.current?.focus();
    };

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        const innerHTML = (event.target as HTMLDivElement).innerHTML;
        const highlightedContent = innerHTML.replace(/(#[\p{L}\p{N}_]+)/gu, '<span class="tag">$1</span>');
        setContent(highlightedContent);
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

    return (
        <>
            <Wrapper priority={priority}>
                <InputField ref={inputRef} contentEditable suppressContentEditableWarning onKeyDown={handleKeyDown} onInput={handleInput} />
                <Datepicker value={targetDate} onChange={(date) => handleDateSelect(date)} />

                <OpenPriorityButton
                    ref={buttonRef}
                    onClick={() => handlePriorityMenuContainerClick()}
                    title="Приоритет"
                    activeButton={priorityMenuContainerVisible}
                >
                    <OpenPriorityButtonImg src={IconArrows} activeButton={priorityMenuContainerVisible} />
                </OpenPriorityButton>
                {priorityMenuContainerVisible && (
                    <PriorityMenuContainer ref={priorityMenuContainerRef}>
                        <PriorityMenuContainerTitle>Приоритет</PriorityMenuContainerTitle>
                        <PriorityMenuContainerButton bocolor="#D52b24" onClick={() => handlePrioritySelect('high')} />
                        <PriorityMenuContainerButton bocolor="#FAA80C" onClick={() => handlePrioritySelect('medium')} />
                        <PriorityMenuContainerButton bocolor="#4772fa" onClick={() => handlePrioritySelect('low')} />
                        <PriorityMenuContainerButton bocolor="#3b3b3b" onClick={() => handlePrioritySelect('none')} />
                    </PriorityMenuContainer>
                )}
            </Wrapper>
        </>
    );
};

export default TodoInput;
