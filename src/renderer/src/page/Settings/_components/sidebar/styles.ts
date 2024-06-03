import { styled } from "styled-components";

export const Sidebar = styled.div`
    height: 100%;
    width: 250px;
    border-radius: 5px;
    padding: 10px;
    
    background-color: #fff;
`

export const SidebarContent = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 15px;
`

export const SidebarLink = styled.li`
    text-decoration: none;
    color: #444;
    &:hover {
        color: blue;
        cursor: pointer;
    }
    &:target {
        text-decoration: underline;
    }
`

