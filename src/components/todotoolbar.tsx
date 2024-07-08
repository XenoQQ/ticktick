import React from 'react';
import { styled, css } from 'styled-components';
import IconSort from '../assets/images/icon-sort.png';
import { useDispatch } from 'react-redux';
import { sortTodos } from '../store/todoSlice';
import { switchGroupCase } from '../store/groupSlice';

const ToolbarWrapper = styled.div`
    position: relative;

    display: flex;
    width: 100%;

    justify-content: end;
`;

const ToolbarButton = styled.div<{ activeButton: boolean }>`
    position: relative;
    width: 25px;
    height: 25px;

    margin: 5px 0 0 0;

    background: no-repeat center/80% url(${IconSort});
    border: 3px solid #3b3b3b;
    border-radius: 5px;

    align-self: flex-end;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  opacity: 0.7;
                  background-color: #3b3b3b;
              `
            : css`
                  opacity: 1;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const ToolbarContainer = styled.div`
    position: absolute;
    right: -160px;
    top: 3px;

    display: flex;
    width: 200px;
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

const ToolbarOptionbutton = styled.button<{ activeButton: boolean }>`
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

    justify-content: space-between;
    align-items: center;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  opacity: 0.7;
                  background-color: #3b3b3b;
              `
            : css`
                  opacity: 1;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const ToolbarOptionSubButton = styled.button`
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

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const GroupOptionsContainer = styled.div`
    position: absolute;

    right: -157px;
    top: -3px;

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

    right: -157px;
    top: -3px;

    display: flex;
    width: 140px;
    height: 155px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const OptionsTitle = styled.div`
    position: relative;

    display: flex;
    width: auto;
    height: 25px;

    font-family: 'Ubuntu', sans-serif;
    color: #75757586;
    font-size: 15px;

    justify-content: center;
    align-items: center;
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

    const dispatch = useDispatch();

    const [groupTitle, setGroupTitle] = React.useState<string>('нет');
    const [sortTitle, setSortTitle] = React.useState<string>('нет');

    const handleGroup = (groupCase: 'date' | 'priority' | 'tag' | 'none') => {
        dispatch(switchGroupCase(groupCase));
        setGroupTitle(groupTitleMap[groupCase]);
    };

    const handleSort = (sortCase: 'date' | 'name' | 'tag' | 'priority' | 'none') => {
        dispatch(sortTodos(sortCase));
        setSortTitle(sortTitleMap[sortCase]);
    };

    const groupTitleMap = {
        date: 'дата',
        priority: 'приоритет',
        tag: 'метка',
        none: 'нет',
    };

    const sortTitleMap = {
        date: 'дата',
        name: 'имя',
        tag: 'метка',
        priority: 'приоритет',
        none: 'нет',
    };

    return (
        <>
            <ToolbarWrapper>
                <ToolbarButton
                    activeButton={visibleCase.containerVisible}
                    ref={buttonRef}
                    onClick={() => handleButtonClick('containerVisible')}
                />
                {visibleCase.containerVisible && (
                    <ToolbarContainer ref={toolBarRef}>
                        <ToolbarOptionbutton activeButton={visibleCase.groupVisible} onClick={() => handleButtonClick('groupVisible')}>
                            Группировать <OptionsTitle>{groupTitle}</OptionsTitle>
                        </ToolbarOptionbutton>
                        <ToolbarOptionbutton activeButton={visibleCase.sortVisible} onClick={() => handleButtonClick('sortVisible')}>
                            Сортировать <OptionsTitle>{sortTitle}</OptionsTitle>
                        </ToolbarOptionbutton>
                        {visibleCase.groupVisible && (
                            <GroupOptionsContainer>
                                <ToolbarOptionSubButton onClick={() => handleGroup('date')}>По дате</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleGroup('tag')}>По метке</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleGroup('priority')}>По приоритету</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleGroup('none')}>Нет</ToolbarOptionSubButton>
                            </GroupOptionsContainer>
                        )}
                        {visibleCase.sortVisible && (
                            <SortOptionsContainer>
                                <ToolbarOptionSubButton onClick={() => handleSort('date')}>По дате</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleSort('name')}>По названию</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleSort('tag')}>По метке</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleSort('priority')}>По приоритету</ToolbarOptionSubButton>
                                <ToolbarOptionSubButton onClick={() => handleSort('none')}>Нет</ToolbarOptionSubButton>
                            </SortOptionsContainer>
                        )}
                    </ToolbarContainer>
                )}
            </ToolbarWrapper>
        </>
    );
};

export default TodoToolbar;
