import { Box, Button, FileInput, FormField, Grid, Heading, Layer } from "grommet"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { AppButton, IElement } from "./styles/BasicElements"
import 'cropperjs/dist/cropper.css';
import { Cropper, ReactCropperElement } from "react-cropper";
import { CampaignFormValues } from "../pages/create/CampaignCreate";

export interface SelectLogoI extends IElement {
    onValuesUpdated: (values: CampaignFormValues) => void;
    campaignFormValues: CampaignFormValues;
}

export const SelectLogo: FC<SelectLogoI> = ({ onValuesUpdated, campaignFormValues }: SelectLogoI) => {
    const [numFiles] = useState(0);
    const [showCropModal, setShowCropModal] = useState(false);
    const [image, setImage] = useState(undefined);
    const [cropData, setCropData] = useState('#');
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
        };
        reader.readAsDataURL(logo);
        setShowCropModal(true);
    }

    const saveCroppedLogo = (): void => {
        campaignFormValues.logo = cropData;
        onValuesUpdated(campaignFormValues);
        setShowCropModal(false);
    }

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
                        margin="large"
                        modal={true}
                        onEsc={() => setShowCropModal(false)}
                        onClickOutside={() => setShowCropModal(false)}
                    >
                        <Cropper
                            style={{ height: 400, width: '100%' }}
                            initialAspectRatio={16 / 9}
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
                        <Box alignSelf="center" pad="medium" width="medium" >
                            <AppButton primary onClick={getCropData}>Crop Image</AppButton>
                        </Box>

                        <Box
                            align="center"
                            alignSelf="center" pad="medium" width="medium"
                            overflow="hidden"
                        >
                            <img src={cropData} alt="cropped image" />
                        </Box>
                        <Grid columns={{ count: 2, size: 'auto' }} gap="medium" margin="medium">
                            <AppButton primary onClick={() => saveCroppedLogo()}>Save</AppButton>
                            <AppButton secondary onClick={() => setShowCropModal(false)}>Close</AppButton>
                        </Grid>

                    </Layer>
                )}
            </Box>
        </>
    )
}