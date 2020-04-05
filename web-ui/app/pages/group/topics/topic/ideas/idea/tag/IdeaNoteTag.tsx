import * as React from 'react';
import { IdeaTag } from '../../../../../../../model/idea';
import './IdeaNoteTag.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faCheckCircle} from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import classNames from 'classnames';
import { useRef } from 'react';

interface IProps {
    tag: IdeaTag,
    onClick?: () => void,
    selected?: boolean
}

const IdeaNoteTag: React.FC<IProps> = ({tag, onClick, selected}) => {
    return (
        <div 
            className={classNames('ideaNoteTag', {selected})}
            onClick={onClick}
        >
        {tag.label}
        </div>
    );
};

IdeaNoteTag.defaultProps = {
    onClick: () => {},
    selected: false
}

interface RemovableIdeaNoteTagProps extends IProps {
    onClickRemove: () => void
}

export const RemovableIdeaNoteTag: React.FC<RemovableIdeaNoteTagProps> = (({tag, onClickRemove}) => {
    return (
        <div className='ideaNoteTag removable'>
            <div className='ideaNoteTag__label'>{tag.label}</div>
            <div className='ideaNoteTag__remove' onClick={onClickRemove} title='Remove'>x</div>
        </div>
    );
});

interface EditableIdeaNoteTagProps {
    isEditing: boolean,
    label: string
    onClickAdd: () => void,
    onChangeLabel: (newLabel: string) => void,
    onCancelEditingLabel: () => void,
    canFinishEditingLabel: boolean,
    onFinishEditingLabel: () => void
}

export const EditableIdeaNoteTag: React.FC<EditableIdeaNoteTagProps> = ({isEditing, label, onClickAdd, onChangeLabel, onCancelEditingLabel, canFinishEditingLabel, onFinishEditingLabel}) => {
    const inputEl = useRef(null);
    const isHoveringOverFinishButton = useRef(false);

    React.useEffect(() => {
        const keyListener = (event: KeyboardEvent) => {
            if (event.key === "Enter" && canFinishEditingLabel){
                onFinishEditingLabel();
            }
            else if (event.key === "Escape"){
                onCancelEditingLabel();
            }
        }

        if (inputEl.current){
            inputEl.current.addEventListener('keyup', keyListener);
            inputEl.current.focus();
        }

        return () => {
            inputEl.current && inputEl.current.removeEventListener('keyup', keyListener);
        }
    }, [inputEl.current, onFinishEditingLabel])
    
    function onChange(event: React.SyntheticEvent){
        const input: HTMLInputElement = event.target as HTMLInputElement;
        onChangeLabel(input.value);
    }

    function onBlur(){
        if (!isHoveringOverFinishButton.current){
            onCancelEditingLabel();
        }
    }
    
    if (!isEditing){
        return (
            <div className='ideaNoteTag add' onClick={onClickAdd} title='Add Tag'>
                <FontAwesomeIcon icon={faPlusCircle} size='lg'/>
            </div>
        )
    }
    else {
        return (
            <div className={classNames('ideaNoteTag edit', {disabled: !canFinishEditingLabel})}>
                <div className='ideaNoteTag__label editable'>
                    <input type="text" className='ideaNoteTag__editableInput' 
                        value={label} 
                        onChange={onChange} 
                        onBlur={onBlur}
                        ref={inputEl}
                        placeholder='Add Tag'
                    />
                </div>
                <div 
                    className={classNames('ideaNoteTag__doneEdit')} 
                    onClick={() => canFinishEditingLabel && onFinishEditingLabel()}
                    onMouseEnter={() => { isHoveringOverFinishButton.current = true}}
                    onMouseLeave={() => { isHoveringOverFinishButton.current = false}}
                    title='Done'
                >
                    <FontAwesomeIcon 
                        icon={faCheckCircle}
                        className='ideaNoteTag__doneEditButton'
                        size='lg'
                    />
                </div>
            </div>
        );
    }
}

export default IdeaNoteTag