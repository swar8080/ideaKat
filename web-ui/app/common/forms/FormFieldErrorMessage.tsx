/**
 * @prettier
 */

import * as React from 'react';
import classNames from 'classnames';
import './FormFieldErrorMessage.scss';

interface FormFieldErrorMessageProps {
    error?: string
    touched: boolean,
    className?: string,
}

const FormFieldErrorMessage: React.FC<FormFieldErrorMessageProps> = ({error, touched, className}) => {
    if (touched && error){
        const cns = classNames({[className]: !!className, formFieldErrorMessage: true});
        return <div className={cns}>{error}</div>
    }
    return null;
};

export default FormFieldErrorMessage;