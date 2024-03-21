import os
import hmac
import hashlib
import requests
import uuid
import datetime as dt
from dotenv import load_dotenv
from connectDB import *

load_dotenv()
path = os.getcwd()
caminho = f'{path}\ModuloPix.db'
url = os.environ['URL']
client_id = os.environ['CLIENTEID']
client_secret = os.environ['CLIENTSECRET']
SecretKey = os.environ['SECRETKEY']
accountid = os.environ['accountId']
certificate_file_pem = path + os.environ['certificatecrt']
certificate_file_key = path + os.environ['certificatekey']

# tupla dos certificados
cert = (certificate_file_pem, certificate_file_key)
header = {
    'Accept-Encoding': 'gzip, deflate, br',
    'connection': 'keep-alive',
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'mtls-mp.hml.flagship.maas.link'
}
dados = {}


# Cria Hash para enviar no header da requisição
def encrypt_string(hash_string):
    sha_signature = hmac.new(
        bytes(SecretKey, 'latin-1'),
        msg=bytes(hash_string, 'latin-1'),
        digestmod=hashlib.sha256
    ).hexdigest()
    return sha_signature


def criar_cliente(data):
    now = dt.datetime.now()
    query = 'SELECT token FROM cliente_info where id = 1'
    token = select_query(query)[0][0]

    value_hash = f'{uuid.uuid4()}-{data["cnpj"]}'
    hash_string = '{}'.format(value_hash)

    print(token)
    sha_signature = encrypt_string(hash_string)
    header['Accept'] = 'application/json'
    header['content-type'] = 'application/json'
    header['Authorization'] = f'Bearer {token}'
    header['Transaction-Hash'] = sha_signature
    body = {
        "externalIdentifier": f'{sha_signature}-{now}',
        "clientType": "CORPORATE",
        "accountType": "UNLIMITED_ORDINARY",
        "client": {
            "name": data['social-name'],
            "taxIdentifier": {
                "taxId": data['cnpj'],
                "country": "BRA"
            },
            "mobilePhone": {
                "country": "BRA",
                "phoneNumber": data['phone-company']
            },
            "email": data['email-company']
        },
        "billingAddress": {
            "logradouro": data['billing-street'],
            "numero": data['billing-street-number'],
            "complemento": data['billing-complement'],
            "bairro": data['billing-neighborhood'],
            "cidade": data['billing-city'],
            "estado": data['billing-state'],
            "cep": data['billing-code-post'],
            "pais": "BRA"
        },
        "additionalDetailsCorporate": {
            "establishmentDate": data['fundation-date'],
            "companyName": data['fantasy-name'],
            "businessLine": 47,
            "establishmentForm": 1,
            "representatives": [
                {
                    "name": data["client-name"],
                    "mother": data['client-name-mother'],
                    "birthDate": data['birth-date'],
                    "taxIdentifier": {
                        "taxId": data['cpf'],
                        "country": "BRA"
                    },
                    "mobilePhone": {
                        "country": "BRA",
                        "phoneNumber": data['client-phone']
                    },
                    "email": data['client-email'],
                    "mailAddress": {
                        "logradouro": data['client-street'],
                        "numero": data['client-street-number'],
                        "complemento": data['client-complement'],
                        "bairro": data['client-neighborhood'],
                        "cidade": data['client-city'],
                        "estado": data['client-state'],
                        "cep": data['client-code-post'],
                        "pais": "BRA"
                    },
                    "documents": [
                        {
                            "content": data["self"],
                            "type": "PICTURE"
                        },
                        {
                            "content": data["identity-front"],
                            "type": "IDENTITY_FRONT"
                        },
                        {
                            "content": data["identity-back"],
                            "type": "IDENTITY_BACK"
                        }
                    ]
                }
            ]
        }
    }

    res = requests.post(f'{url}/v1/accounts', headers=header, data=body, cert=cert)

    if res.status_code == 200:

        response = res.json()
        # value = {
        #     'nome': data['social-name'],
        #     'cnpj': data['cnpj'],
        #     'telefone': data['phone-company'],
        #     'email': data['email-company'],
        #     'accountid': response['data']['accoundId']
        # }

        print(res)
    else:
        print('Erro ao cadastrar')
        print(res)


