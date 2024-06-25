import React from "react";
import styled from "styled-components";

const ToolbarButton = styled.div`
    position: absolute;
    right: 10px;
    top: 65px;

    width: 50px;
    height: 20px;

    margin: 5px 0 10px 0;

    border: 3px solid #3b3b3b;
    border-radius: 5px;

    align-self: flex-end;
`;

const ToolbarContainer = styled.div`
    position: absolute;
    right: -150px;
    top: 50px;

    display: flex;
    width: 140px;
    height: 60px;
    padding: 0 5px 0 5px;

    background-color: #202020;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;

    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

const ToolbarOptionbutton = styled.div`
    width: 100%;
    height: 25px;

    border: 3px solid;
    border-radius: 5px;
    border-color: #3b3b3b;
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
                    <ToolbarOptionbutton />
                    <ToolbarOptionbutton />
                </ToolbarContainer>
            )}
        </>
    );
};

export default TodoToolbar;
