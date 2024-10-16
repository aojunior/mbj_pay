import { styled } from 'styled-components'
import { MdDeleteForever, MdEdit } from 'react-icons/md'


export const Title =  styled.h1`
  font-size: 24px;
  margin: 0;
  padding: 0;
  font-weight: 600;
`

export const Section = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

export const TableWrapper = styled.div`
  max-height: 350px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    border: 1px solid #e4e4e7;
    border-radius: 0.28rem;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.37rem rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3178c6;
    border: 1px solid  #e4e4e7;
    border-radius: 0.28rem;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 5px;
  font-size: 18px;
  font-family: Arial, sans-serif;
  align-self: center;
  text-align: center;
`

export const Thead = styled.thead`
  background-color: #3178c6;
  /* background-color: #009879; */
  color: #ffffff;
  text-align: left;
`

export const Th = styled.th`
  padding: 12px 15px;
`

export const Tr = styled.tr`
  border-bottom: 1px solid #dddddd;
`

export const Td = styled.td`
  padding: 12px 15px;
  border: 1px solid #dddddd;
`

export const Tbody = styled.tbody`
  & tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

`

export const EditIcon = styled(MdEdit)`
  background-color: #e7e7e4;
  padding: 2px;
  border-radius: 4px;
  color: #4422ee;
  cursor: pointer;
`

export const DeleteIcon = styled(MdDeleteForever)`
  background-color: #e7e7e4;
  padding: 2px;
  border-radius: 4px;
  color: #ee4422;
  cursor: pointer;
`

export const WrapIpunt = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled.label`
  color: #9d9d9d;
`

export const Input = styled.input`
  width: 300px;
  height: 30px;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid #c7c7c4;
`
