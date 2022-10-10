import { Box, ResponsiveContext } from 'grommet';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import NewsletterForm from './NewsLetterForm';
import { styleConstants } from '../styles/themes';
import React from 'react';

export const NewsletterSubscribe = () => {
    const size = React.useContext(ResponsiveContext);


    const maxWidthDependingOnDevice = () => {
        return size.includes('small') ? '100vw' : '35vw'
    }

    const MAILCHIMP_URL = process.env.VITE_MAILCHIMP_URL || 'https://xyz.us14.list-manage.com/subscribe/post?u=e22f5256c29782ac6460a0fc3&amp;id=01c9ca1bed&amp;f_id=009ff8e0f0';
    return (
        <Box pad="40px" margin="40px" style={{ maxWidth: maxWidthDependingOnDevice(), backgroundColor: styleConstants.colors.whiteElements, borderRadius: '20px', border: '1px solid #E7E7E7', boxShadow: '0px 40.64px 54.56px rgba(14, 15, 25, 0.1);' }}>
            <MailchimpSubscribe
                url={MAILCHIMP_URL.toString()}
                render={(props: {}) => {
                    const { subscribe, status, message }: any = props || {};
                    return (
                        <NewsletterForm
                            status={status}
                            message={message}
                            onValidated={(formData: any) => subscribe(formData)}
                        />
                    );
                }}
            />
        </Box>

    );
};