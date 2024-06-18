/* eslint-disable prettier/prettier */
import { styled } from 'styled-components'

export const ProgressHeader = styled.div`
    border: 1 solid black;
    width: 80%;
`; 

export const ProgressBar = styled.div` 
    border-radius: 20px;
    background-color: gray;
`;

export const ProgressBarFill = styled.div`
    width: 33.33%;
    height: 10px;
    border-radius: 20px;
    background-color: #3178c6;
`;


export const ContantImg = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-end;
`;

export const UploadImg = styled.div`
    width: 200px;
    height: 250px;
    border-radius: 10px;
    border: 1px solid #e4e4e7;
    overflow: hidden;
`;

export const ImgPreview = styled.img`
    width: 100%;
    height: 100%;
    image-rendering: optimizeQuality;
`;

export const InputImg = styled.input`
    display: none;
`;

export const PlaceholderImage = styled.label`
    border-radius: 10px;
    border: 1px solid #e4e4e7;
    display: inline-block;
    padding: 6px 0;
    margin-top: 5px;
    cursor: pointer;
    text-align: center;
    font-weight: 700;
    width: 200px;
    
`;