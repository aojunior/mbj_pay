import { styled } from 'styled-components'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

export const Container = styled.div`
  width: 100%;
  height: 580px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  overflow-y: hidden;

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
    border-radius: 0.28rem;
    border: 1px solid  #e4e4e7;
  }
`

export const ContentInRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const Card = styled.div`
  width: fit-content;
  max-width: 100%;
  height: auto;
  padding: 16px;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  background-color: #fff;
`

export const CardHeader = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
`

export const CardTitle = styled.h3`
  text-align: start;
  font-weight: bold;
`

export const CardContent = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`

export const CardFooter = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
`

export const Separator = styled.hr`
  margin: 10px 0;
  /* border: 0.1px solid rgba(0,0,0, 0.5); */
`

export const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 80%;
  margin-bottom: 5px;
`

export const Label = styled.label`
  font-weight: 600;
`

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #c4c4c7;
  border-radius: 8px;
  &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }
`

export const Text = styled.p`
  padding: 10px;
  border: 1px solid #c4c4c7;
  border-radius: 8px;
  &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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
  transition: 300ms;
  &:hover {
    background-color: #2b67aa;
    cursor: pointer;
  }
`

export const TextArea = styled.textarea`
  height: 100px;
  resize: none;
  border: 1px solid #c7c7c4;
  padding: 10px;
  border-radius: 8px;
`

export const IconEye = styled(AiFillEye)`
  color: #4f4f4f;
  position: absolute;
  margin-right: 5px;
  cursor: pointer;
`
export const IconEyeInvisible = styled(AiFillEyeInvisible)`
  color: #4f4f4f;
  position: absolute;
  margin-right: 5px;
  cursor: pointer;
`

export const Blur = styled.div`
  width: 80px;
  background-color: rgba(255, 255, 255, 0.5);
  
  backdrop-filter: blur(6px);
  position: absolute;
  height: 20px;
`

export const LinkText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: #3178c6;
  font-size: 12px;
  transition: 200ms;
  &:hover {
    color: #204b7b;
  }
`