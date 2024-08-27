export const formatDate = (date: Date) => {
  let d = date.toISOString().split('T')
  let format = d[0].split('-')
  return format[2] + '/' + format[1] + '/' + format[0]
}

export const formatCNPJandCPF = (data: string) => {
  if (data?.length > 11) {
    let cnpj = data.replace(/\D/g, '')
    return cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  } else {
    let cpf = data?.replace(/\D/g, '')
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
}