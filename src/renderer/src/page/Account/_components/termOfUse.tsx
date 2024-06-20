import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, CheckboxContainer, Container, TermsText, Title } from '../styles';
import { useNavigate } from 'react-router-dom';

export const TermsOfUse = () => {
    const navigate = useNavigate();
 const [accepted, setAccepted] = useState(false);

 const handleCheckboxChange = () => {
  setAccepted(!accepted);
 };

 const handleButtonClick = () => {
  if (accepted) {
   // lógica para iniciar a criação da conta
    navigate('/create-account')
   console.log('Iniciando criação da conta...');
  }
 };

 return (
  <Container>
   <Title>Termos de Uso</Title>
   <TermsText>
    <p>Bem-vindo à nossa aplicação. Leia atentamente os seguintes termos de uso:</p>
    <p>
     Nossa aplicação enviará os dados para a API da Matera para validação junto ao Banco Central. Os dados como CNPJ, telefone, o ID da conta criada pela Matera, a chave Pix, o ID das transações, valores e datas serão armazenados para fins de relatório e comunicação entre a API e o sistema. As imagens solicitadas são validadas pelo FaceMatch para garantir a autenticidade e segurança da conta.
    </p>
    <p>
     Em conformidade com a Lei Geral de Proteção de Dados (LGPD), asseguramos que seus dados pessoais serão tratados com o máximo de cuidado e respeito. Garantimos a proteção e a confidencialidade de suas informações, adotando medidas técnicas e administrativas para evitar acessos não autorizados, perda, alteração ou qualquer tipo de tratamento inadequado dos dados pessoais.
    </p>
    <p>
     Você tem o direito de acessar, corrigir, excluir e restringir o tratamento de seus dados pessoais, bem como o direito à portabilidade dos dados e à revogação do consentimento, conforme previsto pela LGPD. Para exercer esses direitos, entre em contato conosco através dos canais de atendimento disponíveis.
    </p>
    <p>
     Ao continuar, você concorda com a coleta, armazenamento e processamento desses dados conforme descrito acima e em conformidade com a LGPD.
    </p>
   </TermsText>
   <CheckboxContainer>
    <Checkbox
     id="checkbox"
     type="checkbox"
     checked={accepted}
     onChange={handleCheckboxChange}
    />
    <label htmlFor='checkbox'>Eu aceito os Termos de Uso</label>
   </CheckboxContainer>
   <Button disabled={!accepted} onClick={handleButtonClick}>
    Nova Conta
   </Button>
  </Container>
 );
};


