import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import styled from 'styled-components';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ContentInRow, FormInput, Input, Label } from '@renderer/styles/global';
import { useSecurity } from '@renderer/context/security.context';
import { Loading } from '@renderer/components/loading';
import { useNotification } from '@renderer/context/notification.context';
import { useAccount } from '@renderer/context/account.context';
import Select from 'react-select';
import { delay } from '@shared/utils';

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
const ErrorMsg = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: red;  
`

const schemaFavoriteRecipient = z.object({
  id: z.string().optional().or(z.literal('')),
  type: z.string(),
  nickname: z.string()
    .min(3, 'Um apelido para a conta é obrigatório')
    .max(50, 'O nome da conta deve ter no máximo 50 caracteres'),
  taxId: z.string().refine((value) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfRegex.test(value);
    }
    if (digitsOnly.length === 14) {
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      return cnpjRegex.test(value);
    }
    return false;
  }, {
    message: 'CPF ou CNPJ inválido.'
  }),
  pixKey: z.string().optional().or(z.literal('')),
  bankAgency: z.string().optional().or(z.literal('')),
  bankAccount: z.string().optional().or(z.literal('')),
  bankBranch: z.string().optional().or(z.literal('')),
  bankCode: z.string().optional().or(z.literal('')),
  accountId: z.string().optional().or(z.literal(''))
})

const win: any = window
function NewFavorite (props: {id: string,}) {
  const { setSecurity } = useSecurity()
  const { accData } = useAccount()
  const { setContentNotification, setShowNotification } = useNotification()
  const [inputValue, setInputValue] = useState('1')
  const [isLoad, setIsLoad] = useState(false)
  const [pspList, setPspList] = useState<any>([])
  const [selectedOption, setSelectedOption] = useState(null);

  const [error, setError] = useState({
    message: '',
    borderColor: '#c4c4c7'
  })

  const { register, watch, setValue, getValues, handleSubmit, formState: {errors} } = useForm<z.infer<typeof schemaFavoriteRecipient>>({
    resolver: zodResolver(schemaFavoriteRecipient),

  })

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '400px',
      marginBottom: '10px',
    }),
  };

  watch(register => {
    if(register.pixKey && register.pixKey.length >= 11 ) {
      setError({
        message: '',
        borderColor:''
      })
    }

    if( (register.bankAccount && register.bankAccount.length >= 3) &&
      (register.bankAgency && register.bankAgency.length >= 2) &&
      (register.bankBranch && register.bankBranch.length >= 1) &&
      (register.bankCode && register.bankCode.length >= 1)) {
      setError({
        message: '',
        borderColor:''
      })
    }
  })

  function onClose() {
    setSecurity({
      confirmed: false,
      context: ''
    })
  }

  function maskCPForCNPJInput(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
    }
    else if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setValue('taxId', value, { shouldValidate: true });
  }

  const handleChange = (selected) => {
    if(selected !== null) {
      setValue('bankCode', selected.value, {shouldValidate: true})
    } else {
      setValue('bankCode', '', {shouldValidate: true})
    }
    setSelectedOption(selected);
  };

  async function onSubmit() {   
    if(inputValue == '1' && String(getValues().pixKey).length < 11) {
      setError({
        message: 'Chave Pix é obrigatório para salvar.',
        borderColor: 'red'
      }) 
      return
    }
    if(inputValue === '2' && (String(getValues().bankAccount).length < 3 || String(getValues().bankAgency).length < 2 ||
    String(getValues().bankBranch).length < 1 || String(getValues().bankCode).length < 1 || !selectedOption) ) {
      setError({
        message: 'Todos os campos são obrigatórios para salvar.',
        borderColor: 'red'
      }) 
      return
    }
    if(inputValue === '1') {
      setValue('bankAccount', '', {shouldValidate: true})
      setValue('bankAgency', '', {shouldValidate: true})
      setValue('bankBranch', '', {shouldValidate: true})
      setValue('bankCode', '', {shouldValidate: true})
    } else {
      setValue('pixKey', '', {shouldValidate: true})
    }
    setValue('accountId', accData?.accountId, {shouldValidate: true})
    setIsLoad(true)
    if(getValues().id) {
      await win.api.updateFavoriteRecipient(getValues())
      setContentNotification({
        title: 'Sucesso',
        message: 'Conta favorita atualizada com sucesso.',
        type:'success'
      })
    } else {
      await win.api.createFavoriteRecipient(getValues())
      setContentNotification({
        title: 'Sucesso',
        message: 'Conta favorita criada com sucesso.',
        type:'success'
      })
    }
    setIsLoad(false)
    setShowNotification(true)
    onClose()
  }

  async function loadFavInfo() {
    let dat = await loadPspList()
    setPspList(dat)
    setIsLoad(true)
    if(props.id) {
      let data = await win.api.getFavoriteRecipientOnId(props.id)
      setInputValue(data.type)
      setValue('id', data.id, {shouldValidate: true})
      setValue('type', data.type, {shouldValidate: true})
      setValue('taxId', data.taxId, {shouldValidate: true})
      setValue('nickname', data.nickname, {shouldValidate: true})
      setValue('pixKey', data.pixKey || '', {shouldValidate: true})
      setValue('bankAccount', data.bankAccount || '', {shouldValidate: true})
      setValue('bankAgency', data.bankAgency || '', {shouldValidate: true})
      setValue('bankBranch', data.bankBranch || '', {shouldValidate: true})
      setValue('bankCode', data.bankCode || '', {shouldValidate: true})
      await delay(2000)
      const preselectedItem = dat.find((item) => item?.value === data.bankCode);
      console.log(preselectedItem)
      setSelectedOption(preselectedItem); // Define o item pré-selecionado
    }
    setIsLoad(false)
  }
  
  async function loadPspList() {
    setIsLoad(true)
    let data = await win.api.getAllPsps()
    const formattedOptions = data.map((item) => ({
      value: item.id,
      label: item.name,
    }))
    
    setIsLoad(false)
    return formattedOptions
  }

  useEffect(() => {
    (async() => {
      await loadFavInfo()
    })()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        {isLoad && <Loading />}
        <Section>
          <AiFillCloseSquare style={{ alignSelf: 'flex-end' }} color='#777' size={24} onClick={onClose} cursor='pointer'/>
          <Header>
            <Title>Adicionar nova conta para Cash out</Title>
          </Header>
          <ContentInRow style={{width: 300, alignSelf: 'center'}}>
            <div>
              <input type="radio" id="html" value="1"  {...register('type')} name='type' onChange={(e) => setInputValue(e.target.value)} />
              <label htmlFor="html"> Chave PIX </label>
            </div>
            <div>
              <input type="radio" id="css" value="2" {...register('type')}  name='type' onChange={(e) => setInputValue(e.target.value)} />
              <label htmlFor="css"> TED em Conta </label> 
            </div>
          </ContentInRow>

          <FormInput style={{ width: 400 }}>
            <Label>Apelido da Conta</Label>
            <Input
              {...register('nickname')}
              type="text"
              placeholder="Ex: Conta ITAU"
              autoFocus
            />
            {errors.nickname?.message && (
            <ErrorMsg>{errors.nickname?.message}</ErrorMsg>
            )}
          </FormInput>

          <FormInput style={{ width: 400 }}>
            <Label>CPF ou CNPJ do titular</Label>
            <Input
              {...register('taxId')}
              type="text"
              placeholder="Ex: 1234567890"
              onChange={maskCPForCNPJInput}
              maxLength={18}
            />
            {errors.taxId?.message && (
            <ErrorMsg >{errors.taxId?.message}</ErrorMsg>
            )}
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
              <ErrorMsg >{error.message}</ErrorMsg>
            </FormInput>
            </> 
            :
            <>
            <Label style={{marginTop: 20}}>Escolha o Banco</Label>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={pspList}
              placeholder="Pesquisar..."
              isClearable
              isSearchable
              styles={customStyles}
            />
            <ContentInRow style={{justifyContent: 'flex-start', gap: 15}}>

              <FormInput style={{ width: 180 }}>
                <Label>Conta</Label>
                <Input
                  {...register('bankAccount')}
                  type="text"
                  placeholder="Ex: Conta ITAU"
                />
              </FormInput>

              <FormInput style={{ width: 120 }}>
                <Label>Digito</Label>
                <Input
                  {...register('bankBranch')}
                  type="text"
                  placeholder="Ex: 1234567890"
                />
              </FormInput>
            </ContentInRow>
            <FormInput style={{ width: 180, alignSelf: 'flex-start' }}>
              <Label>Agência</Label>
              <Input
                {...register('bankAgency')}
                type="text"
                placeholder="Ex: 1234567890"
              />
            </FormInput>
            <ErrorMsg >{error.message}</ErrorMsg>
            </> 
          }
          <Footer >
            <Button type='submit' >Salvar</Button>
          </Footer>
        </Section>
      </Container>
    </form>
  )
}

export default NewFavorite;