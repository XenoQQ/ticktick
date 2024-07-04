import React from 'react';
import { styled } from 'styled-components';
import IconSort from '../assets/images/icon-sort.png';
import { useDispatch } from 'react-redux';
import { sortTodos } from '../store/todoSlice';
import { switchGroupCase } from '../store/groupSlice';

const ToolbarButton = styled.div`
    position: absolute;
    right: 10px;
    top: 67px;

    width: 25px;
    height: 25px;

    background: no-repeat center/80% url(${IconSort});

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    align-self: flex-end;

    transition: 1s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }
`;

const ToolbarContainer = styled.div`
    position: absolute;
    right: 44px;
    top: 27px;

    display: flex;
    width: 140px;
    height: 65px;
    padding: 0 5px 0 5px;

    background-color: #202020;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const ToolbarOptionbutton = styled.button`
    display: flex;

    width: 100%;
    height: 25px;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    background-color: #202020;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 15px;

    align-items: center;
    justify-content: center;

    transition: 1s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }
`;

const GroupOptionsContainer = styled.div`
    position: absolute;

    top: -3px;
    right: 157px;

    display: flex;
    width: 140px;
    height: 125px;
    padding: 0 5px 0 5px;

    background-color: #202020;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const SortOptionsContainer = styled.div`
    position: absolute;

    top: 29px;
    right: 157px;

    display: flex;
    width: 140px;
    height: 150px;
    padding: 0 5px 0 5px;

    background-color: #202020;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

type VisibleCase = 'containerVisible' | 'groupVisible' | 'sortVisible';

const TodoToolbar: React.FC = () => {
    const [visibleCase, setVisibleCase] = React.useState({
        containerVisible: false,
        groupVisible: false,
        sortVisible: false,
    });

    const handleButtonClick = (caseName: VisibleCase) => {
        setVisibleCase((prevstate) => {
            const newState = { ...prevstate, groupVisible: false, sortVisible: false };
            if (caseName === 'containerVisible') {
                newState.containerVisible = !prevstate.containerVisible;
            } else {
                newState.containerVisible = true;
                newState[caseName] = !prevstate[caseName];
            }
            return newState;
        });
    };

    const toolBarRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            toolBarRef.current &&
            !toolBarRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setVisibleCase({
                containerVisible: false,
                sortVisible: false,
                groupVisible: false,
            });
        }
    };

    React.useEffect(() => {
        if (visibleCase.containerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visibleCase.containerVisible]);

    React.useEffect(() => {
        if (visibleCase.groupVisible || visibleCase.sortVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visibleCase.groupVisible, visibleCase.sortVisible]);

    const dispatch = useDispatch();

    const handleSort = (sortCase: 'date' | 'name' | 'priority' | 'none') => {
        dispatch(sortTodos(sortCase));
    };

    const handleGroup = (groupCase: 'date' | 'priority' | 'tag' | 'none') => {
        dispatch(switchGroupCase(groupCase));
    };
    return (
        <>
            <ToolbarButton ref={buttonRef} onClick={() => handleButtonClick('containerVisible')} />
            {visibleCase.containerVisible && (
                <ToolbarContainer ref={toolBarRef}>
                    <ToolbarOptionbutton onClick={() => handleButtonClick('groupVisible')}>Группировать</ToolbarOptionbutton>
                    <ToolbarOptionbutton onClick={() => handleButtonClick('sortVisible')}>Сортировать</ToolbarOptionbutton>
                    {visibleCase.groupVisible && (
                        <GroupOptionsContainer>
                            <ToolbarOptionbutton onClick={() => handleGroup('date')}>По дате</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleGroup('tag')}>По метке</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleGroup('priority')}>По приоритету</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleGroup('none')}>Нет</ToolbarOptionbutton>
                        </GroupOptionsContainer>
                    )}
                    {visibleCase.sortVisible && (
                        <SortOptionsContainer>
                            <ToolbarOptionbutton onClick={() => handleSort('date')}>По дате</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleSort('name')}>По названию</ToolbarOptionbutton>
                            <ToolbarOptionbutton>По метке</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleSort('priority')}>По приоритету</ToolbarOptionbutton>
                            <ToolbarOptionbutton onClick={() => handleSort('none')}>Нет</ToolbarOptionbutton>
                        </SortOptionsContainer>
                    )}
                </ToolbarContainer>
            )}
        </>
    );
};

export default TodoToolbar;
