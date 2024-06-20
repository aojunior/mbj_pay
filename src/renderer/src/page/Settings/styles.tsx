import {styled} from "styled-components";
import { MdDeleteForever } from "react-icons/md";


export const Section = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    display: flex;
    flex-direction: column;
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 18px;
    font-family: Arial, sans-serif;
    align-self: center;
    text-align: center;
`;

export const Thead = styled.thead`
    background-color: #009879;
    color: #ffffff;
    text-align: left;
`;

export const Th = styled.th`
    padding: 12px 15px;
`;

export const Tr = styled.tr`
    border-bottom: 1px solid #dddddd;
`;

export const Td = styled.td`
    padding: 12px 15px;
    border: 1px solid #dddddd;
`;

export const Tbody = styled.tbody`
    & tr:nth-of-type(even) {
    background-color: #f3f3f3;
    }
`;

export const DeleteIcon = styled(MdDeleteForever)`
    background-color: #e7e7e4;
    padding: 2px;
    border-radius: 4px;
    color: #ee4422;
    cursor: pointer;
`;

export const WrapIpunt = styled.div`
    display: flex;
    flex-direction: column;
`

export const Label = styled.label`
    color: #9d9d9d;
`;

export const Input = styled.input`
    width: 300px;
    height: 30px;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e4e4e7;
`;