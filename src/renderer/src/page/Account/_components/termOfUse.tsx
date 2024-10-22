import { useState } from 'react'
import { Button, Checkbox, CheckboxContainer, Container, TermsText, Title } from '../styles'
import { useNavigate } from 'react-router-dom'

const win: any = window
export const TermsOfUse = () => {
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)

  const toggleAcceptTerms = () => {
    setAccepted(!accepted)
  }

  const handleButtonClick = async () => {
    if (accepted) {
      try {
        const data = await win.api.acceptTermsOfService()
        sessionStorage.setItem('informations', JSON.stringify(data))
        navigate('/account/company')
      } catch (error) {
        await win.api.logger('error', error)
      }
    } 
  }

  return (
    <Container style={{ backgroundColor: '#0'}}>
      <Title>Termos de Uso</Title>
      <TermsText >
        <p>Bem-vindo à nossa aplicação. Leia atentamente os seguintes termos de uso:</p>
        <p>
        Nossa aplicação enviará os dados para a API da Matera para validação junto ao Banco Central. 
        Os dados coletados incluem CNPJ, telefone, ID da conta criada pela Matera, chave Pix, ID das 
        transações, valores, datas, localização, IP, ID do dispositivo, e data e hora. Esses dados serão 
        armazenados para fins de relatório e comunicação entre a API e o sistema. As imagens solicitadas 
        serão validadas pelo FaceMatch para garantir a autenticidade e segurança da conta.
        </p>
        <p>
        Em conformidade com a Lei Geral de Proteção de Dados (LGPD), asseguramos que seus dados pessoais 
        serão tratados com o máximo de cuidado e respeito. Garantimos a proteção e a confidencialidade de 
        suas informações, adotando medidas técnicas e administrativas para evitar acessos não autorizados, 
        perda, alteração ou qualquer tipo de tratamento inadequado dos dados pessoais.
        </p>
        <p>
        Você tem o direito de acessar, corrigir, excluir e restringir o tratamento de seus dados pessoais, 
        bem como o direito à portabilidade dos dados e à revogação do consentimento, conforme previsto pela LGPD. 
        Para exercer esses direitos, entre em contato conosco através dos canais de atendimento disponíveis.
        </p>
        <p>
        Ao continuar, você concorda com a coleta, armazenamento e processamento desses dados conforme 
        descrito acima e em conformidade com a LGPD.
        </p>
      </TermsText>

      <CheckboxContainer>
        <Checkbox
          id="checkbox"
          type="checkbox"
          checked={accepted}
          onChange={toggleAcceptTerms}
        />
        <label htmlFor="checkbox">Eu aceito os Termos de Uso</label>
      </CheckboxContainer>

      <Button disabled={!accepted} onClick={handleButtonClick}>
        Prosseguir
      </Button>
      <Button style={{marginTop: 10}} onClick={() => navigate('/')}>
        Voltar
      </Button>
    </Container>
  )
}
