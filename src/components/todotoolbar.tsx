import React, { useEffect, useCallback, useState, useRef } from 'react';
import { styled, css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '../store/store';
import { switchGroupCase, switchSortCase } from '../store/optionsSlice';
import { switchShow } from '../store/showSlice';
import { TitleMap, VisibleCase, VisibleCaseState, SortCase, GroupCase } from '../controls/types';

import HashtagSettings from './hashtagsettings';

import IconSort from '../assets/images/icon-sort.png';
import IconShow from '../assets/images/icon-show.png';
import IconHide from '../assets/images/icon-hide.png';
import Iconhash from '../assets/images/icon-hash.png';

const Wrapper = styled.div`
    position: relative;

    display: flex;
    height: 25px;

    margin-top: 5px;

    justify-content: end;
    align-items: center;

    user-select: none;
`;

const ShowButton = styled.div<{ $activebutton: boolean }>`
    height: 100%;
    aspect-ratio: 1/1;

    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;

    margin-right: 5px;

    transition: 0.5s ease;

    cursor: pointer;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  background: no-repeat center/80% url(${IconShow});
                  background-color: ${({ theme }) => theme.colors.activeButtonBackground};
                  box-shadow: ${({ theme }) => theme.boxShadow.activeButton};
              `
            : css`
                  background: no-repeat center/80% url(${IconHide});
              `}

    &:hover {
        opacity: 0.7;
    }
`;

const HashtagButton = styled.div<{ $activebutton: boolean }>`
    display: flex;
    height: 100%;
    aspect-ratio: 1/1;

    margin-right: 5px;

    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;

    justify-content: center;
    align-items: center;

    transition: 0.5s ease;

    cursor: pointer;

    transition: 0.5s ease;

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

const HashtagButtonImg = styled.img<{ $activebutton: boolean }>`
    width: 100%;
    aspect-ratio: 1/1;

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(90deg);
              `}
`;

const HashtagSettingsWrapper = styled.div`
    z-index: 9999;
    position: absolute;
    top: 20px;
    right: -125px;

    @media (max-width: 768px) {
        right: -5px;
    }
`;

const OptionsButton = styled.div<{ $activebutton: boolean }>`
    height: 100%;
    aspect-ratio: 1/1;

    background: no-repeat center/80% url(${IconSort});
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;

    transition: 0.5s ease;

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

const OptionsWrapper = styled.div`
    z-index: 8888;

    position: absolute;
    right: -215px;
    top: 20px;

    display: flex;
    width: 210px;
    height: 55px;

    padding: 5px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    box-shadow: ${({ theme }) => theme.boxShadow.default};
    border-radius: 3px;

    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        right: -5px;
    }
`;

const CaseButton = styled.button<{ $activebutton: boolean }>`
    display: flex;
    width: 100%;
    height: 25px;

    background-color: transparent;
    border: none;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.uiTextColor};
    font-size: 12px;

    justify-content: space-between;
    align-items: center;

    transition: 0.5s ease;

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

const CaseTitle = styled.div`
    display: flex;
    width: auto;
    height: 25px;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.uiTextColor};
    opacity: 0.8;
    font-size: 12px;

    justify-content: center;
    align-items: center;
`;

const GroupWrapper = styled.div`
    position: absolute;
    right: -10px;
    top: 30px;

    display: flex;
    width: 130px;
    height: 125px;

    padding: 5px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;
    box-shadow: ${({ theme }) => theme.boxShadow.default};

    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        right: 5px;
    }
`;

const SortWrapper = styled.div`
    position: absolute;
    right: -10px;
    top: 60px;

    display: flex;
    width: 130px;
    height: 185px;

    padding: 5px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    box-shadow: ${({ theme }) => theme.boxShadow.default};
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;

    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        right: 5px;
    }
`;

const OptionButton = styled.button`
    display: flex;
    width: 100%;
    height: 25px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: none;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.uiTextColor};
    font-size: 12px;

    align-items: center;
    justify-content: flex-start;

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const MemoizedHashtagSettings = React.memo(HashtagSettings);

