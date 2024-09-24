/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signInSchema } from '../schema'
import {
  Card,
  CardHeader,
  FormInput,
  Label,
  CardTitle,
  Separator,
  CardContent,
  ContentInRow,
  Input,
  CardFooter,
  Button
} from '../../../styles/global'
import { useNavigate } from 'react-router-dom'

const win: any = window
export function SignIn() {
  const [signInData, setSignInData] = useState<any>()

  const { register, watch, setValue, getValues } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: signInData
  })
  const navigate = useNavigate()

  watch((a) => {
    setSignInData(a)
  })
  
  function maskCNPJInput(event) {
    let value = event.target.value.replace(/\D/g, '')
    // Formato 00.000.000/0000-00
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    }
    setValue('taxId', value, { shouldValidate: true })
  }

  async function handleSubmitForm() {
    // console.log(getValues())
    setValue('taxId', getValues().taxId.replace(/\D/g, ''))
    const da = await win.api.signIn(getValues())
    console.log(da)
  }

  return (
    <form>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          marginTop: 30
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle> Fazer o Login</CardTitle>
            <Separator />
          </CardHeader>
          
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>CNPJ</Label>
                <Input 
                {...register('taxId')} 
                type="text"
                placeholder="Ex: 12.345.678/0009-00"
                onChange={maskCNPJInput}
                />
              </FormInput>

              <FormInput style={{ width: '40%' }}>
                <Label>Senha da Aplicação</Label>
                <Input
                  {...register('password')}
                  type="text"
                />
              </FormInput>
            </ContentInRow>
          </CardContent>

          <CardFooter>
            <Button onClick={handleSubmitForm} type='button'>
                Entrar
            </Button>
            <p>OU</p>
            <Button onClick={() => navigate('/terms')} >
                Novo Cadastro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