def gerar_token():
    body = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    res = requests.post(f'{url}/auth/realms/Matera/protocol/openid-connect/token', headers=header, data=body, cert=cert)
    if res.status_code == 200:
        bearer_Token = res.json()
        update_token(bearer_Token['access_token'])
        print(bearer_Token)
        print(f'Token Renovado')
    else:
        print('Erro ao Autenticar')
        print(res)


def consultar_cliente():
    consultar_sql = "SELECT accountid, token FROM cliente_info WHERE id = 1"
    qry = select_query(consultar_sql)

    hash_string = '{}'.format(qry[0][0])
    sha_signature = encrypt_string(hash_string)
    header['Accept'] = 'application/json'
    header['Content-Type'] = 'application/json'
    header['Authorization'] = f'Bearer {qry[0][1]}'
    header['Transaction-Hash'] = sha_signature

    res = requests.get(f'{url}/v1/accounts/{accountid}', headers=header, cert=cert)

    if res.status_code == 401:
        print('Error 401')
        gerar_token()
    elif res.status_code == 200:
        print(res)
        dados = res.json()
        print(dados['data'])
        return dados
    else:
        print(res)
        return f'''
            Erro na Consulta
            Cód. {res.status_code}
        '''


def gerar_pagamento_instantaneo(order, type):
    now = dt.date.now()
    recipientAmount = ''

    consultar_sql = "SELECT accountid, token, alias FROM cliente_info WHERE id = 1"
    qry = select_query(consultar_sql)

    hash_string = '{},{},{},{}'.format(qry[0][2], order.totalAmount, qry[0][0], recipientAmount)
    sha_signature = encrypt_string(hash_string)

    header['Authorization'] = f'Bearer {qry[0][1]}'
    header['Transaction-Hash'] = sha_signature

    body = {
            "externalIdentifier": f"{sha_signature}",
            "totalAmount": f'{order.totalAmount}',
            "currency": "BRL",
            "paymentInfo": {
                "transactionType": f"{type}",
                "instantPayment": {
                    "alias": f"{qry[0][2]}",
                    "qrCodeImageGenerationSpecification": {
                        "errorCorrectionLevel": "M",
                        "imageWidth": 400,
                        "generateImageRendering": True
                    },
                    "expiration": 600,
                    "additionalInformation": [
                        {
                            "name": "Nro DO PEDIDO",
                            "content": f"{order.id}",
                            "showToPayer": True
                        }
                    ]
                }
            },
            "recipients": [
                {
                    "account": {
                        "accountId": f'{accountid}'
                    },
                    "amount": f"{recipientAmount}",
                    "currency": "BRL",
                    "mediatorFee": 2,
                    "recipientComment": "Recipient comment"
                }
            ],
            "callbackAddress": "https://testemockqr.requestcatcher.com/"
    }

    res = requests.post(f'{url}/v1/payments', header=header, body=body, cert=cert)

    data = res.json()
    print(res)
    # print(data)


def consulta_extrato_ec():
    consultar_sql = "SELECT accountid, token FROM cliente_info WHERE id = 1"
    qry = select_query(consultar_sql)

    hash_string = '{}'.format(qry[0][0])
    sha_signature = encrypt_string(hash_string)
    header['content-type'] = 'application/json'
    header['Authorization'] = f'Bearer {qry[0][1]}'
    header['Transaction-Hash'] = sha_signature

    res = requests.get(f'{url}/v1/accounts/{accountid}/statement', headers=header, cert=cert)

    if(res.status_code == 200):
        print(res)
    else:
        print(f'''Error:
            {res.status_code}
            {res}
        ''')


def consulta_saldo_ec():
    consultar_sql = "SELECT accountid, token FROM cliente_info WHERE id = 1"
    qry = select_query(consultar_sql)

    hash_string = '{}'.format(qry[0][0])
    sha_signature = encrypt_string(hash_string)
    header['content-type'] = 'application/json'
    header['Authorization'] = f'Bearer {qry[0][1]}'
    header['Transaction-Hash'] = sha_signature

    res = requests.get(f'{url}/v2/accounts/{accountid}/balance', headers=header, cert=cert)

    if (res.status_code == 200):
        print(res)
    else:
        print(f'''Error:
            {res.status_code}
            {res}
        ''')