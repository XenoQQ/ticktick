import React, { forwardRef } from 'react';
import { styled } from 'styled-components';
import { PriorityMenuProps } from '../controls/types';

const PriorityMenuContainer = styled.div`
    z-index: 9999;
    position: absolute;

    display: flex;
    width: 134px;
    height: 55px;

    padding: 0px 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    border-radius: 3px;
    box-shadow: 0 0 5px #0000007f;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const PriorityMenuContainerTitle = styled.div`
    display: flex;
    width: 100%;

    font-family: 'Ubuntu', sans-serif;
    font-size: 12px;
    color: #757575;

    justify-content: center;
`;

const PriorityMenuContainerButton = styled.div<{ $bocolor: string }>`
    display: flex;
    width: 25px;
    height: 25px;

    background-color: #202020;
    border: 2px solid ${({ $bocolor }) => $bocolor};
    border-radius: 4px;

    cursor: pointer;

    transition: 0.5s ease;

    &:hover {
        box-shadow: ${({ $bocolor }) => ($bocolor !== '#3b3b3b' ? `0 0 5px ${$bocolor}, inset 0 0 5px ${$bocolor}` : 'none')};
    }
`;

const PriorityMenu = forwardRef<HTMLDivElement, PriorityMenuProps>(({ onSelect, onClose }, ref) => {
    const handleSelect = (priority: 'none' | 'low' | 'medium' | 'high') => {
        onSelect(priority);
        onClose();
    };

    return (
        <PriorityMenuContainer ref={ref}>
            <PriorityMenuContainerTitle>Приоритет</PriorityMenuContainerTitle>
            <PriorityMenuContainerButton $bocolor="#D52b24" onClick={() => handleSelect('high')} />
            <PriorityMenuContainerButton $bocolor="#FAA80C" onClick={() => handleSelect('medium')} />
            <PriorityMenuContainerButton $bocolor="#4772fa" onClick={() => handleSelect('low')} />
            <PriorityMenuContainerButton $bocolor="#3b3b3b" onClick={() => handleSelect('none')} />
        </PriorityMenuContainer>
    );
});

PriorityMenu.displayName = 'PriorityMenu';

export default PriorityMenu;
