import React from 'react';
import { styled, css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { sortTodos } from '../store/todoSlice';
import { switchGroupCase } from '../store/groupSlice';
import { TitleMap, VisibleCase, VisibleCaseState, SortCase, GroupCase } from '../controls/types';
import IconSort from '../assets/images/icon-sort.png';

const Wrapper = styled.div`
    z-index: 100;
    position: relative;

    display: flex;
    width: 100%;

    justify-content: end;

    user-select: none;
`;

const OpenButton = styled.div<{ activeButton: boolean }>`
    position: relative;

    width: 25px;
    height: 25px;

    margin: 5px 0 0 0;

    background: no-repeat center/80% url(${IconSort});
    border: 1px solid #535353;
    border-radius: 3px;

    align-self: flex-end;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  background-color: #2e2e2e;
                  box-shadow: 0 0 5px rgba(83, 83, 83, 0.5);
              `
            : css`
                  opacity: 1;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const CaseContainer = styled.div`
    position: absolute;
    right: -215px;
    top: 25px;

    display: flex;
    width: 210px;
    height: 65px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const CaseButton = styled.button<{ activeButton: boolean }>`
    display: flex;
    width: 100%;
    height: 25px;

    background-color: transparent;
    border: none;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 12px;

    justify-content: space-between;
    align-items: center;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  opacity: 0.7;
                  background-color: #2e2e2e;
                  box-shadow: 0 0 5px rgba(83, 83, 83, 0.5);
              `
            : css`
                  opacity: 1;
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const CaseTitle = styled.div`
    position: relative;

    display: flex;
    width: auto;
    height: 25px;

    font-family: 'Ubuntu', sans-serif;
    color: #7575759e;
    font-size: 12px;

    justify-content: center;
    align-items: center;
`;

const GroupContainer = styled.div`
    position: absolute;
    left: 100px;
    top: 30px;

    display: flex;
    width: 130px;
    height: 125px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const SortContainer = styled.div`
    position: absolute;
    left: 100px;
    top: 60px;

    display: flex;
    width: 130px;
    height: 155px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border: 1px solid #535353;
    border-radius: 3px;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const OptionButton = styled.button`
    display: flex;
    width: 100%;
    height: 25px;

    background-color: #202020;
    border: none;

    font-family: 'Ubuntu', sans-serif;
    color: #757575;
    font-size: 12px;

    align-items: center;
    justify-content: flex-start;

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const TodoToolbar: React.FC = () => {
    const [groupTitle, setGroupTitle] = React.useState<string>('Нет');
    const [sortTitle, setSortTitle] = React.useState<string>('Дата добавления');

    const toolBarRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const [visibleCase, setVisibleCase] = React.useState<VisibleCaseState>({
        CaseContainerVisible: false,
        groupVisible: false,
        sortVisible: false,
    });

    const handleButtonClick = (caseName: VisibleCase) => {
        setVisibleCase((prevstate) => {
            const newState = { ...prevstate, groupVisible: false, sortVisible: false };
            if (caseName === 'CaseContainerVisible') {
                newState.CaseContainerVisible = !prevstate.CaseContainerVisible;
            } else {
                newState.CaseContainerVisible = true;
                newState[caseName] = !prevstate[caseName];
            }
            return newState;
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            toolBarRef.current &&
            !toolBarRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setVisibleCase({
                CaseContainerVisible: false,
                sortVisible: false,
                groupVisible: false,
            });
        }
    };

    React.useEffect(() => {
        if (visibleCase.CaseContainerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visibleCase.CaseContainerVisible]);

    const handleGroup = (groupCase: GroupCase) => {
        dispatch(switchGroupCase(groupCase));
        setGroupTitle(groupTitleMap[groupCase]);
        setVisibleCase({
            ...visibleCase,
            groupVisible: false,
        });
    };

    const handleSort = (sortCase: SortCase) => {
        dispatch(sortTodos(sortCase));
        setSortTitle(sortTitleMap[sortCase]);
        setVisibleCase({
            ...visibleCase,
            sortVisible: false,
        });
    };

    const groupTitleMap: TitleMap = {
        date: 'Дата выполнения',
        priority: 'Приоритет',
        tag: 'Метка',
        none: 'Нет',
    };

    const sortTitleMap: TitleMap = {
        date: 'Дата выполнения',
        name: 'Имя',
        tag: 'Метка',
        priority: 'Приоритет',
        none: 'Дата добавления',
    };

    return (
        <>
            <Wrapper>
                <OpenButton
                    activeButton={visibleCase.CaseContainerVisible}
                    ref={buttonRef}
                    onClick={() => handleButtonClick('CaseContainerVisible')}
                />
                {visibleCase.CaseContainerVisible && (
                    <CaseContainer ref={toolBarRef}>
                        <CaseButton activeButton={visibleCase.groupVisible} onClick={() => handleButtonClick('groupVisible')}>
                            Группировать <CaseTitle>{groupTitle}</CaseTitle>
                        </CaseButton>
                        <CaseButton activeButton={visibleCase.sortVisible} onClick={() => handleButtonClick('sortVisible')}>
                            Сортировать <CaseTitle>{sortTitle}</CaseTitle>
                        </CaseButton>
                        {visibleCase.groupVisible && (
                            <GroupContainer>
                                <OptionButton onClick={() => handleGroup('none')}>Нет</OptionButton>
                                <OptionButton onClick={() => handleGroup('date')}>Дата выполнения</OptionButton>
                                <OptionButton onClick={() => handleGroup('tag')}>Метка</OptionButton>
                                <OptionButton onClick={() => handleGroup('priority')}>Приортитет</OptionButton>
                            </GroupContainer>
                        )}
                        {visibleCase.sortVisible && (
                            <SortContainer>
                                <OptionButton onClick={() => handleSort('none')}>Дата добавления</OptionButton>
                                <OptionButton onClick={() => handleSort('date')}>Дата выполнения</OptionButton>
                                <OptionButton onClick={() => handleSort('name')}>Имя</OptionButton>
                                <OptionButton onClick={() => handleSort('tag')}>Метка</OptionButton>
                                <OptionButton onClick={() => handleSort('priority')}>Приоритет</OptionButton>
                            </SortContainer>
                        )}
                    </CaseContainer>
                )}
            </Wrapper>
        </>
    );
};

export default TodoToolbar;
