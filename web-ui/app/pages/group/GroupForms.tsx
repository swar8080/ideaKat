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
import useImageFormInput from "../../common/forms/useImageFormInput";
import { maxCharMsg, minCharMsg, REQUIRED_MSG } from "../../common/forms/validationMessageHelper";
import "./GroupForms.scss";
import { GroupCreationValue, GroupEditValues } from "./model";

interface GroupCreationFormProps {
    handleSubmit: (
        values: GroupCreationValue
    ) => Promise<Record<keyof GroupCreationValue, string> | undefined>;
}

const schema = Yup.object().shape({
    groupName: Yup.string()
        .min(2, minCharMsg(2))
        .max(50, maxCharMsg(50))
        .required(REQUIRED_MSG),
    description: Yup.string()
        .min(2, minCharMsg(2))
        .max(150, maxCharMsg(150))
});

interface FormInputs {
    groupName: string;
    description?: string;
}

const emptyInitialValus: FormInputs = {
    groupName: "",
    description: ""
};

const GroupCreationForm: React.FC<GroupCreationFormProps> = ({ handleSubmit }) => {
    const { image, imageValidationError, handleImageChange } = useImageFormInput();

    return (
        <Formik
            initialValues={emptyInitialValus}
            validationSchema={schema}
            validateOnChange={false}
            onSubmit={(values: FormInputs, actions) => {
                const submitValues: GroupCreationValue = {
                    ...values,
                    groupImage: image
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
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                name="groupName"
                                value={values.groupName}
                                length={50}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="input"
                                autoComplete="on"
                                autoFocus
                            />
                            <FormFieldErrorMessage
                                touched={touched.groupName}
                                error={errors.groupName}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Group Description</Form.Label>
                            <Form.Control
                                name="description"
                                value={values.description}
                                length={150}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="textarea"
                                rows={2}
                                autoComplete="on"
                            />
                            <FormFieldErrorMessage
                                touched={touched.description}
                                error={errors.description}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Group Image</Form.Label>
                            <Form.Control
                                as="input"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <FormFieldErrorMessage
                                touched={!!imageValidationError}
                                error={imageValidationError}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <LoadingSubmitButton
                            isSubmitting={isSubmitting}
                            isSubmittingAllowed={dirty && isValid && !isSubmitting}
                            onClickSubmit={handleSubmit}
                            buttonText={"Submit"}
                        />
                    </>
                );
            }}
        />
    );
};

interface GroupEditFormProps {
    initialValues: FormInputs;
    initialGroupImageUrl?: string;
    handleSubmit: (
        values: GroupEditValues
    ) => Promise<Record<keyof GroupCreationValue, string> | undefined>;
}

const GroupEditForm: React.FC<GroupEditFormProps> = ({
    initialValues,
    initialGroupImageUrl,
    handleSubmit
}) => {
    const {
        image,
        clearingImage,
        editImageFormInput,
        hasImageChanged,
        hasImageValidationError
    } = useEditImageFormInput(initialGroupImageUrl);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            onSubmit={(values: FormInputs, actions) => {
                const submitValues: GroupEditValues = {
                    ...values,
                    groupImage: image,
                    clearingImage
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
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                name="groupName"
                                value={values.groupName}
                                length={50}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="input"
                                autoComplete="on"
                                autoFocus
                            />
                            <FormFieldErrorMessage
                                touched={touched.groupName}
                                error={errors.groupName}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Group Description</Form.Label>
                            <Form.Control
                                name="description"
                                value={values.description}
                                length={150}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                as="textarea"
                                rows={2}
                                autoComplete="on"
                            />
                            <FormFieldErrorMessage
                                touched={touched.description}
                                error={errors.description}
                                className="ideakat-form-field-error"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Group Image</Form.Label>
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

export { GroupCreationForm, GroupEditForm };
