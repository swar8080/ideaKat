import * as React from 'react';
import GroupTopicForm from './GroupTopicForm';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import './GroupTopicFormModal.scss';
import { TopicValues } from '../../../../model/topic';
import ModalFooterSaveControl from '../../../../common/modal/ModalFooterSaveControl';

interface GroupTopicModalProps {
    modalTitle: string
    inputs?: TopicValues,
    isOpen: boolean,
    isCloseable: boolean,
    onSave: (inputs: TopicValues) => Promise<TopicFormSaveResult>
    onClose: () => void;
    autoFocusedOnFirstInput?: boolean,
}

export interface TopicFormSaveResult {
    successful: boolean,
    errorMsg?: string
}

const GroupTopicFormModal: React.FC<GroupTopicModalProps> = (props: GroupTopicModalProps) => {
    const [inputValues, setInputValues] = useState(props.inputs);
    const [saveStatus, setSaveStatus] = useState({
        isSaving: false,
        isDirty: false
    })

    function onValueChange(key: string, newValue: string){
        setInputValues(prev => ({
            ...prev,
            [key]: newValue
        }));
        setDirty();
    }

    function onTogglePinned(){
        setInputValues(prev => ({
            ...prev,
            pinned: !prev.pinned
        }));
        setDirty();
    }

    function setDirty(){
        if (!saveStatus.isDirty){
            setSaveStatus(prev => ({
                ...prev,
                isDirty: true
            }));
        }
    }

    function onClickSave(){
        setSaveStatus(prev => ({
            ...prev,
            isSaving: true
        }));
        props.onSave(inputValues).then(({successful, errorMsg}) => {
            setSaveStatus(prev => ({
                ...prev,
                isSaving: false,
                isDirty: false
            }));
        });
    }

    function isValid(): boolean {
        return inputValues.summary && inputValues.summary.length > 0;
    }

    const isSaveButtonEnabled = isValid() && saveStatus.isDirty && !saveStatus.isSaving;
    return (
        props.isOpen && <Modal 
            className='groupTopicFormModal' 
            show={props.isOpen} 
            onHide={() => props.onClose()} 
            size='lg'
            scrollable
        > 
            <Modal.Header closeButton={props.isCloseable}>
                <Modal.Title>
                    {props.modalTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GroupTopicForm 
                    inputs={inputValues}
                    onValueChange={onValueChange}
                    onTogglePinned={onTogglePinned}
                    isSaving={saveStatus.isSaving}
                    autoFocusOnFirstInput={props.autoFocusedOnFirstInput}
                />
            </Modal.Body>
            <ModalFooterSaveControl
                isSaving={saveStatus.isSaving}
                isSavingAllowed={isSaveButtonEnabled}
                onClickSave={onClickSave}
            />
        </Modal>
    );
};

GroupTopicFormModal.defaultProps = {
    inputs: {
        summary: "",
        description: "",
        pinned: false,
        ideaContributionInstructions: ""
    },
    autoFocusedOnFirstInput: false
}

export default GroupTopicFormModal