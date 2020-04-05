/**
 * @prettier
 */

import { Formik } from "formik";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { History } from "history";
import AuthContext from "../../common/auth/AuthContext";
import UserRepositoryImpl from "../../repository/UserRepository";
import { HOME } from "../../routing/uiroutes";
import { minCharMsg, maxCharMsg, REQUIRED_MSG } from "../../common/forms/validationMessageHelper";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import useTabTitle from "../../routing/useTabTitle";

interface ResetPageProps {
  confirmationCode: string;
}

const schema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, minCharMsg(8))
    .max(255, maxCharMsg(8))
    .required(REQUIRED_MSG),
  newPassword2: Yup.string()
    .min(8, minCharMsg(8))
    .max(255, maxCharMsg(255))
    .required(REQUIRED_MSG)
});

const initialValues = {
  newPassword: "",
  newPassword2: ""
};

const ResetPage: React.FC<ResetPageProps> = ({ confirmationCode }) => {
  const [statusMessage, setStatusMessage] = React.useState();
  const authContext = React.useContext(AuthContext);
  const history: History = useHistory();
  useTabTitle("Reset Password");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        if (values.newPassword !== values.newPassword2) {
          actions.setFieldError("newPassword2", "Passwords do not match");
          actions.setSubmitting(false);
          return;
        }

        const request = {
          confirmationCode,
          newPassword: values.newPassword
        };
        return UserRepositoryImpl.resetPassword(request)
          .then(response => {
            if (response.successful) {
              authContext.setAuthenticationStatus(response.data);
              history.replace(HOME);
            } else if (response.hasErrors) {
              actions.setErrors(response.errors);
            } else {
              setStatusMessage(response.responseMessage);
            }
            actions.setSubmitting(false);
          })
          .catch(() => setStatusMessage("Unable to reset password"));
      }}
      children={({
        values,
        errors,
        touched,
        handleChange,
        isSubmitting,
        isValid,
        dirty,
        handleSubmit
      }) => {
        return (
          <div className="resetPage ideakat-form">
            <div className='ideakat-form-header'>Change Passwords</div>
            <FormGroup>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="newPassword"
                value={values.newPassword}
                length={255}
                onChange={handleChange}
                as="input"
                type="password"
                autoFocus
              />
              <FormFieldErrorMessage
                touched={touched.newPassword}
                error={errors.newPassword}
                className="ideakat-form-field-error"
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Password2</Form.Label>
              <Form.Control
                name="newPassword2"
                value={values.newPassword2}
                length={255}
                onChange={handleChange}
                onKeyPress={(e: React.KeyboardEvent<Element>) => onEnterKeyPressed(e, handleSubmit)}
                as="input"
                type="password"
              />
              <FormFieldErrorMessage
                touched={touched.newPassword2}
                error={errors.newPassword2}
                className="ideakat-form-field-error"
              />
            </FormGroup>
            <LoadingSubmitButton
              isSubmitting={isSubmitting}
              isSubmittingAllowed={dirty && isValid && !isSubmitting}
              onClickSubmit={handleSubmit}
              buttonText="Submit"
            />
            <div className="ideakat-form-status-message">{statusMessage}</div>
          </div>
        );
      }}
    />
  );
};

export default ResetPage;