const TodoToolbar: React.FC = () => {
    const [groupTitle, setGroupTitle] = useState<string>('Нет');
    const [sortTitle, setSortTitle] = useState<string>('Нет');
    const [hashtagSettingsVisible, setHashtagSettingsVisible] = useState<boolean>(false);
    const [visibleCase, setVisibleCase] = useState<VisibleCaseState>({
        optionsWrapperVisible: false,
        groupWrapperVisible: false,
        sortWrapperVisible: false,
    });

    const optionsButtonRef = useRef<HTMLDivElement>(null);
    const optionsWrapperRef = useRef<HTMLDivElement>(null);
    const hashtagButtonRef = useRef<HTMLDivElement>(null);
    const hashtagsSettingsWrapperRef = useRef<HTMLDivElement>(null);

    const showSub: boolean = useSelector((state: RootState) => state.showTags);

    const dispatch = useDispatch<AppDispatch>();

    const handleShowClick = () => {
        dispatch(switchShow());
    };

    const handleButtonClick = (caseName: VisibleCase): void => {
        switch (caseName) {
            case 'optionsButtonClick':
                setVisibleCase((prevstate) => ({
                    optionsWrapperVisible: !prevstate.optionsWrapperVisible,
                    groupWrapperVisible: false,
                    sortWrapperVisible: false,
                }));
                break;
            case 'groupButtonClick':
                setVisibleCase((prevstate) => ({
                    ...prevstate,
                    groupWrapperVisible: !prevstate.groupWrapperVisible,
                    sortWrapperVisible: false,
                }));
                break;
            case 'sortButtonClick':
                setVisibleCase((prevstate) => ({
                    ...prevstate,
                    sortWrapperVisible: !prevstate.sortWrapperVisible,
                    groupWrapperVisible: false,
                }));
                break;
            default:
                break;
        }
    };

    const handleClickOutside = useCallback(
        (event: MouseEvent): void => {
            if (
                optionsButtonRef.current &&
                !optionsButtonRef.current.contains(event.target as Node) &&
                optionsWrapperRef.current &&
                !optionsWrapperRef.current.contains(event.target as Node)
            ) {
                setVisibleCase({
                    optionsWrapperVisible: false,
                    sortWrapperVisible: false,
                    groupWrapperVisible: false,
                });
            }

            if (
                hashtagButtonRef.current &&
                !hashtagButtonRef.current.contains(event.target as Node) &&
                hashtagsSettingsWrapperRef.current &&
                !hashtagsSettingsWrapperRef.current.contains(event.target as Node)
            ) {
                setHashtagSettingsVisible(false);
            }
        },
        [visibleCase],
    );

    useEffect(() => {
        if (visibleCase.optionsWrapperVisible || hashtagSettingsVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visibleCase.optionsWrapperVisible, hashtagSettingsVisible]);

    const handleGroup = (groupCase: GroupCase): void => {
        dispatch(switchGroupCase(groupCase));
        setGroupTitle(groupTitleMap[groupCase]);
        setVisibleCase({
            ...visibleCase,
            groupWrapperVisible: false,
        });
    };

    const handleSort = (sortCase: SortCase): void => {
        dispatch(switchSortCase(sortCase));
        setSortTitle(sortTitleMap[sortCase]);
        setVisibleCase({
            ...visibleCase,
            sortWrapperVisible: false,
        });
    };

    const groupTitleMap: TitleMap = {
        none: 'Нет',
        date: 'Дата выполнения',
        tag: 'Метка',
        priority: 'Приоритет',
    };

    const sortTitleMap: TitleMap = {
        none: 'Нет',
        createDate: 'Дата добавления',
        date: 'Дата выполнения',
        name: 'Имя',
        tag: 'Метка',
        priority: 'Приоритет',
    };

    return (
        <Wrapper>
            <ShowButton $activebutton={showSub} onClick={() => handleShowClick()} />
            <HashtagButton
                ref={hashtagButtonRef}
                onClick={() => setHashtagSettingsVisible((prevstate) => !prevstate)}
                $activebutton={hashtagSettingsVisible}
            >
                <HashtagButtonImg src={Iconhash} $activebutton={hashtagSettingsVisible} />
            </HashtagButton>
            <OptionsButton
                $activebutton={visibleCase.optionsWrapperVisible}
                ref={optionsButtonRef}
                onClick={() => handleButtonClick('optionsButtonClick')}
            />
            {hashtagSettingsVisible && (
                <HashtagSettingsWrapper ref={hashtagsSettingsWrapperRef}>
                    <MemoizedHashtagSettings id={null} hashtags={null} />
                </HashtagSettingsWrapper>
            )}
            {visibleCase.optionsWrapperVisible && (
                <OptionsWrapper ref={optionsWrapperRef}>
                    <CaseButton $activebutton={visibleCase.groupWrapperVisible} onClick={() => handleButtonClick('groupButtonClick')}>
                        Группировать <CaseTitle>{groupTitle}</CaseTitle>
                    </CaseButton>
                    <CaseButton $activebutton={visibleCase.sortWrapperVisible} onClick={() => handleButtonClick('sortButtonClick')}>
                        Сортировать <CaseTitle>{sortTitle}</CaseTitle>
                    </CaseButton>
                    {visibleCase.groupWrapperVisible && (
                        <GroupWrapper>
                            <OptionButton onClick={() => handleGroup('none')}>Нет</OptionButton>
                            <OptionButton onClick={() => handleGroup('date')}>Дата выполнения</OptionButton>
                            <OptionButton onClick={() => handleGroup('tag')}>Метка</OptionButton>
                            <OptionButton onClick={() => handleGroup('priority')}>Приортитет</OptionButton>
                        </GroupWrapper>
                    )}
                    {visibleCase.sortWrapperVisible && (
                        <SortWrapper>
                            <OptionButton onClick={() => handleSort('none')}>Нет</OptionButton>
                            <OptionButton onClick={() => handleSort('createDate')}>Дата добавления</OptionButton>
                            <OptionButton onClick={() => handleSort('date')}>Дата выполнения</OptionButton>
                            <OptionButton onClick={() => handleSort('name')}>Имя</OptionButton>
                            <OptionButton onClick={() => handleSort('tag')}>Метка</OptionButton>
                            <OptionButton onClick={() => handleSort('priority')}>Приоритет</OptionButton>
                        </SortWrapper>
                    )}
                </OptionsWrapper>
            )}
        </Wrapper>
    );
};

export default TodoToolbar;
