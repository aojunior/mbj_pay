import { useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import styled from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ContentInRow, FormInput, Input, Label } from '@renderer/styles/global';

const Container = styled.dialog`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(2px);
  position: absolute;
  top: 0;
  background: #00000050;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`
const Section = styled.div`
  width: 50%;
  height: 450px;
  background-color: #fff;
  border: 1px solid #e7e7e4;
  border-radius: 8px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: center;
`
const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
const Title = styled.h2`
  font-weight: 600;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
  gap: 15px;
`
const Button = styled.button`
  border: 1px solid #e4e4e7;
  font-weight: 600;
  background-color: #3178c6;
  padding: 5px;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  &:hover {
    cursor: pointer;
  }
`

const schemaChavePix = z.object({
  favBank: z.string().min(3, 'Um apelido para a conta é obrigatória').max(50, 'O nome da conta deve ter no máximo 50 caracteres'),
  taxID: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato 000.000.000-00')
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido. Use o formato 00.000.000/0000-00'),
  pixKey: z.string().min(3, 'O nome do titular deve ter no mínimo 3 caracteres').optional(),
  account_type: z.string().min(3, 'O nome do titular deve ter no mínimo 3 caracteres'),
  bank_name: z.string().min(3, 'O nome do titular deve ter no mínimo 3 caracteres').optional(),
  bank_code: z.string().min(2, 'O nome do titular deve ter no mínimo 3 caracteres').optional(),
  bank_branch: z.string().min(1,'').optional()
})

function NewFavorite () {
  const [error, setError] = useState({
    message: '',
    borderColor: '#c4c4c7'
  })
  const [inputValue, setInputValue] = useState('')

  const { register, watch, setValue } = useForm<z.infer<typeof schemaChavePix>>({
    resolver: zodResolver(schemaChavePix),
  })

  

  return (
    <Container>
      <Section>
        <AiFillCloseSquare style={{ alignSelf: 'flex-end', fontWeight: '700' }} color='#777' size={24}  cursor='pointer'/>
        <Header>
          <Title>Adicionar nova conta para Cash out</Title>
        </Header>
        <ContentInRow style={{width: 300}}>
          <div>
            <input type="radio" id="html" name="favType" value="1" checked onClick={() => setInputValue('1')} />
            <label htmlFor="html"> Chave PIX </label>
          </div>
          <div>
            <input type="radio" id="css" name="favType" value="2" onClick={() => setInputValue('2')}/>
            <label htmlFor="css"> TED em Conta </label> 
          </div>
        </ContentInRow>

        <FormInput style={{ width: 400 }}>
          <Label>Apelido da Conta</Label>
          <Input
            {...register('favBank')}
            type="text"
            placeholder="Ex: Conta ITAU"
          />
        </FormInput>

        <FormInput style={{ width: 400 }}>
          <Label>CNPJ ou CPF do titular</Label>
          <Input
            {...register('taxID')}
            type="text"
            placeholder="Ex: 1234567890"
          />
        </FormInput>

        {
          inputValue == '1' ?
          <>
          <FormInput style={{ width: 400 }}>
            <Label>Chave Pix</Label>
            <Input
              {...register('pixKey')}
              type="text"
              placeholder="Ex: 1234567890"
            />
          </FormInput>
          </> 
          :
          <>
          <FormInput style={{ width: 400 }}>
            <Label>Apelido da Conta</Label>
            <Input
              {...register('favBank')}
              type="text"
              placeholder="Ex: Conta ITAU"
            />
          </FormInput>

          <FormInput style={{ width: 400 }}>
            <Label>Chave Pix</Label>
            <Input
              {...register('pixKey')}
              type="text"
              placeholder="Ex: 1234567890"
            />
          </FormInput>
          
          <FormInput style={{ width: 400 }}>
            <Label>CNPJ ou CPF do titular</Label>
            <Input
              {...register('taxID')}
              type="text"
              placeholder="Ex: 1234567890"
            />
          </FormInput>
          </> 
        }
        <Footer>
          <p style={{ color: 'red' }}>{error.message}</p>
          <Button >Salvar</Button>
        </Footer>
      </Section>
    </Container>
  )
}

export default NewFavorite;