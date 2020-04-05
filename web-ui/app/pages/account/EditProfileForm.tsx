/**
 * @prettier
 */

import { Formik } from "formik";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import * as Yup from "yup";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import useEditImageFormInput from "../../common/forms/useEditImageFormInput";
import { maxCharMsg, minCharMsg, REQUIRED_MSG } from "../../common/forms/validationMessageHelper";
import { EditProfileContract } from "./model";

interface EditProfileFormProps {
    displayName: string;
    profileImageUrl?: string;
    handleSubmit: (
        values: EditProfileContract
    ) => Promise<Record<keyof EditProfileContract, string> | undefined>;
}

interface FormInputs {
    displayName: string;
}

const schema = Yup.object().shape({
    displayName: Yup.string()
        .min(2, minCharMsg(2))
        .max(255, maxCharMsg(255))
        .required(REQUIRED_MSG)
});

const EditProfileForm: React.FC<EditProfileFormProps> = ({
    displayName,
    profileImageUrl,
    handleSubmit
}) => {
    const {
        image,
        clearingImage,
        editImageFormInput,
        hasImageChanged,
        hasImageValidationError
    } = useEditImageFormInput(profileImageUrl);

    const initialValues: FormInputs = { displayName };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnMount={true}
            validateOnChange={false}
            onSubmit={(values: FormInputs, actions) => {
                const submitValues: EditProfileContract = {
                    displayName: values.displayName,
                    profileImage: image,
                    clearingProfileImage: clearingImage
                };

                return handleSubmit(submitValues).then(errors => {
                    if (errors) {
                        actions.setErrors(errors);
                    }
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
                isSubmitting
            }) => {
                return (
                    <>
                        <FormGroup>
                            <Form.Label>Display Name</Form.Label>
                            <Form.Control
                                name="displayName"
                                value={values.displayName}
                                length={255}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="input"
                                autoComplete="on"
                            />
                            <FormFieldErrorMessage
                                touched={touched.displayName}
                                error={errors.displayName}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Profile Image</Form.Label>
                            {editImageFormInput}
                        </FormGroup>
                        <LoadingSubmitButton
                            isSubmitting={isSubmitting}
                            isSubmittingAllowed={
                                (dirty || hasImageChanged) &&
                                isValid &&
                                !hasImageValidationError &&
                                !isSubmitting
                            }
                            onClickSubmit={handleSubmit}
                            buttonText={"Save"}
                        />
                    </>
                );
            }}
        />
    );
};

export default EditProfileForm;
