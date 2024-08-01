import React from 'react';
import { styled } from 'styled-components';

import { AppDispatch, RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import IconDelete from '../assets/images/icon-delete-2.png';
import { deleteHashTagFromFirebase } from '../store/hashtagSlice';
import { deleteTag } from '../store/todoSlice';

import { HashtagsProps, TodoItemProps } from '../controls/types';

const Wrapper = styled.div`
    position: relative;
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

const TagWrapper = styled.div`
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

const HashtagSettings: React.FC<HashtagsProps> = ({ id, hashtags }) => {
    const isLocal: boolean = id !== null ? true : false;

    const tags: string[] = hashtags !== null ? hashtags : useSelector((state: RootState) => state.hashtags.tags);
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
