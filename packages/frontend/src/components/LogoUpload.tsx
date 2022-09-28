import { Box, FileInput, FormField } from "grommet"
import { ChangeEvent, FC, useState } from "react";
import { CampaignFormValues } from "../pages/create/CampaignCreate";
import { IElement } from "./styles/BasicElements"

export interface LogoUploadI extends IElement {
}

export const LogoUpload: FC<LogoUploadI> = ({ }: LogoUploadI) => {
    const [numFiles] = useState(0);

    return (
        <FormField name="logo" label="Logo of the campaign">
            <Box fill justify="start">
                <FileInput
                    name="logo"
                    multiple={false}
                    accept="image/png, image/webp, image/jpeg"
                    messages={{
                        dropPrompt: 'Drop logo here',
                        browse: numFiles > 0 ? 'Replace Logo' : 'Select Logo',
                    }}
                    style={{ width: 'fill', borderRadius: '50px' }}
                />
            </Box>
        </FormField>
    )
}