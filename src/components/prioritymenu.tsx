import React, { useCallback } from 'react';
import { styled } from 'styled-components';

import { PriorityMenuProps, Colors } from '../controls/types';

const priorityColor = (priority: 'high' | 'medium' | 'low' | 'none', colors: Colors) => {
    switch (priority) {
        case 'high':
            return colors.highPriority;
        case 'medium':
            return colors.mediumPriority;
        case 'low':
            return colors.lowPriority;
        case 'none':
        default:
            return colors.noPriority;
    }
};

const Wrapper = styled.div`
    position: relative;

    display: flex;
    width: 135px;
    height: 55px;

    padding: 0px 5px;

    border: 1px solid ${({ theme }) => theme.colors.defaultBorder};
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.backgroundColor};
    box-shadow: ${({ theme }) => theme.boxShadow.default};

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const Title = styled.div`
    display: flex;
    width: 100%;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.uiTextColor};

    justify-content: center;
    align-items: center;
`;

const Button = styled.div<{ $priority: 'high' | 'medium' | 'low' | 'none' }>`
    display: flex;
    width: 25px;
    aspect-ratio: 1/1;

    background-color: ${({ theme }) => theme.colors.backgroundColor};
    border: 2px solid ${({ $priority, theme }) => priorityColor($priority, theme.colors)};
    border-radius: 5px;

    cursor: pointer;

    transition: 0.5s ease;

    &:hover {
        box-shadow: ${({ $priority, theme }) =>
            $priority !== 'none'
                ? `0 0 5px ${priorityColor($priority, theme.colors)}, inset 0 0 5px ${priorityColor($priority, theme.colors)}`
                : 'none'};
    }
`;

const PriorityMenu: React.FC<PriorityMenuProps> = ({ onSelect }) => {
    const handleSelect = useCallback(
        (priority: 'none' | 'low' | 'medium' | 'high'): void => {
            onSelect(priority);
        },
        [onSelect],
    );

    return (
        <Wrapper>
            <Title>Приоритет</Title>
            <Button $priority="high" onClick={() => handleSelect('high')} />
            <Button $priority="medium" onClick={() => handleSelect('medium')} />
            <Button $priority="low" onClick={() => handleSelect('low')} />
            <Button $priority="none" onClick={() => handleSelect('none')} />
        </Wrapper>
    );
};

export default PriorityMenu;
