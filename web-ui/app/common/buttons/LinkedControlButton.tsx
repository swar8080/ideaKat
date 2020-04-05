import * as React from 'react';
import { ControlButton, ControlButtonProps } from './ControlButton';
import { withRouter } from 'react-router-dom';

interface IProps extends Omit<ControlButtonProps, "onButtonClick"|"identifier"> {
    urlPath: string
}

const renderLinkedControlButton = (props: IProps) => {
    const Component = withRouter(({history}) => {
        return (
            <>
                <ControlButton
                    {...props}
                    identifier=""
                    onButtonClick={() => !props.disabled && history.push(props.urlPath)}
                />
            </>
        )
    });
    return <Component/>;
};

export default renderLinkedControlButton;