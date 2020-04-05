import * as React from 'react';
import './PageBottomControl.scss';
import ControlButton from './ControlButton';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import classnames from 'classnames';

interface IProps {
    text: string,
    icon: IconDefinition,
    className: string,
    onButtonClick: () => void
}

const PageBottomControl: React.FC<IProps> = ({text, icon, className, onButtonClick}) => {
    return (
        <div className={classnames('pageBottomControl', className)}>
            <ControlButton
                text={text}
                icon={icon}
                className='pageBottomControl__controlButton'   
                identifier={""}
                onButtonClick={() => onButtonClick()}
            />
        </div>
    );
};

export default PageBottomControl