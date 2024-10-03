/* eslint-disable prettier/prettier */
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema } from '../schema'
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
  Container
} from '../../../styles/global'
import { useAccount } from '@renderer/context/account.context'

export function FormCompany() {
  const { companyData, setCompanyData } = useAccount()
  const { register, watch, setValue } = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: companyData
  })
  watch(register => setCompanyData(register))

  const maskDateInput = (event) => {
    let value = event.target.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2')
    if (value.length > 5) value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    setValue('companyDateCreated', value, { shouldValidate: true }) // Atualiza o valor do input e dispara a validação
  }

  function maskCNPJInput(event) {
    let value = event.target.value.replace(/\D/g, '')
    // Formato 00.000.000/0000-00
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    }
    setValue('companyDocument', value, { shouldValidate: true })
  }

  function maskPhoneInput(event) {
    let value = event.target.value.replace(/\D/g, '')

    if (value.length <= 10) {
      // Formato para telefone fixo (00)0000-0000
      value = value.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3')
    } else {
      // Formato para celular (00)00000-0000
      value = value.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3')
    }
    setValue('companyPhoneNumber', value, { shouldValidate: true })
  }

  return (
    <form>
      <Container style={{height: '80vh', gap: 20, marginTop: 30}}>

        <Card>
          <CardHeader>
            <CardTitle> Dados da Empresa</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Nome Fantasia</Label>
                <Input {...register('companyName')} type="text" placeholder="Digite aqui" />
              </FormInput>

              <FormInput style={{ width: '40%' }}>
                <Label>CNPJ</Label>
                <Input
                  {...register('companyDocument')}
                  type="text"
                  placeholder="Ex: 12.345.678/0001-00"
                  onChange={maskCNPJInput}
                  maxLength={18}
                />
              </FormInput>
            </ContentInRow>

            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Email</Label>
                <Input
                  {...register('companyEmailAddress')}
                  type="text"
                  placeholder="Ex: empresa@mail.com"
                />
              </FormInput>

              <FormInput style={{ width: '30%' }}>
                <Label>Data Fundacao</Label>
                <Input
                  {...register('companyDateCreated')}
                  type="text"
                  placeholder="01/01/2024"
                  onChange={maskDateInput}
                  maxLength={10}
                />
              </FormInput>
            </ContentInRow>

            <FormInput style={{ width: 200, alignSelf: 'flex-start' }}>
              <Label>Telefone</Label>
              <Input
                {...register('companyPhoneNumber')}
                type="text"
                placeholder="(xx) 9999-9999"
                onChange={maskPhoneInput}
                maxLength={15}
              />
            </FormInput>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> Endereco da Empresa</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Logradouro</Label>
                <Input {...register('companyAddress')} type="text" placeholder="Ex: Av. Brasil" />
              </FormInput>
              <FormInput style={{ width: '30%' }}>
                <Label>Numero Endereco</Label>
                <Input {...register('companyAddressNumber')} type="text" placeholder="Ex: 123" />
              </FormInput>
            </ContentInRow>

            <ContentInRow style={{ gap: 25, justifyContent: 'flex-start', width: '100%' }}>
              <FormInput>
                <Label>Complemento</Label>
                <Input
                  {...register('companyAddressComplement')}
                  type="text"
                  placeholder="Ex: Galpao 2"
                />
              </FormInput>

              <FormInput>
                <Label>Bairro</Label>
                <Input
                  {...register('companyNeighborhood')}
                  type="text"
                  placeholder="Ex: Bela Vista"
                />
              </FormInput>
            </ContentInRow>

            <ContentInRow style={{ gap: 10 }}>
              <FormInput>
                <Label>CEP</Label>
                <Input {...register('companyCodezip')} type="text" placeholder="Ex 01234-567" />
              </FormInput>

              <FormInput style={{ width: '10%' }}>
                <Label>UF</Label>
                <Input {...register('companyState')} type="text" placeholder="UF" />
              </FormInput>

              <FormInput>
                <Label>Cidade</Label>
                <Input {...register('companyCity')} type="text" placeholder="Ex: Sao Paulo" />
              </FormInput>
            </ContentInRow>
          </CardContent>
        </Card>
      </Container>
    </form>
  )
}
