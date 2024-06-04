import { styled } from "styled-components";

export const Container = styled.div`
    width: 100%;
    background-color: #fff;
    backdrop-filter: blur(2px);
    background: #0001;
    padding: 5px;
`;

export const Link = styled.button`
    border: none;
    padding: 5px;
    background-color: #3178c6;
    border-radius: 4px;
    text-decoration: none;
    color: #fff;
    &:hover {
        cursor: pointer;
    }
`
