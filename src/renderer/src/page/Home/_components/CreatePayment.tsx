import { AiFillCloseSquare } from 'react-icons/ai';
import styled from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormInput, Input, Label } from '@renderer/styles/global';
import { maskCurrencyInput } from '@shared/utils'
import { useUtils } from '@renderer/context/utils.context';
import { useState } from 'react';

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
  height:auto;
  background-color: #fff;
  border: 1px solid #e7e7e4;
  border-radius: 8px;
  display: flex;
  padding: 5px 40px;
  flex-direction: column;
`
const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
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
// const ErrorMsg = styled.p`
//   font-size: 14px;
//   font-weight: 300;
//   color: red;  
// `

const schemaCreatePaymet = z.object({
  orderID: z.string().optional(),
  totalAmount: z.number()
  .min(1, 'O valor é obrigatório'),
  recipientComment: z.string().optional(),
})

const win: any = window
export function CreatePayment() {
  const { toggleModal } = useUtils()
  const { register, getValues, setValue } = useForm<z.infer<typeof schemaCreatePaymet>>({
    resolver: zodResolver(schemaCreatePaymet)
  })

  function onClose() {
    toggleModal('', false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    let a = await win.api.createPaymentFile(getValues()) 
    console.log(a)
    onClose()
  }

  const handleCurrencyChange = (event) => {
    maskCurrencyInput(event)
    let currency = event.target.value.replace(/\D/g, '') / 100
    setValue('totalAmount', currency, { shouldValidate: true });
  }

  return (
    <form onSubmit={onSubmit}>
      <Container>
        <Section>
          <AiFillCloseSquare style={{ alignSelf: 'flex-end' }} color='#777' size={24} onClick={onClose} cursor='pointer'/>
          <Header>
            <Title>Novo Pagamento</Title>
          </Header>
          <FormInput>
            <Label>Número do Pedido</Label>
            <Input autoFocus type="text" {...register('orderID')} />
          </FormInput>
          <FormInput>
            <Label>Valor Pagamento</Label>
            <Input type="text"
            onChange={handleCurrencyChange}
            placeholder="R$ 0.00"/>
          </FormInput>
          <FormInput>
              <Label>Descrição do Pagamento</Label>
              <Input type="text" {...register('recipientComment')} />
          </FormInput>
          <Footer style={{marginTop: 20}}>
            <Button type="submit">Gerar Pagamento</Button>
          </Footer>
        </Section>
      </Container>
    </form>
  )
}