/**
 * @prettier
 */

import * as React from "react";
import { Formik } from "formik";
import { FormGroup, Form } from "react-bootstrap";
import * as Yup from "yup";

import { OrganizationInputsContract } from "./model";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import {
  minCharMsg,
  maxCharMsg,
  REQUIRED_MSG,
  INVALID_EMAIL
} from "../../common/forms/validationMessageHelper";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";

interface OrganizationDetailsFormProps {
  handleFormComplete: (
    values: OrganizationInputsContract
  ) => Promise<Record<keyof OrganizationInputsContract, string> | undefined>;
  submitButtonLabel: string;
}

const initialValues: OrganizationInputsContract = {
  organizationName: "",
  adminEmail: ""
};

const schema = Yup.object().shape({
  organizationName: Yup.string()
    .min(5, minCharMsg(5))
    .max(255, maxCharMsg(255))
    .required(REQUIRED_MSG),
  adminEmail: Yup.string()
    .email(INVALID_EMAIL)
    .min(5, minCharMsg(5))
    .max(255, maxCharMsg(255))
    .required(REQUIRED_MSG)
});

const OrganizationDetailsForm: React.FC<OrganizationDetailsFormProps> = ({
  handleFormComplete,
  submitButtonLabel
}: OrganizationDetailsFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={(values, formikActions) => {
        formikActions.setSubmitting(true);
        return handleFormComplete(values).then(errors => {
          if (errors) {
            formikActions.setErrors(errors);
            formikActions.setSubmitting(false);
          }
        });
      }}
      children={({
        values,
        errors,
        touched,
        dirty,
        isValid,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validateForm
      }) => {
        return (
          <div className="organizationDetailsForm">
            <FormGroup>
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                name="organizationName"
                value={values.organizationName}
                length={255}
                onChange={handleChange}
                onBlur={handleBlur}
                as="input"
                autoComplete="on"
                autoFocus
              />
              <FormFieldErrorMessage
                error={errors.organizationName}
                touched={touched.organizationName}
                className="ideakat-form-field-error"
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="adminEmail"
                value={values.adminEmail}
                length={255}
                onChange={e => {
                  handleChange(e);
                  validateForm();
                }}
                onBlur={handleBlur}
                onKeyPress={(e: React.KeyboardEvent<Element>) => onEnterKeyPressed(e, handleSubmit)}
                as="input"
                type="email"
                autoComplete="on"
              />
              <FormFieldErrorMessage
                error={errors.adminEmail}
                touched={touched.adminEmail}
                className="ideakat-form-field-error"
              />
            </FormGroup>
            <LoadingSubmitButton
              isSubmitting={isSubmitting}
              isSubmittingAllowed={dirty && isValid && !isSubmitting}
              onClickSubmit={handleSubmit}
              buttonText={submitButtonLabel}
            />
          </div>
        );
      }}
    />
  );
};

export default OrganizationDetailsForm;
