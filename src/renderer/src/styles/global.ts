import { styled } from 'styled-components'

export const Container = styled.div`
    width: 100%;
    height: 580px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: rgba(255,255,255,0.3);
    border-radius: 20px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
     -webkit-appearance: none;
     width: 10px;
     border:1px solid #e4e4e7;
     border-radius: 0.28rem;
    }

    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 0.37rem rgba(0,0,0,0.00);
    }
    &::-webkit-scrollbar-thumb {
        background-color: #3178c6;
        border-radius: 0.28rem;
    }
`;

export const ContentInRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;


export const Card = styled.div`
    width: fit-content;
    max-width: 100%;
    height: auto;
    padding: 16px;
    border: 1px solid #e4e4e7;
    border-radius: 10px;
    background-color: #fff;
`;

export const CardHeader = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
`;

export const CardTitle = styled.h3`
    text-align: start;
    font-weight: bold;
`;

export const CardContent = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;

export const Separator = styled.hr`
    margin-top: 10px;
    margin-bottom: 10px;
    /* border: 0.1px solid rgba(0,0,0, 0.5); */
`;

export const FormInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 80%;
`;

export const Label = styled.label`
     font-weight: 600;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    /* &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    } */
    &:focus {
        outline: none;

    }
`;

export const Button = styled.button`
    padding: 10px;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    background-color: #3178c6;
    color: #fff;
    width: 120px;
    font-weight: 700;
    &:hover {
        background-color: #2b67aa;
        cursor: pointer;
    }
`;