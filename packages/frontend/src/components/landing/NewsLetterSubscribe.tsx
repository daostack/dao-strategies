import { Box, Form, BoxExtendedProps } from 'grommet';
import { FC, useState } from 'react';
import { AppButton, AppFormField, AppInput, AppTextArea } from '../styles/BasicElements';

/** manually extracted from form, using this tutorial https://dev.to/utkarshdhiman48/custom-frontend-for-google-form-456l */
const url = 'https://docs.google.com/forms/d/e/1FAIpQLSf0BBhMH635A4MzCijnWscDDxC0s6XYMuu47nesMBA7LWMqNQ/formResponse';
const emailName = 'entry.1588852581';
const feedbackName = 'entry.501734265';

const initValues = { name: '', email: '', feedback: '' };

export interface INewsletterSubscribe extends BoxExtendedProps {}

export const NewsletterSubscribe: FC<INewsletterSubscribe> = (props: INewsletterSubscribe) => {
  const [values, setValues] = useState(initValues);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const submit = (values: any) => {
    if (values.name === '' && values.email === '' && values.feedback === '') return;

    const dataToPost = new FormData(); //formdata API

    //fill name attributes to corresponding values
    dataToPost.append(emailName, values.email);
    dataToPost.append(feedbackName, values.feedback);

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataToPost,
    })
      .then((data) => {
        setValues(initValues);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      })
      .catch((err) => setError(true));
  };

  const disabled = values.email === undefined || values.email === '';

  return (
    <Form
      onSubmit={(event) => submit(event.value)}
      value={values}
      onChange={(nextValue, { touched }) => {
        setValues(nextValue);
      }}
      style={{ width: '100%', maxWidth: '500px', ...props.style }}>
      <AppFormField name="email">
        <AppInput name="email" placeholder="Email or Telegram"></AppInput>
      </AppFormField>
      <AppFormField name="feedback">
        <AppTextArea
          resize="vertical"
          name="feedback"
          placeholder="Why do you want to get beta access"
          autoResize={false}></AppTextArea>
      </AppFormField>
      {error ? (
        <Box style={{ color: '#ac2525' }}>Sorry, there was an error submitting your response.</Box>
      ) : submitted ? (
        <Box>🙂 Thank you for showing interest, we will reach out to you! </Box>
      ) : (
        <AppButton style={{ width: '100%' }} disabled={disabled} primary type="submit" label="Get Beta Access 🚀" />
      )}
    </Form>
  );
};
