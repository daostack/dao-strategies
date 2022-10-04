import { Box, Image, Text, FileInput, FormField, Grid, Heading, Layer } from "grommet"
import { ChangeEvent, FC, useEffect, useReducer, useRef, useState } from "react";
import { AppButton, IElement } from "./styles/BasicElements"
import { Cropper, ReactCropperElement } from "react-cropper";
import { CampaignFormValues } from "../pages/create/CampaignCreate";
import { Buffer } from 'buffer';
import { Close } from 'grommet-icons';

//helper css
import 'cropperjs/dist/cropper.css';

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
    const [, forceUpdate] = useReducer((x) => x + 1, 0)

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

    const getImageTypeFromBase64String = (base64Data: string): string => {
        return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"))
    }


    const convertBase64FromCropToFile = async () => {
        if (cropData) {
            campaignFormValues.logo = await base64ToFile(cropData, `croppedLogo.${getImageTypeFromBase64String(cropData)}`);;
            // set the NEW CROPPED file to the fileinput, so its shown
            const fileInput = document.querySelector('#logo-select-input');
            if (campaignFormValues.logo && fileInput) {
                (fileInput as HTMLInputElement).value = '';
                var newFileList = new DataTransfer();
                newFileList.items.add(campaignFormValues.logo);
                (fileInput as HTMLInputElement).files = newFileList.files
                forceUpdate() // due to the nature of useRef we need a force UI Update otherwise new file list wont be shown
            }
            onValuesUpdated(campaignFormValues);
            setShowCropModal(false);
        }
    }

    const renderFilename = (file: any): JSX.Element => {
        console.log('renderFile ', file, ' ', `croppedLogo.${getImageTypeFromBase64String(cropData)}`);
        return (<p>{cropData ? `croppedLogo.${getImageTypeFromBase64String(cropData)}` : file.name}</p>)
    }
    useEffect(() => {
        convertBase64FromCropToFile();
    }, [cropData])


    return (
        <>
            {/*Select Logo Part */}
            <FormField name="logo" label="Logo of the campaign">
                {!cropData ? (<Box fill justify="start">
                    <FileInput
                        name="logo"
                        id="logo-select-input"
                        multiple={false}
                        renderFile={renderFilename}
                        onChange={handleSelectLogo}
                        accept="image/png, image/webp, image/jpeg"
                        messages={{
                            dropPrompt: 'Drop logo here',
                            browse: numFiles > 0 ? 'Replace Logo' : 'Select Logo',
                        }}
                        style={{ width: 'fill', height: 'fill', minHeight: '15px', borderRadius: '50px' }} />
                </Box>
                ) : (
                    <Box direction="column">
                        <Image
                            fit="cover"
                            height="64px" width="64px"
                            src={cropData}
                            style={{ borderRadius: '100px' }}
                        />
                        <AppButton secondary>Remove</AppButton>
                    </Box>)}
            </FormField>

            {/*Crop Logo Part */}
            {showCropModal && (
                <Layer
                    animate={true}
                    animation="fadeIn"
                    position="center"
                    modal={true}
                    style={{ borderRadius: '20px' }}
                    onEsc={() => setShowCropModal(false)}
                    onClickOutside={() => setShowCropModal(false)}
                >
                    <Box pad={{ horizontal: 'medium', vertical: 'small' }} width="25rem" height="35rem" background="white" style={{ borderRadius: '20px' }}>
                        <Box direction="row">
                            <Heading style={{ width: '95%', fontSize: '18px' }}> Crop your image </Heading>
                            <Close onClick={() => { setShowCropModal(false) }} style={{ marginTop: '1rem', cursor: 'pointer', width: '14px', opacity: 0.75 }} />
                        </Box>
                        <Cropper
                            initialAspectRatio={1 / 1}
                            aspectRatio={1}
                            style={{ width: 'fill', height: '75%' }}
                            guides={true}
                            src={image}
                            ref={imageRef}
                            dragMode={'move'}
                            checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                        />
                        <AppButton
                            primary
                            margin={{ top: '1rem' }}
                            onClick={() => saveCroppedBase64()}>
                            <Text style={{ width: 'fill', fontSize: '16px' }}>Select Image</Text>
                        </AppButton>
                    </Box>

                </Layer>
            )}
        </>
    )
}