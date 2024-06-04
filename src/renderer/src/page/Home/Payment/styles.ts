import { styled } from 'styled-components'

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
    flex-direction: column;
`

export const Display = styled.div`
    background-color: var(--color-background);
    padding: 20px 40px;
    color: black;
    border-radius: 5px;
    text-align: center;
    width: 90vw;
    height: 90%;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
`

export const ValueDisplay = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 10px;
    justify-content: space-between;
    border: 1px solid #e7e7e4;
    border-radius: 5px;
`

export const ValueLabel = styled.h4`
    font-size: 22px;
    font-weight: 600;
`

export const ValueAmount = styled.h4`
    font-size: 34px;
    font-weight: 700;
`

export const InfoDisplay = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 0;
`

export const ContainQRCode = styled.div`
`

export const QRcode = styled.img`
    width: 300px;
    height: 300px;
`

export const ContainInfo = styled.div`
    width: 50%;
    text-align: left;
`

export const  LoadInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`

export const Footer = styled.div`
    margin-top: 4%;
    align-self: center;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90vw;
`

export const Button = styled.button`
    padding: 10px 5px;
    border: none;
    border-radius: 5px;
    background-color: rgb(38, 125, 201);
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    transition: 300ms;
    &:hover {
        cursor: pointer;
        background-color: #3498db;
    }
`