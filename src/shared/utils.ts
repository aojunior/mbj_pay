export const formatDate = (date: string) => {
    let d = String(date).split('-')
    return d[2]+'-'+d[1]+'-'+d[0]
}

export const formatCNPJandCPF = (data: string) => {
    if(data?.length > 11 ) {
        let cnpj = data.replace(/\D/g, '');
        return cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        let cpf = data?.replace(/\D/g, '');
        return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}
  