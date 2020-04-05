/**
 * @prettier
 */

import { Formik } from "formik";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import UserRepository from "../../repository/UserRepository";
import {
  INVALID_EMAIL,
  minCharMsg,
  maxCharMsg,
  REQUIRED_MSG
} from "../../common/forms/validationMessageHelper";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import useTabTitle from "../../routing/useTabTitle";

interface RequestResetPageProps {}

const schema = Yup.object().shape({
  email: Yup.string()
    .email(INVALID_EMAIL)
    .required(REQUIRED_MSG)
    .min(5, minCharMsg(5))
    .max(255, maxCharMsg(255))
});

const initialValues = {
  email: ""
};

const RequestResetPage: React.FC<RequestResetPageProps> = (props: RequestResetPageProps) => {
  const [statusMessage, setStatusMessage] = React.useState();
  const [hasSuccessfulRequest, setHasSuccesfulRequest] = React.useState(false);
  useTabTitle("Reset Password");

  return (
    <div className="requestResetPage ideakat-form">
      <div className="ideakat-form-header">Request a Password Reset</div>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          return UserRepository.requestPasswordReset(values.email)
            .then(response => {
              if (response.successful) {
                setStatusMessage(
                  "A password reset email has been sent if an account exists with that email"
                );
                setHasSuccesfulRequest(true);
              } else {
                setStatusMessage("Error: Unable to send password reset email");
              }
              actions.setSubmitting(false);
            })
            .catch(() => setStatusMessage("Error: Unable to send password reset email"));
        }}
        children={({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          dirty,
          isValid,
          isSubmitting
        }) => {
          return (
            <>
              <FormGroup>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={values.email}
                  length={255}
                  onChange={handleChange}
                  disabled={isSubmitting || hasSuccessfulRequest}
                  onKeyPress={(e: React.KeyboardEvent<Element>) =>
                    onEnterKeyPressed(e, handleSubmit)
                  }
                  as="input"
                  type="email"
                  autoComplete="on"
                  autoFocus
                />
                <FormFieldErrorMessage
                  error={errors.email}
                  touched={touched.email}
                  className="ideakat-form-field-error"
                />
              </FormGroup>
              <LoadingSubmitButton
                isSubmitting={isSubmitting}
                isSubmittingAllowed={dirty && isValid && !isSubmitting && !hasSuccessfulRequest}
                onClickSubmit={handleSubmit}
                buttonText="Submit"
              />
              <div className="ideakat-form-status-message">{statusMessage}</div>
            </>
          );
        }}
      />
    </div>
  );
};

export default RequestResetPage;
