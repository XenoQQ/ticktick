import React from 'react';
import { styled, css } from 'styled-components';
import Iconhash from '../assets/images/icon-hash.png';

const Wrapper = styled.div`
    z-index: 200;

    position: relative;

    display: flex;
    width: 100%;

    justify-content: end;
`;

const OpenButton = styled.div<{ activeButton: boolean }>`
    position: absolute;
    width: 25px;
    height: 25px;

    margin: 5px 0 0 0;

    border: 1px solid #535353;
    border-radius: 3px;

    transition: 0.5s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    transition: 0.5s ease;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  background-color: #2e2e2e;
                  box-shadow: 0 0 5px rgba(83, 83, 83, 0.5);
              `
            : css`
                  background-color: none;
              `}
`;

const IconHash = styled.img<{ activeButton: boolean }>`
    width: 100%;
    height: 100%;

    transition: 0.5s ease;

    ${({ activeButton }) =>
        activeButton
            ? css`
                  transform: rotate(-90deg);
              `
            : css`
                  transform: rotate(90deg);
              `}
`;

const Container = styled.div`
    position: absolute;
    right: -220px;
    top: 3px;

    display: flex;
    width: 200px;
    height: 65px;

    padding: 0 5px 0 5px;

    background-color: #202020;
    border: 1px solid #535353;
    box-shadow: 0 0 5px rgba(83, 83, 83, 0.5);
    border-radius: 3px;

    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`;

const HashtagSettings: React.FC = () => {
    const [containerVisible, setContainerVisible] = React.useState<boolean>(false);

    const handleOpenClick = () => {
        setContainerVisible((prevState) => !prevState);
    };

    return (
        <>
            <Wrapper>
                <OpenButton onClick={() => handleOpenClick()} activeButton={containerVisible}>
                    <IconHash src={Iconhash} activeButton={containerVisible} />
                </OpenButton>
                {containerVisible && <Container></Container>}
            </Wrapper>
        </>
    );
};

export default HashtagSettings;
