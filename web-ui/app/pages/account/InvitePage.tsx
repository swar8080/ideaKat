/**
 * @prettier
 */

import { Formik } from "formik";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import {
  INVALID_EMAIL,
  maxCharMsg,
  minCharMsg,
  REQUIRED_MSG
} from "../../common/forms/validationMessageHelper";
import RegistrationRepository from "../../repository/RegistrationRepository";
import { UserInviteContract } from "./model";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import useTabTitle from "../../routing/useTabTitle";

interface InvitePageProps {}

const schema = Yup.object().shape({
  userEmail: Yup.string()
    .email(INVALID_EMAIL)
    .min(5, minCharMsg(5))
    .max(255, maxCharMsg(255))
    .required(REQUIRED_MSG)
});

const initialValues: UserInviteContract = {
  userEmail: ""
};

const InvitePage: React.FC<InvitePageProps> = (props: InvitePageProps) => {
  const [progressMessage, setProgressMessage] = React.useState(undefined);
  useTabTitle("Invite");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        return RegistrationRepository.inviteUser(values)
          .then(response => {
            if (response.successful) {
              setProgressMessage("Invitation sent");
              actions.resetForm();
            } else if (response.hasErrors) {
              actions.setErrors(response.errors);
            } else {
              setProgressMessage("Error sending invite");
            }

            actions.setSubmitting(false);
          })
          .catch(() => setProgressMessage("Error sending invite"));
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
          <div className="ideakat-form">
            <div className="ideakat-form-header">Invite Team Members</div>
            <FormGroup>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                name="userEmail"
                value={values.userEmail}
                length={255}
                onChange={e => {
                  handleChange(e);
                  if (progressMessage) {
                    setProgressMessage(undefined);
                  }
                }}
                onKeyPress={(e: React.KeyboardEvent<Element>) => onEnterKeyPressed(e, handleSubmit)}
                as="input"
                type="email"
                autoComplete="on"
                autoFocus
              />
            </FormGroup>
            <FormFieldErrorMessage
              touched={touched.userEmail}
              error={errors.userEmail}
              className="ideakat-form-field-error"
            />
            <LoadingSubmitButton
              isSubmitting={isSubmitting}
              isSubmittingAllowed={dirty && isValid && !isSubmitting}
              onClickSubmit={handleSubmit}
              buttonText="Invite"
            />
            <div className="ideakat-form-status-message">{progressMessage}</div>
          </div>
        );
      }}
    />
  );
};

export default InvitePage;
