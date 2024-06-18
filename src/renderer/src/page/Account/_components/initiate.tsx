
export function Initiate() {

    return (
        <>
            <h2>Initiate Account</h2>

            <span>Se já possui um cadastro digite o Cnpj da conta cadastrada</span>
            <label htmlFor="cnpj">CNPJ </label>
            <input id="cnpj" type="text" placeholder="Digite o CNPJ" />
            
            <button>
                Já tenho Cadastro
            </button>

            <button>
                Novo Cadastro
            </button>

        </>
    )
}