import React from 'react';
import { styled } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../store/store';
import { deleteHashTagFromFirebase } from '../store/hashtagSlice';
import { deleteTag } from '../store/todoSlice';

import { HashtagsProps, TodoItemProps } from '../controls/types';

import IconDelete from '../assets/images/icon-delete-2.png';

const Wrapper = styled.div`
    position: relative;

    display: flex;
    min-width: 150px;
    min-height: 30px;

    padding: 0 5px;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;
    box-shadow: ${({ theme }) => theme.boxShadow.default};

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const TagWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 20px;

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
    height: 20px;

    margin-right: 3px;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.uiTextColor};

    justify-content: center;
    align-items: center;
`;

const DeleteButton = styled.div`
    z-index: 400;

    display: flex;
    width: 20px;
    aspect-ratio: 1/1;

    background: no-repeat center/70% url(${IconDelete});

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const HashtagSettings: React.FC<HashtagsProps> = ({ id, hashtags }) => {
    const isLocal = id !== null;

    const tags = hashtags ?? useSelector((state: RootState) => state.hashtags.tags);
    const todos: TodoItemProps[] = useSelector((state: RootState) => state.todos.todos);

    const dispatch: AppDispatch = useDispatch();

    const handleDelete = (tag: string): void => {
        dispatch(deleteHashTagFromFirebase(tag));
        todos.map((todo) => dispatch(deleteTag({ id: todo.data.id, tag: tag })));
    };

    const handleDeleteLocal = (tag: string): void => {
        if (id) {
            dispatch(deleteTag({ id: id, tag: tag }));
        }
    };

    return (
        <Wrapper>
            {tags.length === 1 && tags[0] === 'none' ? (
                <Tag>Нет меток</Tag>
            ) : (
                tags.map(
                    (tag) =>
                        tag !== 'none' && (
                            <TagWrapper key={tag}>
                                <Tag>{tag}</Tag>
                                <DeleteButton
                                    onClick={() => {
                                        isLocal ? handleDeleteLocal(tag) : handleDelete(tag);
                                    }}
                                />
                            </TagWrapper>
                        ),
                )
            )}
        </Wrapper>
    );
};

export default HashtagSettings;
