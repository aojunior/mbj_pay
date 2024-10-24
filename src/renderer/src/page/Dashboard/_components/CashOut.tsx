/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import {
  Button,
  TextArea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContentInRow,
  FormInput,
  Input,
  Label,
  Separator,
  IconEyeInvisible,
  IconEye,
  Text,
  Blur
} from '../../../styles/global'
import Select from 'react-select';
import { maskCurrencyInput } from '@shared/utils'
import { useSecurity } from '@renderer/context/security.context'
import { useNotification } from '@renderer/context/notification.context'
import { useLoading } from '@renderer/context/loading.context';


type BalanceProps = {
  balance: any,
  getBalance: () => void,
}
const customStyles = {
  container: (provided) => ({
    ...provided,
  }),
};

const win: any = window
export function CashOut({ balance, getBalance }: BalanceProps) {
  const { contentNotification, setContentNotification, setShowNotification } = useNotification()
  const { security, setSecurity, callSecurityButton } = useSecurity()
  const { setIsLoading } = useLoading()
  const [amount, setAmount] = useState<Number>(0)
  const [msgInfo, setMsgInfo] = useState<String>('')
  const [favorites, setFavorites] = useState<any>([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [showValueBalance, setShowValueBalance] = useState (false);
  const [deviceRegistered, setDeviceRegistered] = useState(false)

  const handleCurrencyChange = (event) => {
    maskCurrencyInput(event)
    setAmount(event.target.value.replace(/\D/g, '') / 100)
  }

  async function handleFavoritesRecipients() {
    let data = await win.api.getFavoriteRecipients()
    const formattedOptions = data.map((item) => ({
      value: item.pixKey,
      label: item.nickname,
    }))
    setFavorites(formattedOptions)
  }
  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  async function handleTransactionToOwnAccount() {
    if(!selectedOption) {
      setContentNotification({
        type: 'error',
        title: 'Houve um Error',
        message: 'Selecione um destinatário'
      })
      setShowNotification(true)
      return
    }
    if (handleAvalibleTransaction()) {
      setIsLoading(true)
      let verifyDestination = await win.api.verifyDestination(selectedOption)
      if(verifyDestination.message === 'success') {
        let formatData = {
          totalAmount: amount,
          msg: msgInfo,
          ...verifyDestination?.data
        }
        let cashOut = await win.api.cashOut(formatData)
        setSelectedOption(null)
        setMsgInfo('')
        if(cashOut.message == 'success') {
          setContentNotification({
            ...contentNotification,
            type: 'success',
            title: 'Transferência Realizada com Sucesso',
            message: 'Sua transferência foi realizada'
          })
          let e = {
            target: {
              value: ''
            }
          }
          handleCurrencyChange(e)
          await getBalance()
        } else {
          setContentNotification({
            ...contentNotification,
            type: 'success',
            title: 'Houve um Erro',
            message: cashOut.message
          })
        }
        setShowNotification(true)
        
      } else {
        setContentNotification({
          ...contentNotification,
          type: 'error',
          title: 'Houve um Error',
          message: verifyDestination.message
        })
        setShowNotification(true)
      }
      setSecurity({
        context: '',
        confirmed: false
      })
      setIsLoading(false)
    }
  }

  function handleAvalibleTransaction() {
    if (balance?.available) {
      if (Number(balance?.available) < Number(amount)) {
        setContentNotification({
          ...contentNotification,
          type: 'warning',
          title: 'Não foi Possível Prosseguir',
          message: 'Saldo Insuficiente para Transferêcia!'
        })
        setShowNotification(true)
        return false
      } else {
        return true
      }
    } else {
      setContentNotification({
        ...contentNotification,
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Houve um erro na transferência, tente novamente!'
      })
      setShowNotification(true)
      return false
    }
  }

  function showBalance() {
    return balance?.available
      ? `${Number(balance?.available).toFixed(2) || 0}`
      : '-'
  }

  function toggleBalance() {
    setShowValueBalance(!showValueBalance)
  }

  async function onLoad() {
    const infos = await win.api.getRegisterDevice()
    if(infos.result.find(d => d.deviceId === infos.device.deviceId)) {
      setDeviceRegistered(true)
    } else {
      setDeviceRegistered(false)
    }       
  }

  useEffect(() => {
    handleFavoritesRecipients()
    onLoad()
    setSecurity({
      context: '',
      confirmed: false
    })
  }, [])

  useEffect(() => {
    if (security.confirmed && security.context === 'cashout') {
      handleTransactionToOwnAccount()
    }
  }, [security.confirmed])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 15 }}>
      <Card style={{ width: '100%', height: 430 }}>
        <CardHeader>
          <CardTitle> Transferência via PIX </CardTitle>
          <Separator />
        </CardHeader>

        <CardContent style={{gap: 10}}>
          <FormInput>
            <Label>Selecione a Conta:</Label>
            <Select
            value={selectedOption}
            onChange={handleChange}
            options={favorites}
            placeholder="Escolha uma conta"
            isClearable
            isSearchable
            isDisabled={!deviceRegistered}
            styles={customStyles}
            />
          </FormInput>

          <FormInput>
            <Label>Informe o Valor:</Label>
            <Input
              style={{ textAlign: 'end', paddingRight: 20, fontSize: 20 }}
              onChange={handleCurrencyChange}
              placeholder="R$ 0.00"
              readOnly={!deviceRegistered}
            />
          </FormInput>

          <FormInput>
            <Label>Informações do pagamento (opcional)</Label>
            <TextArea onChange={e => setMsgInfo(e.target.value)} readOnly={!deviceRegistered}/>
          </FormInput>

          {
            deviceRegistered &&
            <Button 
              disabled={(!selectedOption || amount == 0)} 
              style={{background: (!selectedOption || amount == 0) && '#c4c4c7'}} 
              onClick={() => callSecurityButton('cashout')}
            >
              Confirmar 
            </Button>
          }
        </CardContent>
      </Card>

      <Card style={{ width: '100%' }}>
        <FormInput style={{ width: '100%' }}>
          <Label>Saldo Disponível </Label>
          <ContentInRow style={{ justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ width: '100%', textAlign: 'end', fontWeight: '900', paddingRight: 40 }}>
              R$
              {showBalance()}
            </Text>

            {showValueBalance ? (
              <IconEyeInvisible
                size={24}
                style={{position: 'relative', right: 30}}
                onClick={toggleBalance}
              />
              ) : (
              <IconEye
                size={24}
                style={{position: 'relative', right: 30}}
                onClick={toggleBalance}
              />
            )}
            {!showValueBalance &&
              <Blur style={{  width: 325 }}/>
            }
          </ContentInRow>
        </FormInput>
      </Card>
    </div>
  )
}
