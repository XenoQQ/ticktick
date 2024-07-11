import React from 'react';
import { styled, keyframes, css } from 'styled-components';
import { TodoItemProps } from '../controls/types';
import { useDispatch } from 'react-redux';
import { toggleDoneStatus, deleteTodo } from '../store/todoSlice';
import IconSettings from '../assets/images/icon-menu.png';
import IconDelete from '../assets/images/icon-delete.png';
import IconArrows from '../assets/images/arrow-down.png';
import PriorityMenu from './prioritymenu';

const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const fadeOut = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`;

const Wrapper = styled.div<{ onFadeOut: boolean }>`
    position: relative;

    display: flex;
    height: auto;

    margin: 5px 0 0 0;
    padding: 5px;

    border-bottom: 1px solid #535353;

    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;

    ${({ onFadeOut }) =>
        onFadeOut
            ? css`
                  animation: ${fadeOut} 1s ease;
              `
            : css`
                  animation: ${fadeIn} 1s ease;
              `}
`;

const MainContainer = styled.div`
    display: flex;

    width: 100%;
    height: 35px;

    justify-content: center;
    align-items: center;
`;

const Checkbox = styled.div<{ checked: boolean; priority: string }>`
    display: flex;
    height: 35px;
    aspect-ratio: 1/1;

    margin-right: 10px;

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

    transition: 1s;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }

    &::before {
        content: '';
        display: block;
        position: relative;
        top: 40%;
        left: 50%;
        width: 13px;
        height: 24px;
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
        transition: opacity 0.3s ease;
    }
`;

const Textfield = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    background-color: #202020;

    font-family: 'Ubuntu', sans-serif;
    font-size: 25px;
    color: #757575;

    list-style: none;
    align-items: center;
`;

const OpenMenuButton = styled.div<{ activeButton: boolean }>`
    height: 25px;
    aspect-ratio: 1/1;

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
    position: absolute;
    top: 60px;
    right: -20px;
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

const SubContainer = styled.div`
    display: flex;
    width: 100%;
    height: 24px;

    margin: 5px 0 0 0%;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const DateContainer = styled.div`
    display: flex;
    width: auto;
    height: 18px;

    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #757575;

    justify-content: center;
    align-items: center;
`;

const TagsContainer = styled.div`
    display: flex;
    width: auto;
    height: 24px;

    margin-left: auto;

    justify-content: flex-end;
    align-items: center;
`;

const Tag = styled.div`
    display: flex;
    width: auto;
    height: 18px;

    margin-right: 3px;

    font-family: 'Ubuntu', sans-serif;
    font-size: 14px;
    color: #757575;

    justify-content: center;
    align-items: center;
`;

const TodoItem: React.FC<TodoItemProps> = ({ data }) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
    const [onFadeOut, setOnFadeOut] = React.useState<boolean>(false);
    const [priorityMenuContainerVisible, setPriorityMenuContainerVisible] = React.useState<boolean>(false);

    const menuContainerRef = React.useRef<HTMLDivElement>(null);
    const OpenMenuButtonRef = React.useRef<HTMLDivElement>(null);
    const priorityMenuContainerRef = React.useRef<HTMLDivElement>(null);
    const priorityMenuButtonRef = React.useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const handleComplete = () => {
        dispatch(toggleDoneStatus(data.id));
    };

    const handlePrioritySelect = () => {};

    const handleDelete = () => {
        setMenuVisible(false);
        setOnFadeOut(true);
        setTimeout(() => {
            dispatch(deleteTodo(data.id));
        }, 1000);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) {
            return '';
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
            OpenMenuButtonRef.current &&
            !OpenMenuButtonRef.current.contains(event.target as Node)
        ) {
            setMenuVisible(false);
        }

        if (
            priorityMenuContainerRef.current &&
            !priorityMenuContainerRef.current.contains(event.target as Node) &&
            priorityMenuButtonRef.current &&
            !priorityMenuButtonRef.current.contains(event.target as Node)
        ) {
            setPriorityMenuContainerVisible(false);
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
            <Wrapper draggable onFadeOut={onFadeOut}>
                <MainContainer>
                    <Checkbox checked={data.doneStatus} priority={data.priority} onClick={() => handleComplete()} />
                    <Textfield>{data.content}</Textfield>
                    <OpenMenuButton
                        onClick={() => setMenuVisible((prevstate) => !prevstate)}
                        activeButton={menuVisible}
                        ref={OpenMenuButtonRef}
                    >
                        <OpenMenuButtonImg src={IconSettings} activeButton={menuVisible} />
                    </OpenMenuButton>
                    {menuVisible && (
                        <>
                            <MenuContainer ref={menuContainerRef}>
                                <PriorityButton
                                    activeButton={priorityMenuContainerVisible}
                                    onClick={() => setPriorityMenuContainerVisible((prevstate) => !prevstate)}
                                    ref={priorityMenuButtonRef}
                                >
                                    <PriorityButtonImg activeButton={priorityMenuContainerVisible} src={IconArrows} />
                                </PriorityButton>
                                <DeleteButton onClick={() => handleDelete()} />
                            </MenuContainer>
                            {priorityMenuContainerVisible && (
                                <PriorityMenuWrapper>
                                    <PriorityMenu
                                        ref={priorityMenuContainerRef}
                                        onSelect={handlePrioritySelect}
                                        onClose={() => setPriorityMenuContainerVisible(false)}
                                    />
                                </PriorityMenuWrapper>
                            )}
                        </>
                    )}
                </MainContainer>
                <SubContainer>
                    <DateContainer>{formatDate(data.targetDate)}</DateContainer>
                    <TagsContainer>
                        {data.tags.map((tag) => (
                            <Tag key={tag}>{tag !== 'none' ? tag : 'Нет меток'}</Tag>
                        ))}
                    </TagsContainer>
                </SubContainer>
            </Wrapper>
        </>
    );
};

export default TodoItem;
