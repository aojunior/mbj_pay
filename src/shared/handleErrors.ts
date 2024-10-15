
export function handleStatusError(status) {
    console.log('Error:', status);
    // Add your own status handling logic here
    if(status == 400) {
        return {data: null, message: 'Bad Request'}
    }
    if(status == 401) {
        return {data: null, message: 'Unauthorized'}
    }
    if(status == 403) {
        return {data: null, message: 'Forbidden'}
    }
    if(status == 404) {
        return {data: null, message: 'Not Found'}
    }
    if(status == 500) {
        return {data: null, message: 'Server Error'}
    }
    if(status == 503) {
        return {data: null, message: 'Network Error'}
    }
}

export function handleMessageError(error) {
    if(error.message == 'Bad Request') {
        error.message = 'Error na requisição'
        return error
    }
    if(error.message == 'Unauthorized') {
        error.message = 'Acesso não autorizado'
        return error
    }
    if(error.message == 'Forbidden') {
        error.message = 'Você não possui permissão para executar esta ação'
        return error
    }
    if(error.message == 'Not Found') {
        error.message = 'Recurso não encontrado'
        return error
    }
    if(error.message == 'Server Error') {
        error.message ='Erro interno do servidor'
        return error
    }
    if(error.message == 'Network Error') {
        error.message ='Erro de comunicação com o servidor'
        return error
    }
}