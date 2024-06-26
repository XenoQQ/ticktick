import React from "react";
import styled from "styled-components";
import IconSort from "../assets/icon-sort.png";

const ToolbarButton = styled.div`
    position: absolute;
    right: 10px;
    top: 67px;

    width: 25px;
    height: 25px;

    background: no-repeat center/80% url(${IconSort});

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    align-self: flex-end;

    transition: 1s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }
`;

const ToolbarContainer = styled.div`
    position: absolute;
    right: 44px;
    top: 27px;

    display: flex;
    width: 140px;
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

const ToolbarOptionbutton = styled.button`
    display: flex;

    width: 100%;
    height: 25px;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    background-color: #202020;

    font-family: "Ubuntu", sans-serif;
    color: #757575;
    font-size: 15px;

    align-items: center;
    justify-content: center;

    
    transition: 1s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.7;
        transition: 0s;
    }
`;

const TodoToolbar: React.FC = () => {
    const [toolbarVisible, setToolbarVisible] = React.useState<boolean>(false);

    const handleToolbarButtonClick = () => {
        setToolbarVisible((prevstate) => !prevstate);
    };
    return (
        <>
            <ToolbarButton onClick={() => handleToolbarButtonClick()} />
            {toolbarVisible && (
                <ToolbarContainer>
                    <ToolbarOptionbutton>Группировать</ToolbarOptionbutton>
                    <ToolbarOptionbutton>Сортировать</ToolbarOptionbutton>
                </ToolbarContainer>
            )}
        </>
    );
};

export default TodoToolbar;
