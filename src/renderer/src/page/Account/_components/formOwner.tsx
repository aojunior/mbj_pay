/* eslint-disable prettier/prettier */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ownerSchema } from '../schema'
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



export function FormOwner() {
  const { ownerData, setOwnerData } = useAccount()

  const { register, watch, setValue } = useForm<z.infer<typeof ownerSchema>>({
    resolver: zodResolver(ownerSchema),
    defaultValues: ownerData
  })

  watch(a => setOwnerData(a) )

  const maskDateInput = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2')
    if (value.length > 5) value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    setValue('ownerBirthday', value, { shouldValidate: true })
  }

  function maskCPFInput(event) {
    let value = event.target.value.replace(/\D/g, '')
    // Formato 000.000.000-00
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2')
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/(\d{3})(\d{2})$/, '$1-$2')
    }

    setValue('ownerDocument', value, { shouldValidate: true })
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

    setValue('ownerPhoneNumber', value, { shouldValidate: true })
  }

  return (
    <form>
      <Container style={{height: '80vh', gap: 20, marginTop: 30}}>
        <Card>
          <CardHeader>
            <CardTitle> Dados do Representante</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Nome Completo</Label>
                <Input {...register('ownerName')} type="text" placeholder="Digite aqui" />
              </FormInput>

              <FormInput style={{ width: '40%' }}>
                <Label>CPF</Label>
                <Input
                  {...register('ownerDocument')}
                  type="text"
                  placeholder="Ex: 123.456.789-00"
                  onChange={maskCPFInput}
                  maxLength={14}
                />
              </FormInput>
            </ContentInRow>

            <FormInput style={{ width: 400, alignSelf: 'flex-start' }}>
              <Label>Nome da Mae</Label>
              <Input {...register('ownerMotherName')} type="text" placeholder="Digite aqui" />
            </FormInput>

            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Email</Label>
                <Input
                  {...register('ownerEmailAddress')}
                  type="text"
                  placeholder="Ex: email@mail.com"
                />
              </FormInput>

              <FormInput style={{ width: '30%' }}>
                <Label>Data de Nascimento</Label>
                <Input
                  {...register('ownerBirthday')}
                  type="text"
                  placeholder="Ex: 01/01/2024"
                  onChange={maskDateInput}
                  maxLength={10}
                />
              </FormInput>
            </ContentInRow>

            <FormInput style={{ width: 200, alignSelf: 'flex-start' }}>
              <Label>Telefone</Label>
              <Input
                {...register('ownerPhoneNumber')}
                type="text"
                placeholder="(xx) 9999-9999"
                onChange={maskPhoneInput}
                maxLength={14}
              />
            </FormInput>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> Endereco da Residencia</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ContentInRow style={{ gap: 10 }}>
              <FormInput style={{ width: 400 }}>
                <Label>Logradouro</Label>
                <Input {...register('ownerAddress')} type="text" placeholder="Ex: Av. Brasil" />
              </FormInput>
              <FormInput style={{ width: '30%' }}>
                <Label>Numero Endereco</Label>
                <Input {...register('ownerAddressNumber')} type="text" placeholder="Ex: 123" />
              </FormInput>
            </ContentInRow>

            <ContentInRow style={{ gap: 25, justifyContent: 'flex-start', width: '100%' }}>
              <FormInput>
                <Label>Complemento</Label>
                <Input
                  {...register('ownerAddressComplement')}
                  type="text"
                  placeholder="Ex: Galpao 2"
                />
              </FormInput>

              <FormInput>
                <Label>Bairro</Label>
                <Input
                  {...register('ownerNeighborhood')}
                  type="text"
                  placeholder="Ex: Bela Vista"
                />
              </FormInput>
            </ContentInRow>

            <ContentInRow style={{ gap: 10 }}>
              <FormInput>
                <Label>CEP</Label>
                <Input {...register('ownerCodezip')} type="text" placeholder="Ex 01234-567" />
              </FormInput>

              <FormInput style={{ width: '10%' }}>
                <Label>UF</Label>
                <Input {...register('ownerState')} type="text" placeholder="UF" />
              </FormInput>

              <FormInput>
                <Label>Cidade</Label>
                <Input {...register('ownerCity')} type="text" placeholder="Ex: Sao Paulo" />
              </FormInput>
            </ContentInRow>
          </CardContent>
        </Card>
      </Container>
    </form>
  )
}
