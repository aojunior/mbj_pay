import { useNavigate } from 'react-router-dom'

export function Finally() {

    const navigate = useNavigate()
    return(
        <>
            <h1>Cadastro finalizado</h1>
            <p>Aguarde alguns para verificar sua conta</p>

            <button onClick={() => navigate('/dashboard')}>OK</button>
        </>
    )
}