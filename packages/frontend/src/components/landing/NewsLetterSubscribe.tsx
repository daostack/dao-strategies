import {
  Box,
  Button,
  ButtonExtendedProps,
  Form,
  FormField,
  TextArea,
  TextInput,
  Text,
  BoxExtendedProps,
} from 'grommet';
import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { AppButton } from '../styles/BasicElements';

import { constants } from './constants';

const inputStyle = css`
  & {
    padding: 24px 32px;
    border-radius: 34px;
    background-color: rgba(255, 255, 255, 0.2);
    color: #adbfb2;
    border: solid 1px rgba(255, 255, 255, 0.2);
    font-weight: 400;
  }
`;
const AppTextInput = styled(TextInput)`
  ${inputStyle}
`;
const AppTextArea = styled(TextArea)`
  ${inputStyle}
`;

/** manually extracted from form, using this tutorial https://dev.to/utkarshdhiman48/custom-frontend-for-google-form-456l */
const url = 'https://docs.google.com/forms/d/e/1FAIpQLSf0BBhMH635A4MzCijnWscDDxC0s6XYMuu47nesMBA7LWMqNQ/formResponse';
const nameName = 'entry.1633159233';
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
    dataToPost.append(nameName, values.name);
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

  return (
    <Form
      onSubmit={(event) => submit(event.value)}
      value={values}
      onChange={(nextValue, { touched }) => {
        setValues(nextValue);
      }}
      style={{ width: '100%', maxWidth: '500px', ...props.style }}>
      <FormField name="email">
        <AppTextInput name="email" placeholder="Email (optional, to be kept updated)"></AppTextInput>
      </FormField>
      <FormField name="feedback">
        <AppTextArea resize="vertical" name="Feedback" placeholder="Comments (optional)"></AppTextArea>
      </FormField>
      {error ? (
        <Box pad={{ vertical: '16px', horizontal: '32px' }} style={{ color: '#ac2525' }}>
          Sorry, there was an error submitting your response.
        </Box>
      ) : submitted ? (
        <Box pad={{ vertical: '16px', horizontal: '32px' }}>🙂 Sent! </Box>
      ) : (
        <AppButton style={{ width: '100%' }} disabled={true} primary type="submit" label="Send 🚀" />
      )}
    </Form>
  );
};
