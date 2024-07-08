import React from 'react';
import { styled } from 'styled-components';

const SettingsWrapper = styled.div`
    z-index: 100;

    position: relative;

    display: flex;
    width: 100%;

    justify-content: start;
`;
const SettingsButton = styled.div`
    position: absolute;
    width: 25px;
    height: 25px;

    margin: 5px 0 0 0;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const TodoSettings: React.FC = () => {
    return (
        <>
            <SettingsWrapper>
                <SettingsButton></SettingsButton>
            </SettingsWrapper>
        </>
    );
};

export default TodoSettings;
