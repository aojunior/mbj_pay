import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { bankSchema } from '../schema'
import { ContantImg, ImgPreview, InputImg, PlaceholderImage, UploadImg } from '../styles'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormInput,
  Label,
  Input,
  ContentInRow,
  Container,
  IconEyeInvisible,
  IconEye,
  Button
} from '../../../styles/global'
import { useState } from 'react'
import { useAccount } from '@renderer/context/account.context'

export function FormBank() {
  const { bankData, setBankData } = useAccount()
  const { control, register, watch } = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    defaultValues: bankData
  })
  const [showPassword, setShowPassword] = useState(false)
  const [selectDoc, setSelectDoc] = useState('RG')
  const [pathContrato, setPathContrato] = useState('')
  watch((e) => setBankData({ ...bankData, password: e.password }))

  function getImg(e) {
    if (e.files[0]) {
      let lerImg = new FileReader()
      lerImg.readAsDataURL(e.files[0])
      lerImg.onload = () => {
        switch (e.name) {
          case 'imgSelfie':
            setBankData({ ...bankData, imgSelfie: lerImg.result })
            break
          case 'imgRgFront':
            setBankData({ ...bankData, imgRgFront: lerImg.result })
            break
          case 'imgRgBack':
            setBankData({ ...bankData, imgRgBack: lerImg.result })
            break
          case 'imgCnh':
            setBankData({ ...bankData, imgCnh: lerImg.result })
            break
        }
      }
    }
  }


  const convertPDFToBase64 = (file) => {
    setPathContrato(file.name)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const base64String = result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error("Erro ao processar o arquivo."));
        }
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Pega o primeiro arquivo selecionado
  
    if (file && file.type === "application/pdf") {
      convertPDFToBase64(file)
        .then((base64) => {
          setBankData({ ...bankData, pdfContrato: base64 })
        })
        .catch((error) => {
          console.error("Erro ao converter PDF:", error);
        });
    } else {
      console.error("Por favor, selecione um arquivo PDF.");
    }
  };  
  
  function togglePassword() {
    setShowPassword(!showPassword)
  }

  return (
    <form>
      <Container style={{height: '80vh', gap: 20, marginTop: 30, width: '65vw', overflowY: 'scroll' }}>
        <Card style={{width: '100%'}}>
          <CardHeader>
            <CardTitle>Anexo de Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <FormInput style={{ width: 450, marginTop: 20, marginBottom: 20 }}>
              <Label>Crie uma Senha da Aplicação</Label>
              <Label style={{ fontSize: 11, fontWeight: 500, color: '#4f4f4f' }}>
                Essa senha será usada para transferências, criação de chave pix, alterações de
                dados, entre outros.
              </Label>

              <ContentInRow style={{ width: '70%', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite aqui"
                  style={{ width: '100%', boxSizing: 'border-box', justifySelf: 'flex-end'}}
                />
                {showPassword ? (
                  <IconEyeInvisible
                    size={24}
                    onClick={togglePassword}
                    style={{position: 'relative', right: 40}}
                  />
                ) : (
                  <IconEye
                    size={24}
                    onClick={togglePassword}
                    style={{position: 'relative', right: 40}}
                  />
                )}
              </ContentInRow>
            </FormInput>

            <Controller
              name="imgSelfie"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <ContantImg>
                  <UploadImg>
                    <ImgPreview src={bankData.imgSelfie} />
                  </UploadImg>
                  <PlaceholderImage 
                  style={{backgroundColor: bankData.imgSelfie ? "#3178c6" : "#fff", 
                  color: bankData.imgSelfie ? "#fff" : "#444" }}>
                    <InputImg
                      {...field}
                      name="imgSelfie"
                      id="imgSelfie"
                      type="file"
                      accept="image/x-png, image/jpeg, image/jpg"
                      
                      onChange={(e) => {
                        getImg(e.target)
                      }}
                    />
                    <span>Selecionar Selfie</span>
                  </PlaceholderImage>
                </ContantImg>
              )}
            />

            <Label style={{marginTop: 40}}>Selecione o Documento desejado para envio:</Label>
            <ContentInRow style={{gap: 50}}>
              <Button onClick={() => setSelectDoc('RG')} type='button' style={{background: selectDoc == 'RG'? '#3178c6' : '#0000', color: selectDoc == 'RG'? '#fff' : '#444'}}>RG</Button>
              <Button onClick={() => setSelectDoc('CNH')} type='button' style={{background: selectDoc == 'CNH'? '#3178c6' : '#0000', color: selectDoc == 'CNH'? '#fff' : '#444'}}>CNH</Button>
            </ContentInRow>

            {
              selectDoc == 'RG' ?
              <>
                <ContantImg>
                  <UploadImg>
                    <ImgPreview src={bankData.imgRgFront} />
                  </UploadImg>
                  <PlaceholderImage
                  style={{backgroundColor: bankData.imgRgFront ? "#3178c6" : "#fff", 
                    color: bankData.imgRgFront ? "#fff" : "#444" }}
                  >
                    <InputImg
                      name="imgRgFront"
                      type="file"
                      accept="image/x-png, image/jpeg, image/jpg"
                      onChange={(e) => getImg(e.target)}
                    />
                    <span>Selecionar RG Frente</span>
                  </PlaceholderImage>
                </ContantImg>

                <ContantImg>
                  <UploadImg>
                    <ImgPreview src={bankData.imgRgBack} />
                  </UploadImg>
                  <PlaceholderImage
                    style={{backgroundColor: bankData.imgRgBack ? "#3178c6" : "#fff", 
                      color: bankData.imgRgBack ? "#fff" : "#444" }}
                  >
                    <InputImg
                      name="imgRgBack"
                      type="file"
                      accept="image/x-png, image/jpeg, image/jpg"
                      onChange={(e) => getImg(e.target)}
                    />
                    <span>Selecionar RG Verso</span>
                  </PlaceholderImage>
                </ContantImg>
              </>
              :
              <ContantImg>
                <UploadImg>
                  <ImgPreview src={bankData.imgCnh} />
                </UploadImg>
                <PlaceholderImage
                style={{backgroundColor: bankData.imgCnh ? "#3178c6" : "#fff", 
                  color: bankData.imgCnh ? "#fff" : "#444" }}
                >
                  <InputImg
                    name="imgCnh"
                    type="file"
                    accept="image/x-png, image/jpeg, image/jpg"
                    onChange={(e) => getImg(e.target)}
                  />
                  <span>Selecionar CNH</span>
                </PlaceholderImage>
              </ContantImg>
            }

            <ContantImg style={{marginTop: 40, flexDirection: 'column'}}>
              <div style={{ borderWidth: 2, borderColor: '#c4c4c7', borderRadius: 5, padding: 2}}>
                <p>{pathContrato}</p>
              </div>
              <PlaceholderImage
                style={{backgroundColor: bankData.pdfContrato ? "#3178c6" : "#fff", 
                  color: bankData.pdfContrato ? "#fff" : "#444" }}
              >
                <InputImg
                  name="pdfContrato"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                />
                <span>Selecionar Contrato Social</span>
              </PlaceholderImage>
            </ContantImg>
            
          </CardContent>
        </Card>
      </Container>
    </form>
  )
}
