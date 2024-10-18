import { AiFillCloseSquare } from 'react-icons/ai';
import styled from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, FormInput, Input, Label, TextArea } from '@renderer/styles/global';
import { maskCurrencyInput } from '@shared/utils'
import { useUtils } from '@renderer/context/utils.context';

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
const ErrorMsg = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: red;  
`

const schemaCreatePaymet = z.object({
  orderID: z.string().min(1, 'Necessário o identificador do pedido'),
  totalAmount: z.number(),
  recipientComment: z.string().optional(),
})

const win: any = window
export function CreatePayment() {
  const { toggleModal } = useUtils()
  const { register, getValues, setValue, handleSubmit,  formState: {errors} } = useForm<z.infer<typeof schemaCreatePaymet>>({
    resolver: zodResolver(schemaCreatePaymet)
  })

  function onClose() {
    toggleModal('', false)
  }

  async function onSubmit() {

    if(!errors.orderID?.message && !errors.totalAmount?.message) {
      await win.api.createPaymentFile(getValues())
      onClose()
    }
  }

  const handleCurrencyChange = (event) => {
    maskCurrencyInput(event)
    let currency = event.target.value.replace(/\D/g, '') / 100
    setValue('totalAmount', currency, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Section>
          <AiFillCloseSquare style={{ alignSelf: 'flex-end' }} color='#777' size={24} onClick={onClose} cursor='pointer'/>
          <Header>
            <Title>Novo Pagamento</Title>
          </Header>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormInput>
              <Label>Número do Pedido</Label>
              <Input autoFocus type="text" {...register('orderID')}  
              style={{ textAlign: 'end', paddingRight: 20, fontSize: 20 }}/>
              {errors.orderID?.message && (
              <ErrorMsg>{errors.orderID?.message}</ErrorMsg>
              )}
            </FormInput>
            <FormInput>
              <Label>Valor Pagamento</Label>
              <Input style={{ textAlign: 'end', paddingRight: 20, fontSize: 20 }}
                onChange={handleCurrencyChange}
                placeholder="R$ 0.00"
              />
              {errors.totalAmount?.message && (
              <ErrorMsg>{errors.totalAmount?.message}</ErrorMsg>
              )}
            </FormInput>
            <FormInput>
              <Label>Descrição do Pagamento</Label>
              <TextArea {...register('recipientComment')} />
            </FormInput>
          </div>
          <Footer style={{marginTop: 10}}>
            <Button type="submit" style={{width: 'auto'}}>Gerar Pagamento</Button>
          </Footer>
        </Section>
      </Container>
    </form>
  )
}