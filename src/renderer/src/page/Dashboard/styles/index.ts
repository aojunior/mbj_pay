import { styled } from 'styled-components'

export const TextArea = styled.textarea`
    height: 100px;
    resize: none;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
`;

export const Dialog = styled.dialog`
    width: 80%;
    height: 70%;
    padding: 10px 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;    
    position: absolute;
    left: 10%;
    top: 10%;
    border: 1px solid #e4e4e7;
    &::backdrop {
        background-color: #000;
    }
    backdrop-filter: blur(2px);
    box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
`;

export const FilterPanel = styled.div`
    width: 100%;
    padding: 5px;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
`;