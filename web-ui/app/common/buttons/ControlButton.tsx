import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import './ControlButton.scss';

export interface ControlButtonProps {
    text: string,
    icon: IconDefinition
    className: string,
    identifier: string,
    onButtonClick: (identifier: string) => void;
    disabled?: boolean
}

export const ControlButton: React.FC<ControlButtonProps> = ({text, icon, className, identifier, onButtonClick, disabled}) => {
    return (
        <div 
            className={classNames('controlButton', className, {disabled})}
            onClick={() => onButtonClick(identifier)}
        >
            <FontAwesomeIcon 
                className={'controlButtonIcon'}
                icon={icon}
            />
            <div className='controlButtonText'>{text}</div>      
        </div>
    )
};

export default ControlButton;