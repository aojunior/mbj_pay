/* eslint-disable prettier/prettier */
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ownerData } from '../action';
import { ownerSchema } from '../schema';
import { Card, CardHeader, FormInput, Label, CardTitle, Separator, CardContent, ContentInRow, Input, Button } from '../../../styles/global';

export function FormClient() {
    const {register, handleSubmit} = useForm <z.infer<typeof ownerSchema>>({
        resolver: zodResolver(ownerSchema),
    })    
    
    const onSubmit = handleSubmit((data) => {
        ownerData(data)
    })
    return (
        <form onSubmit={onSubmit} >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 30 }}>

                <Card>
                    <CardHeader>
                        <CardTitle> Dados do Representante</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label >Nome Completo</Label>
                                <Input {...register("ownerName")} type='text' placeholder="Digite aqui" />
                            </FormInput>

                            <FormInput style={{width: '40%'}}>
                                <Label>CPF</Label>
                                <Input {...register("ownerDocument")} type='text' placeholder="Ex: 123.456.789-00" />
                            </FormInput>
                        </ContentInRow>

                        <FormInput style={{width: 400, alignSelf: 'flex-start'}}>
                            <Label>Nome da Mae</Label>
                            <Input {...register("ownerMotherName")} type='text' placeholder="Digite aqui" />
                        </FormInput>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label>Email</Label>
                                <Input {...register("ownerEmailAddress")} type='text' placeholder="Ex: email@mail.com" />
                            </FormInput>

                            <FormInput style={{width: '30%'}}>
                                <Label>Data de Nascimento</Label>
                                <Input {...register("ownerBirthday")} type='text' placeholder="Ex: 01/01/2024" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput style={{width: 200}}>
                                <Label>Telefone</Label>
                                <Input {...register("ownerPhoneNumber")} type='text' placeholder="(xx) 9999-9999" />
                            </FormInput>

                            <FormInput style={{width: 200}}>
                                <Label>Telefone 2</Label>
                                <Input {...register("ownerPhoneNumber2")} type='text' placeholder="(xx) 99999-9999" />
                            </FormInput>
                        </ContentInRow>
                        
                    </CardContent>
                </Card> 

                <Card>
                    <CardHeader>
                        <CardTitle> Endereco da Residencia</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label>Logradouro</Label>
                                <Input {...register("ownerAddress")} type='text' placeholder="Ex: Av. Brasil" />
                            </FormInput>
                            <FormInput style={{width: '30%'}}>
                                <Label>Numero Endereco</Label>
                                <Input {...register("ownerAddressNumber")} type='text' placeholder="Ex: 123" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput>
                                <Label>Complemento</Label>
                                <Input {...register("ownerAddressComplement")} type='text' placeholder="Ex: Galpao 2" />
                            </FormInput>

                            <FormInput>
                                <Label>Bairro</Label>
                                <Input {...register("ownerNeighborhood")} type='text' placeholder="Ex: Bela Vista" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput>
                                <Label>CEP</Label>
                                <Input {...register("ownerCodeZip")} type='text' placeholder="Ex 01234-567" />
                            </FormInput>

                            <FormInput style={{width: '10%'}}>
                                <Label>UF</Label>
                                <Input {...register("ownerState")} type='text' placeholder="UF" />
                            </FormInput>

                            <FormInput>
                                <Label>Cidade</Label>
                                <Input {...register("ownerCity")} type='text' placeholder="Ex: Sao Paulo"/>
                            </FormInput>
                        </ContentInRow>
                    </CardContent>
                </Card> 


                <Button type="submit"> Salvar </Button>
            </div>
        </form>
    )
}