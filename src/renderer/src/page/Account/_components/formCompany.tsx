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

  const maskCNPJInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')

    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    }
    setValue('companyDocument', value, { shouldValidate: true })
  }
  const maskDateInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2')
    if (value.length > 5) value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    setValue('companyDateCreated', value, { shouldValidate: true })
  }
  const maskPhoneInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3')
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3')
    }
    setValue('companyPhoneNumber', value, { shouldValidate: true })
  }
  const maskZipCodeInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length <= 8) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2')
    }
    setValue('companyZipCode', value, { shouldValidate: true })
  }

  return (
    <form>
      <Container style={{height: '80vh', gap: 20, marginTop: 30, overflowY: 'scroll'}}>
        <Card>
          <CardHeader>
            <CardTitle> Dados da Empresa</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Razão Social</Label>
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
            <FormInput style={{ width: 400, alignSelf: 'flex-start' }}>
              <Label>Nome Fantasia</Label>
              <Input {...register('companyFantasyName')} type="text" placeholder="Digite aqui" />
            </FormInput>

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
              <Label>Tel. Celular</Label>
              <Input
                {...register('companyPhoneNumber')}
                type="text"
                placeholder="(xx) 99999-9999"
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
                <Input
                {...register('companyZipCode')}
                type="text"
                placeholder="Ex 01234-567"
                maxLength={9}
                onChange={maskZipCodeInput}
                />
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
