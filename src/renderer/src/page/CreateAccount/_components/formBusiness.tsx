/* eslint-disable prettier/prettier */
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"

import { companySchema } from '../schema';
import { companyData } from '../action';
import { Card, CardHeader, FormInput, Label, CardTitle, Separator, CardContent, ContentInRow, Input, Button } from '../../../styles/global';

export function FormBusiness() {
    const {register, handleSubmit} = useForm <z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
    })    
    

    const onSubmit = handleSubmit((data) => {
        companyData(data)
    })

    return (
        <form onSubmit={onSubmit} >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 30 }}>

                <Card>
                    <CardHeader>
                        <CardTitle> Dados da Empresa</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label>Nome Fantasia</Label>
                                <Input {...register("companyName")} type='text' placeholder="Digite aqui"  />
                            </FormInput>

                            <FormInput style={{width: '40%'}}>
                                <Label>CNPJ</Label>
                                <Input {...register("companyDocument")} type='text' placeholder="Ex: 12.345.678/0001-00" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label>Email</Label>
                                <Input {...register("companyEmailAddress")} type='text' placeholder="Ex: empresa@mail.com" />
                            </FormInput>

                            <FormInput style={{width: '30%'}}>
                                <Label>Data Fundacao</Label>
                                <Input {...register("companyDateCreated")} type='text' placeholder="01/01/2024" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput style={{width: 200}}>
                                <Label>Telefone</Label>
                                <Input {...register("companyPhoneNumber")} type='text' placeholder="(xx) 9999-9999" />
                            </FormInput>

                            <FormInput style={{width: 200}}>
                                <Label>Telefone 2</Label>
                                <Input {...register("companyPhoneNumber2")} type='text' placeholder="(xx) 99999-9999" />
                            </FormInput>
                        </ContentInRow>
                    </CardContent>
                </Card> 

                <Card>
                    <CardHeader>
                        <CardTitle> Endereco da Empresa</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label>Logradouro</Label>
                                <Input {...register("companyAddress")} type='text' placeholder="Ex: Av. Brasil" />
                            </FormInput>
                            <FormInput style={{width: '30%'}}>
                                <Label>Numero Endereco</Label>
                                <Input {...register("companyAddressNumber")} type='text' placeholder="Ex: 123" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput>
                                <Label>Complemento</Label>
                                <Input  {...register("companyAddressComplement")} type='text' placeholder="Ex: Galpao 2" />
                            </FormInput>

                            <FormInput>
                                <Label>Bairro</Label>
                                <Input  {...register("companyNeighborhood")} type='text' placeholder="Ex: Bela Vista" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput>
                                <Label>CEP</Label>
                                <Input  {...register("companyCodezip")} type='text' placeholder="Ex 01234-567" />
                            </FormInput>

                            <FormInput style={{width: '10%'}}>
                                <Label>UF</Label>
                                <Input  {...register("companyState")} type='text' placeholder="UF" />
                            </FormInput>

                            <FormInput>
                                <Label>Cidade</Label>
                                <Input  {...register("companyCity")} type='text' placeholder="Ex: Sao Paulo"/>
                            </FormInput>
                        </ContentInRow>
                    </CardContent>
                </Card> 

                <Button type='submit'> Salvar </Button>
            </div>
        </form>
    )
}