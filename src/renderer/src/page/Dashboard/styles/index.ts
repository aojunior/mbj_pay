import { styled } from 'styled-components'


export const Dialog = styled.dialog`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    background: #0009;
    backdrop-filter: blur(2px);
`;


export const DialogContext = styled.div`
    width: 80%;
    height: 85%;
    display: flex;
    background: #fff;
    padding: 10px 15px;

    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start; 
    border: 1px solid #e4e4e7;

    box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 10px;   
`;

export const FilterPanel = styled.div`
    width: 100%;
    padding: 5px;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
`;

export const RowDetails = styled.div`
    width: 100%;
    padding: 5px;
    border: 1px solid #e7e7e4;
    border-radius: 8px;
`;

export const DetailContent = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-left: 25px;
    align-items: flex-end;
`;

export const ContentSelect = styled.div`
    display: flex;
    width: 95%;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border-radius: 5px;
    background-color: #e7e7e4;
    transition: 100ms;
    &:hover {
        cursor: pointer;
        background-color: #d6d6e5;
    }
`;