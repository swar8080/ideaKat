/**
 * @prettier
 */

import { Formik } from "formik";
import { History } from "history";
import * as React from "react";
import { Form, FormGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../common/auth/AuthContext";
import LoadingSubmitButton from "../../common/buttons/LoadingSubmitButton";
import { HOME, REQUEST_RESET_PASSWORD, SHOW_HELP_MODAL_URL_PARAM } from "../../routing/uiroutes";
import UserRepository from "../../repository/UserRepository";
import "../../style/ideakat-form.scss";
import "./LoginPage.scss";
import * as Yup from "yup";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
import { REQUIRED_MSG } from "../../common/forms/validationMessageHelper";
import FormFieldErrorMessage from "../../common/forms/FormFieldErrorMessage";
import useTabTitle from "../../routing/useTabTitle";

interface LoginPageProps {
    showHelpModalOnLogin?: boolean;
}

interface LoginFormValues {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().required(REQUIRED_MSG),
    password: Yup.string().required(REQUIRED_MSG)
});

const LoginPage: React.FC<LoginPageProps> = ({ showHelpModalOnLogin }) => {
    const [errorMessage, setErrorMessage] = React.useState(undefined);
    const authContext = React.useContext(AuthContext);
    const history: History = useHistory();
    useTabTitle("Login");

    return (
        <div className="loginPage ideakat-form">
            <div className="ideakat-form-header">Login to an existing team</div>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={schema}
                validateOnChange={false}
                onSubmit={(values: LoginFormValues, actions) => {
                    UserRepository.login(values.email, values.password)
                        .then(response => {
                            if (response.successful) {
                                authContext.handleAuthStatusChange();
                                history.replace(
                                    HOME +
                                        (showHelpModalOnLogin
                                            ? `?${SHOW_HELP_MODAL_URL_PARAM}=true`
                                            : "")
                                );
                            } else {
                                actions.setSubmitting(false);
                                actions.setFieldValue("password", "", false);
                                setErrorMessage(response.responseMessage);
                            }
                        })
                        .catch(() => setErrorMessage("Unable to complete login request"));
                }}
                children={({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    dirty,
                    isValid,
                    isSubmitting,
                    validateForm
                }) => {
                    return (
                        <>
                            <Form>
                                <FormGroup>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        name="email"
                                        value={values.email}
                                        length={255}
                                        onChange={handleChange}
                                        as="input"
                                        type="email"
                                        autoComplete="on"
                                        autoFocus
                                    />
                                    <FormFieldErrorMessage
                                        touched={touched.email}
                                        error={errors.email}
                                        className="ideakat-form-field-error"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        name="password"
                                        value={values.password}
                                        length={255}
                                        onChange={e => {
                                            handleChange(e);
                                            validateForm();
                                        }}
                                        as="input"
                                        type="password"
                                        autoComplete="on"
                                        onKeyPress={(e: React.KeyboardEvent<Element>) =>
                                            onEnterKeyPressed(e, handleSubmit)
                                        }
                                    />
                                    <FormFieldErrorMessage
                                        touched={touched.password}
                                        error={errors.password}
                                        className="ideakat-form-field-error"
                                    />
                                </FormGroup>
                                <LoadingSubmitButton
                                    isSubmitting={isSubmitting}
                                    isSubmittingAllowed={dirty && isValid && !isSubmitting}
                                    onClickSubmit={handleSubmit}
                                    buttonText="Login"
                                />
                                {errorMessage && (
                                    <div className="loginPage__errorMessage">{errorMessage}</div>
                                )}
                            </Form>
                        </>
                    );
                }}
            />
            <div className="loginPage__resetPassword">
                <Link to={REQUEST_RESET_PASSWORD}>Forgot password?</Link>
            </div>
        </div>
    );
};

LoginPage.defaultProps = {
    showHelpModalOnLogin: false
};

export default LoginPage;
