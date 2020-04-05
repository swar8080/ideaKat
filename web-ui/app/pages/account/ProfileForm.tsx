/**
 * @prettier
 */

import { Formik } from "formik";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import { ProfileInputsContract } from "./model";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import { minCharMsg, maxCharMsg, REQUIRED_MSG } from "../../common/forms/validationMessageHelper";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import useImageFormInput from "../../common/forms/useImageFormInput";

interface ProfileFormProps {
    handleFormComplete: (
        values: ProfileInputsContract
    ) => Promise<Record<keyof ProfileInputsContract, string> | undefined>;
    submitButtonLabel: string;
}

interface ProfileFormInputs {
    fullName: string;
    password: string;
    password2: string;
}

const initialValues: ProfileFormInputs = {
    fullName: "",
    password: "",
    password2: ""
};

const schema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, minCharMsg(2))
        .max(255, maxCharMsg(255))
        .required(REQUIRED_MSG),
    password: Yup.string()
        .min(8, minCharMsg(8))
        .max(255, maxCharMsg(255))
        .required(REQUIRED_MSG),
    password2: Yup.string()
        .min(8, minCharMsg(8))
        .max(255, maxCharMsg(255))
        .required(REQUIRED_MSG)
});

const ProfileForm: React.FC<ProfileFormProps> = ({ handleFormComplete, submitButtonLabel }) => {
    const {
        image: profileImage,
        imageValidationError: profileImageValidationError,
        handleImageChange: handleProfileImageChange
    } = useImageFormInput();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            onSubmit={(values: ProfileFormInputs, actions) => {
                if (values.password !== values.password2) {
                    actions.setFieldError("password2", "Passwords do not match");
                    actions.setSubmitting(false);
                    return;
                }

                const uploadValues = {
                    ...values,
                    profileImage: profileImage
                };

                return handleFormComplete(uploadValues).then(errors => {
                    if (errors) {
                        actions.setErrors(errors);
                    }
                    actions.setSubmitting(false);
                });
            }}
            children={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                dirty,
                isValid,
                isSubmitting,
                validateForm
            }) => {
                return (
                    <>
                        <FormGroup>
                            <Form.Label>Display Name</Form.Label>
                            <Form.Control
                                name="fullName"
                                value={values.fullName}
                                length={255}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="input"
                                autoComplete="on"
                                autoFocus
                            />
                            <FormFieldErrorMessage
                                touched={touched.fullName}
                                error={errors.fullName}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                name="password"
                                value={values.password}
                                length={255}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="input"
                                type="password"
                            />
                            <FormFieldErrorMessage
                                touched={touched.password}
                                error={errors.password}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Retype Password</Form.Label>
                            <Form.Control
                                name="password2"
                                value={values.password2}
                                length={255}
                                onChange={e => {
                                    handleChange(e);
                                    validateForm();
                                }}
                                onBlur={handleBlur}
                                onKeyPress={(e: React.KeyboardEvent<Element>) =>
                                    onEnterKeyPressed(e, handleSubmit)
                                }
                                as="input"
                                type="password"
                            />
                            <FormFieldErrorMessage
                                touched={touched.password2}
                                error={errors.password2}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                as="input"
                                type="file"
                                onChange={handleProfileImageChange}
                                accept="image/*"
                            />
                            <FormFieldErrorMessage
                                touched={!!profileImageValidationError}
                                error={profileImageValidationError}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <LoadingSubmitButton
                            isSubmitting={isSubmitting}
                            isSubmittingAllowed={dirty && isValid && !isSubmitting}
                            onClickSubmit={handleSubmit}
                            buttonText={submitButtonLabel}
                        />
                    </>
                );
            }}
        />
    );
};

export default ProfileForm;
