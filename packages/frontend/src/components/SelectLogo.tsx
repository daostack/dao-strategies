import { Box, Button, FileInput, FormField, Grid, Heading, Layer } from "grommet"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { AppButton, IElement } from "./styles/BasicElements"
import 'cropperjs/dist/cropper.css';
import { Cropper, ReactCropperElement } from "react-cropper";
import { CampaignFormValues } from "../pages/create/CampaignCreate";
import { Buffer } from 'buffer';

//helper css to make crop area rounded
import "../css/roundCrop.css";

export interface SelectLogoI extends IElement {
    onValuesUpdated: (values: CampaignFormValues) => void;
    campaignFormValues: CampaignFormValues;
}

export const SelectLogo: FC<SelectLogoI> = ({ onValuesUpdated, campaignFormValues }: SelectLogoI) => {
    const [numFiles] = useState(0);
    const [showCropModal, setShowCropModal] = useState(false);
    const [image, setImage] = useState(undefined);
    const [cropData, setCropData] = useState('');
    const imageRef = useRef<ReactCropperElement>(null);
    const [cropper, setCropper] = useState<Cropper>();

    const getCropData = () => {
        if (typeof cropper !== 'undefined') {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const handleSelectLogo = (event?: ChangeEvent<HTMLInputElement>): void => {
        event?.preventDefault();
        const logo = event?.target.files ? event.target.files[0] : null;
        if (!logo) return
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
            setShowCropModal(true);
        };
        reader.readAsDataURL(logo);
    }

    const saveCroppedBase64 = (): void => {
        getCropData();
    }

    /***
    * Converts a dataUrl base64 image string into a File byte array
    * dataUrl example:
    * data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACLCAYAAABRGWr/AAAAAXNSR0IA...etc
    */
    const base64ToFile = (dataUrl: string, filename: string): File | undefined => {
        const arr = dataUrl.split(',');
        if (arr.length < 2) { return undefined; }
        const mimeArr = arr[0].match(/:(.*?);/);
        if (!mimeArr || mimeArr.length < 2) { return undefined; }
        const mime = mimeArr[1];
        const buff = Buffer.from(arr[1], 'base64');
        return new File([buff], filename, { type: mime });
    }

    const convertBase64FromCropToFile = async () => {
        if (cropData) {
            campaignFormValues.logo = await base64ToFile(cropData, 'croppedLogo.png');;
            onValuesUpdated(campaignFormValues);
            setShowCropModal(false);
        }
    }
    useEffect(() => {
        convertBase64FromCropToFile();
    }, [cropData])

    return (
        <>
            {/*Select Logo Part */}
            <FormField name="logo" label="Logo of the campaign">
                <Box fill justify="start">
                    <FileInput
                        name="logo"
                        multiple={false}
                        onChange={handleSelectLogo}
                        accept="image/png, image/webp, image/jpeg"
                        messages={{
                            dropPrompt: 'Drop logo here',
                            browse: numFiles > 0 ? 'Replace Logo' : 'Select Logo',
                        }}
                        style={{ width: 'fill', borderRadius: '50px' }} />
                </Box>
            </FormField>

            {/*Crop Logo Part */}
            <Box>
                {showCropModal && (
                    <Layer
                        animate={true}
                        animation="fadeIn"
                        position="center"
                        margin={{ horizontal: 'large' }}
                        modal={true}
                        onEsc={() => setShowCropModal(false)}
                        onClickOutside={() => setShowCropModal(false)}
                    >
                        <Heading> Crop your image </Heading>
                        <Cropper
                            initialAspectRatio={1 / 1}
                            preview=".img-preview"
                            viewMode={1} //restrict the crop box not to exceed the size of the canvas.
                            guides={true}
                            src={image}
                            ref={imageRef}
                            dragMode={'move'}
                            checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                        />
                        <AppButton alignSelf="center" primary onClick={() => saveCroppedBase64()}>Select Image</AppButton>
                    </Layer>
                )}
            </Box>
        </>
    )
}