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
  Button,
  IconEyeInvisible,
  IconEye
} from '../../../styles/global'
import { useNavigate } from 'react-router-dom'
import { useAccount } from '@renderer/context/account.context'
import { Loading } from '@renderer/components/loading'
import { Notification } from '@renderer/components/notification'
import { useNotification } from '@renderer/context/notification.context'

const win: any = window
export function SignIn() {
  const { setAccState } = useAccount()
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const [signInData, setSignInData] = useState<any>()
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [showTextPassword, setShowTextPassword] = useState(false)

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
    setIsLoad(true)
    setValue('taxId', getValues().taxId.replace(/\D/g, ''))
    const acc = await win.api.signIn(getValues())
    setAccState(acc)
    setIsLoad(false)
    if(acc.data) {
      navigate('/home')
    } else {
      if(acc.message === 'login_error') {
        setContentNotification({
          ...contentNotification,
          type: 'error',
          title: 'Erro de Login',
          message: 'Por favor verifique o CNPJ e a Senha e tente novamente.'
        })
      }
      if(acc.message === 'network_error') {
        
      }
      setShowNotification(true)
    }
  }

  function togglePassword() {
    setShowTextPassword(!showTextPassword)
  }

  return (
    <form>
      {isLoad && <Loading />}
        <Card style={{marginTop: '25%'}}>
          <CardHeader>
            <CardTitle> Entra na Conta MBJ PAY </CardTitle>
            <Separator />
          </CardHeader>
          
          <CardContent style={{padding: 30}} >
              <FormInput style={{ width: 300 }}>
                <Label>CNPJ</Label>
                <Input 
                {...register('taxId')} 
                type="text"
                placeholder="Digite o CNPJ"
                onChange={maskCNPJInput}
                />
              </FormInput>

              <FormInput style={{ width: 300}}>
                <Label>Senha</Label>
                <ContentInRow style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Input
                    style={{ width: '100%', boxSizing: 'border-box'}}
                    {...register('password')}
                    placeholder="Digite a Senha"
                    type={showTextPassword ? 'text' : 'password'}

                    
                  />
                  {showTextPassword ? (
                    <IconEyeInvisible
                      size={24}
                      onClick={togglePassword}
                    />
                  ) : (
                    <IconEye
                      size={24}
                      onClick={togglePassword}
                    />
                  )}
                </ContentInRow>
              </FormInput>
          </CardContent>

          <CardFooter style={{marginTop: 10, alignItems: 'center'}}>
            <Button onClick={handleSubmitForm} type='button'>
              Entrar
            </Button>
            <br />
            
            <hr style={{borderTop: '1px dashed #c7c7c4', width: '100%'}}/>
            <p style={{color:'#c4c4c7'}}>ou</p>
            
            <Button style={{marginTop: 0}} onClick={() => navigate('/account/terms')} >
              Criar Conta
            </Button>
          </CardFooter>
        </Card>
      <Notification />
    </form>
  )
}
