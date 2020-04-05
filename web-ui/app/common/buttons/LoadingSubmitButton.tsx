/**
 * @prettier
 */

import * as React from 'react';
import './LoadingSubmitButton.scss';
import { Button, Spinner } from 'react-bootstrap';

interface LoadingSubmitButtonProps {
    isSubmitting: boolean,
    isSubmittingAllowed: boolean,
    onClickSubmit: () => void,
    buttonText: string,
}

const LoadingSubmitButton: React.FC<LoadingSubmitButtonProps> = ({isSubmitting, isSubmittingAllowed, onClickSubmit, buttonText}) => {
    return (
        <Button variant="info" onClick={() => onClickSubmit()} disabled={!isSubmittingAllowed}>
            {isSubmitting && <Spinner
                as="span"
                animation="border"
                size="sm"
            />}
            <span className='loadingSubmitButton__buttonText'>{buttonText}</span>
        </Button>
    );
};

export default LoadingSubmitButton;