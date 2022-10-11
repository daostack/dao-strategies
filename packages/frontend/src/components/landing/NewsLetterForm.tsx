import { Heading, Box, TextInput, Button } from 'grommet';
import { useState } from 'react';
import { AppButton, AppFormField, AppInput, AppTextArea } from '../styles/BasicElements';
import { constants } from './constants';

export interface NewsletterFormProps {
  status: string;
  message: string;
  onValidated: any;
}

const NewsletterForm = ({ status, message, onValidated }: NewsletterFormProps) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  /**
   * Handle form submit.
   *
   * @return {{value}|*|boolean|null}
   */
  const handleFormSubmit = () => {
    setError('');

    if (!email) {
      setError('Please enter a valid email address');
      return null;
    }

    const isFormValidated = onValidated({ EMAIL: email });

    // On success return true
    return email && email?.indexOf('@') > -1 && isFormValidated;
  };

  /**
   * Handle Input Key Event.
   *
   * @param event
   */
  const handleInputKeyEvent = (event: any) => {
    setError('');
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      handleFormSubmit();
    }
  };

  /**
   * Extract message from string.
   *
   * @param {String} message
   * @return {}
   */
  const getMessage = (message: string): string => {
    if (!message) {
      return '';
    }
    const result = message?.split('-') ?? null;
    if ('0' !== result?.[0]?.trim()) {
      return message;
    }
    const formattedMessage = result?.[1]?.trim() ?? null;
    return formattedMessage ? formattedMessage : '';
  };

  return (
    <>
      {/* Newsletter Signup Box */}
      <div>
        {!status && 'error' !== status && !error && (
          <>
            <Box align="center">
              <AppFormField name="title">
                <AppInput
                  style={{ width: 'fill' }}
                  id="emailaddress"
                  type="text"
                  width="fill"
                  onChange={(event) => setEmail(event?.target?.value ?? '')}
                  onKeyUp={(event) => handleInputKeyEvent(event)}
                  placeholder="email or telegram"
                />
              </AppFormField>

              <AppFormField style={{ marginTop: '10px' }}>
                <AppTextArea placeholder="Why do you want to get beta access?" name="description"></AppTextArea>
              </AppFormField>

              <Box pad="medium">
                <AppButton
                  style={{ backgroundColor: 'rgba(75, 166, 100, 0.6)' }}
                  primary
                  onClick={handleFormSubmit}
                  type="button">
                  Get Beta Access
                </AppButton>
              </Box>
            </Box>
          </>
        )}
      </div>

      <Box className="min-h-42px h-full w-full  mt-2 flex justify-center">
        {'error' === status || error ? (
          <div className="text-red-700 pt-2" dangerouslySetInnerHTML={{ __html: error || getMessage(message) }} />
        ) : null}
        {'success' === status && (
          <>
            <div className="w-full md:w-1/2  shadow-lg shadow-indigo-500/40 p-3 mx-1  rounded-lg  bg-gradient-to-b from-[#E42AAC]/25 to-[#AD63F5]/25">
              <div className="w-full flex justify-center">
                <img
                  src="icons/icons8-konfetti-48.png"
                  alt="..."
                  className="shadow rounded-full max-w-full h-auto align-middle border-none"
                />
              </div>
              <p className="text-md tracking-widest text-white title-font mb-1 font-medium">
                Thank you for subscribing!
              </p>
            </div>
          </>
        )}
      </Box>
    </>
  );
};

export default NewsletterForm;
