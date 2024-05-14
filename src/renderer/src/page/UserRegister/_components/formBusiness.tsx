import React from 'react';

import { Button, Card, CardContent, CardHeader, CardTitle, ContentInRow, FormInput, Input, Label, Separator } from '../styles';

export function FormBusiness() {

    return (
        <form action="" >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 30 }}>

                <Card>
                    <CardHeader>
                        <CardTitle> Dados da Empresa</CardTitle>
                        <Separator/>
                    </CardHeader>
                    <CardContent>
                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label htmlFor="nomeFant">Nome Fantasia</Label>
                                <Input name="nomeFant" type='text' placeholder="Ex: Empresa LTDA" />
                            </FormInput>

                            <FormInput style={{width: '40%'}}>
                                <Label htmlFor="cnpj">CNPJ</Label>
                                <Input name="cnpj" type='text' placeholder="Ex: 12.345.678/0001-00" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput style={{width: 400}}>
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" type='text' placeholder="Ex: empresa@mail.com" />
                            </FormInput>

                            <FormInput style={{width: '30%'}}>
                                <Label htmlFor="dtFund">Data Fundacao</Label>
                                <Input name="dtFund" type='text' placeholder="01/01/2024" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput style={{width: 200}}>
                                <Label htmlFor="tel1">Telefone</Label>
                                <Input name="tel1" type='text' placeholder="(xx) 9999-9999" />
                            </FormInput>

                            <FormInput style={{width: 200}}>
                                <Label htmlFor="tel2">Telefone 2</Label>
                                <Input name="tel2" type='text' placeholder="(xx) 99999-9999" />
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
                                <Label htmlFor="logradouro">Logradouro</Label>
                                <Input name="logradouro" type='text' placeholder="Ex: Av. Brasil" />
                            </FormInput>
                            <FormInput style={{width: '30%'}}>
                                <Label htmlFor="nroEnd">Numero Endereco</Label>
                                <Input name="nroEnd" type='text' placeholder="Ex: 123" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 25, justifyContent: 'flex-start', width: '100%'}}>
                            <FormInput>
                                <Label htmlFor="tel">Complemento</Label>
                                <Input name="tel" type='text' placeholder="Ex: Galpao 2" />
                            </FormInput>

                            <FormInput>
                                <Label htmlFor="tel">Bairro</Label>
                                <Input name="tel" type='text' placeholder="Ex: Bela Vista" />
                            </FormInput>
                        </ContentInRow>

                        <ContentInRow style={{gap: 10}}>
                            <FormInput>
                                <Label htmlFor="tel">CEP</Label>
                                <Input name="tel" type='text' placeholder="Ex 01234-567" />
                            </FormInput>

                            <FormInput style={{width: '10%'}}>
                                <Label htmlFor="tel2">UF</Label>
                                <Input name="tel2" type='text' placeholder="UF" />
                            </FormInput>

                            <FormInput>
                                <Label htmlFor="tel2">Cidade</Label>
                                <Input name="tel2" type='text' placeholder="Ex: Sao Paulo"/>
                            </FormInput>
                        </ContentInRow>
                    </CardContent>
                </Card> 
            </div>
        </form>
    )
}