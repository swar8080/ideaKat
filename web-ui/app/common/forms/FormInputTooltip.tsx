/**
 * @prettier
 */

import * as React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FormInputTooltip.scss";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import cn from 'classnames';

export interface FormInputTooltipProps {
  title?: string;
  content: JSX.Element | string;
  iconClassName?: string;
}

const FormInputTooltip: React.FC<FormInputTooltipProps> = ({title, content, iconClassName}) => {
  const popover = (
    <Popover id="form-input-tooltip">
      {title && <Popover.Title>{title}</Popover.Title>}
      <Popover.Content>
        {content}
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="hover" placement={"right"} overlay={popover}>
        <FontAwesomeIcon icon={faInfoCircle} size="1x" color={'blue'} className={cn(iconClassName)} />
    </OverlayTrigger>
  );
};

export default FormInputTooltip;
