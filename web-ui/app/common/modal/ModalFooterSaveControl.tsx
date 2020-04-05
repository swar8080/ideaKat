import * as React from 'react';
import { Modal } from 'react-bootstrap';
import LoadingSubmitButton from '../buttons/LoadingSubmitButton';
import './ModalFooterSaveControl.scss';

interface ModalFooterSaveControlProps {
    isSaving: boolean
    isSavingAllowed: boolean
    onClickSave: () => void
}

const ModalFooterSaveControl: React.FC<ModalFooterSaveControlProps> = ({isSaving, isSavingAllowed, onClickSave}) => {
    return (
        <>
            <Modal.Footer>
                <LoadingSubmitButton
                    isSubmitting={isSaving}
                    isSubmittingAllowed={isSavingAllowed}
                    onClickSubmit={onClickSave}
                    buttonText='Save'
                />
            </Modal.Footer>
        </>
    );
};

export default ModalFooterSaveControl;