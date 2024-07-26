import React from 'react';
import { styled, css } from 'styled-components';
import Iconhash from '../assets/images/icon-hash.png';
import { AppDispatch, RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import IconDelete from '../assets/images/icon-delete-2.png';
import { deleteHashTagFromFirebase } from '../store/hashtagSlice';
import { deleteTag } from '../store/todoSlice';

const Wrapper = styled.div`
    z-index: 200;
    position: relative;

    display: flex;

    user-select: none;
`;

const OpenButton = styled.div<{ $activebutton: boolean }>`
    height: 25px;
    aspect-ratio: 1/1;

    border: 1px solid #535353;
    border-radius: 3px;

    margin-left: 5px;

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    transition: 0.5s ease;

    ${({ $activebutton }) =>
        $activebutton
            ? css`
                  background-color: #2e2e2e;
                  box-shadow: 0 0 5px rgba(83, 83, 83, 0.5);
              `
            : css`
                  background-color: none;
              `}
`;

const IconHash = styled.img<{ $activebutton: boolean }>`
    width: 100%;
    height: 100%;

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

const Container = styled.div`
    position: absolute;
    right: -155px;
    top: 20px;

    display: flex;
    width: 150px;
    min-height: 28px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const TagContainer = styled.div`
    display: flex;
    width: 100%;
    height: 18px;

    padding: 5px;

    justify-content: space-between;
    align-items: center;

    transition: 0.3s ease;

    &:hover {
        opacity: 0.7;
    }
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

const DeleteButton = styled.div`
    z-index: 400;

    display: flex;
    width: 18px;
    height: 18px;

    background: no-repeat center/70% url(${IconDelete});

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

export interface HashtagsProps {
    id: string | null;
    hashtags: string[] | null;
}

const HashtagSettings: React.FC<HashtagsProps> = ({ id, hashtags }) => {
    const [containerVisible, setContainerVisible] = React.useState<boolean>(false);

    const buttonRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const isLocal = id !== null ? true : false;

    const tags = hashtags !== null ? hashtags : useSelector((state: RootState) => state.hashtags.tags);
    const todos = useSelector((state: RootState) => state.todos.todos);

    const dispatch: AppDispatch = useDispatch();

    const handleOpenClick = () => {
        setContainerVisible((prevState) => !prevState);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setContainerVisible(false);
        }
    };

    React.useEffect(() => {
        if (containerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerVisible]);

    const handleDelete = (tag: string) => {
        dispatch(deleteHashTagFromFirebase(tag));
        todos.map((todo) => dispatch(deleteTag({ id: todo.data.id, tag: tag })));
    };

    const handleDeleteLocal = (tag: string) => {
        if (id) {
            dispatch(deleteTag({ id: id, tag: tag }));
            console.log('match');
        }
    };

    return (
        <>
            <Wrapper>
                <OpenButton ref={buttonRef} onClick={() => handleOpenClick()} $activebutton={containerVisible}>
                    <IconHash src={Iconhash} $activebutton={containerVisible} />
                </OpenButton>
                {containerVisible && (
                    <Container ref={containerRef}>
                        {tags.length === 1 && tags[0] === 'none' ? (
                            <Tag>Нет меток</Tag>
                        ) : (
                            tags.map(
                                (tag) =>
                                    tag !== 'none' && (
                                        <TagContainer key={tag}>
                                            <Tag>{tag}</Tag>
                                            <DeleteButton
                                                onClick={() => {
                                                    isLocal ? handleDeleteLocal(tag) : handleDelete(tag);
                                                }}
                                            />
                                        </TagContainer>
                                    ),
                            )
                        )}
                    </Container>
                )}
            </Wrapper>
        </>
    );
};

export default HashtagSettings;
