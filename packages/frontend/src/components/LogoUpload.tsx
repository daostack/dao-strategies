import { Box, FileInput, FormField } from "grommet"
import { ChangeEvent, FC, useState } from "react";
import { IElement } from "./styles/BasicElements"

export interface LogoUploadI extends IElement {

}

export const LogoUpload: FC<LogoUploadI> = (props: LogoUploadI) => {
    const [numFiles] = useState(0);

    const handleSelectLogo = (event?: ChangeEvent<HTMLInputElement>): void => {
        const logo = event?.target.files ? event.target.files[0] : null;
        console.log('selected logo ', logo);
        if (!logo) throw new Error('no file selected, cant proceed logo upload')
        const formData = new FormData();
        formData.append("logo", logo);

    }

    return (
        <Box fill justify="start">
            <FileInput
                name="file"
                multiple={false}
                accept="image/png, image/webp, image/jpeg"
                onChange={handleSelectLogo}
                messages={{
                    dropPrompt: 'Drop logo here',
                    browse: numFiles > 0 ? 'Replace Logo' : 'Select Logo',
                }}
                style={{ width: 'fill', borderRadius: '50px' }}
            />
        </Box>
    )
}