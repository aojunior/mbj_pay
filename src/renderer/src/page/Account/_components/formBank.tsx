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
  ContentInRow
} from '../../../styles/global'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

type bankProps = {
  bankData: z.infer<typeof bankSchema>
  setBankData: any
}

export function FormBank({ bankData, setBankData }: bankProps) {
  const { control, register, watch } = useForm<z.infer<typeof bankSchema>>({
    resolver: zodResolver(bankSchema),
    defaultValues: bankData
  })
  const [showPassword, setShowPassword] = useState(false)

  watch((e) => setBankData({ ...bankData, password: e.password }))

  function getImg(e) {
    if (e.files[0]) {
      let lerImg = new FileReader()
      lerImg.readAsDataURL(e.files[0])
      lerImg.onload = () => {
        switch (e.name) {
          case 'imgSelfie':
            setBankData({ ...bankData, imgSelfie: JSON.parse(JSON.stringify(lerImg.result)) })
            break
          case 'imgRgFront':
            setBankData({ ...bankData, imgRgFront: JSON.parse(JSON.stringify(lerImg.result)) })
            break
          case 'imgRgBack':
            setBankData({ ...bankData, imgRgBack: JSON.parse(JSON.stringify(lerImg.result)) })
            break
        }
      }
    }
  }

  function togglePassword() {
    7
    setShowPassword(!showPassword)
  }

  return (
    <form>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          marginTop: 30
        }}
      >
        <Card style={{ width: '80%' }}>
          <CardHeader>
            <CardTitle>Anexo de Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <FormInput style={{ width: 450, marginTop: 20, marginBottom: 20 }}>
              <Label>Crie uma Senha da Aplicação</Label>
              <Label style={{ fontSize: 11, fontWeight: 500, color: '#4f4f4f' }}>
                Essa senha será usada para transferências, criação de chave pix e alterações de
                dados
              </Label>

              <ContentInRow style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite aqui"
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    size={24}
                    color="#4f4f4f"
                    onClick={togglePassword}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <AiFillEye
                    size={24}
                    color="#4f4f4f"
                    onClick={togglePassword}
                    style={{ cursor: 'pointer' }}
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
                  <PlaceholderImage>
                    <InputImg
                      {...field}
                      name="imgSelfie"
                      id="imgSelfie"
                      type="file"
                      accept="image/x-png, image/jpeg, image/jpg"
                      onChange={(e) => {
                        onChange(e.target)
                        getImg(e.target)
                      }}
                    />
                    <span>Selecionar Selfie</span>
                  </PlaceholderImage>
                </ContantImg>
              )}
            />

            <ContantImg>
              <UploadImg>
                <ImgPreview src={bankData.imgRgFront} />
              </UploadImg>
              <PlaceholderImage>
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
              <PlaceholderImage>
                <InputImg
                  name="imgRgBack"
                  type="file"
                  accept="image/x-png, image/jpeg, image/jpg"
                  onChange={(e) => getImg(e.target)}
                />
                <span>Selecionar RG Verso</span>
              </PlaceholderImage>
            </ContantImg>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
