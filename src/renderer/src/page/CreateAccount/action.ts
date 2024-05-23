import { tokenGenerator, createAccount } from "@shared/api"

export const onSubmit = async (data, getToken) => {
   let t = {
     externalIdentifier: '86802ab1-8fba-408b-b381-4f793f268c82-2024-05-23T18:10:50.955Z',
     clientType: 'CORPORATE',
     accountType: 'UNLIMITED_ORDINARY',
     client: {
       taxIdentifier: { taxId: '12368785000196', country: 'BRA' },
       mobilePhone: { country: 'BRA', phoneNumber: '' },
       email: ''
     },
     billingAddress: {
       logradouro: '',
       numero: '',
       complemento: '',
       bairro: '',
       cidade: '',
       estado: '',
       cep: '',
       pais: 'BRA'
     },
     additionalDetailsCorporate: {
       establishmentDate: '',
       companyName: '',
       businessLine: 47,
       establishmentForm: 1,
       representatives: [
         {
           taxIdentifier: { country: 'BRA' },
           mobilePhone: { country: 'BRA' },
           mailAddress: { pais: 'BRA' },
           documents: [{ type: 'PICTURE' }, { type: 'IDENTITY_FRONT' }, { type: 'IDENTITY_BACK' }]
         }
       ]
     }
   }
}