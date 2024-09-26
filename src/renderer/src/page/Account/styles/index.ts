/* eslint-disable prettier/prettier */
import { styled } from 'styled-components'

export const ProgressHeader = styled.div`
  border: 1 solid black;
  width: 80%;
  
`

export const ProgressBar = styled.div`
  border-radius: 20px;
  background-color: gray;
`

export const ProgressBarFill = styled.div`
  width: 33.33%;
  height: 10px;
  border-radius: 20px;
  background-color: #3178c6;
`

export const ContantImg = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-end;
`

export const UploadImg = styled.div`
  width: 200px;
  height: 250px;
  border-radius: 10px;
  border: 1px solid #e4e4e7;
  overflow: hidden;
`

export const ImgPreview = styled.img`
  width: 100%;
  height: 100%;
  image-rendering: optimizeQuality;
`

export const InputImg = styled.input`
  display: none;
`

export const PlaceholderImage = styled.label`
  border-radius: 10px;
  border: 1px solid #c4c4c7;
  display: inline-block;
  padding: 6px 0;
  margin-top: 5px;
  cursor: pointer;
  text-align: center;
  font-weight: 700;
  width: 200px;
`

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

export const Title = styled.h1`
  text-align: center;
  color: #333;
`

export const TermsText = styled.div`
  margin: 0;
  line-height: 1.6;
  height: 400px;
  color: #555;
  overflow-y: scroll;
  border: 1px solid #c7c7c4;
  background-color: #fff;
  border-radius: 5px;
  padding: 5px;
`

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0 40px 0;
`

export const Checkbox = styled.input`
  margin-right: 10px;
`

export const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #3178c6;
  /* background-color: #009879; */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

export const Message = styled.p`
  margin: 20px 0;
  color: #555;
  text-align: center;
  max-width: 600px;
`
