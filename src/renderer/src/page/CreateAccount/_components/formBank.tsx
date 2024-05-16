import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

import { bankSchema } from "../schema";
import { bankData } from "../action";
import { ContantImg, ImgPreview, InputImg, PlaceholderImage, UploadImg } from "../styles";
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../styles/global';

export function FormBank() {
    const {register, handleSubmit, control} = useForm <z.infer<typeof bankSchema>>({
        resolver: zodResolver(bankSchema),
    })    
    
    const onSubmit = handleSubmit((data) => {
        console.log(file)
    })

    const [file, setFile] = useState({} as z.infer<typeof bankSchema>)

    function getImg(e) {
        if(e.files[0]) {
            let lerImg = new FileReader()
            lerImg.readAsDataURL(e.files[0])
            lerImg.onload = () => {
                switch(e.name) {
                    case 'imgSelfie':
                        setFile({...file, imgSelfie: JSON.parse(JSON.stringify(lerImg.result))})
                        break;
                    case 'imgRgFrente':
                        setFile({...file, imgRgFrente: JSON.parse(JSON.stringify(lerImg.result))})
                        break;
                    case 'imgRgverso':
                        setFile({...file, imgRgverso: JSON.parse(JSON.stringify(lerImg.result))})
                        break
                }
            }
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 30 }}>
              <Card style={{width: '80%'}}>
                <CardHeader>
                    <CardTitle>Anexo de Documento</CardTitle>
                </CardHeader>
                <CardContent>
                    <Controller
                        name="imgSelfie"
                        control={control}
                        render={({field: {value, onChange, ...field}}) => (
                            <ContantImg>
                                <UploadImg>
                                    {file && <ImgPreview src={file.imgSelfie}/>}
                                </UploadImg>
                                <PlaceholderImage>
                                    <InputImg
                                    {...field}
                                    name="imgSelfie"
                                    id="imgSelfie" type="file"  
                                    accept="image/x-png, image/jpeg, image/jpg" 
                                    onChange={e => {onChange(e.target); getImg(e.target)}}
                                    />
                                    <span>Selecionar Selfie</span>
                                </PlaceholderImage>
                            </ContantImg>
                        )}
                    />

                    <ContantImg>
                        <UploadImg>
                            {file && <ImgPreview src={file.imgRgFrente}/>}
                        </UploadImg>
                        <PlaceholderImage>
                            <InputImg 
                            name='imgRgFrente' type="file" 
                            accept="image/x-png, image/jpeg, image/jpg"
                            onChange={e => getImg(e.target)}
                            />
                            <span>Selecionar RG Frente</span>
                        </PlaceholderImage>
                    </ContantImg>

                    <ContantImg>
                        <UploadImg>
                            {file && <ImgPreview src={file.imgRgverso}/>}
                        </UploadImg>
                        <PlaceholderImage>
                            <InputImg
                            name='imgRgverso' type="file"
                            accept="image/x-png, image/jpeg, image/jpg"
                            onChange={e => getImg(e.target)}
                            />
                            <span>Selecionar RG Verso</span>
                        </PlaceholderImage>
                    </ContantImg>
                </CardContent>
              </Card>
              <Button type="submit"> Finalizar </Button>
            </div>
        </form>
    )
}