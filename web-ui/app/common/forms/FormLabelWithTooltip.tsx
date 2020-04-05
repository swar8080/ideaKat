/**
 * @prettier
 */

import * as React from "react";
import "./FormLabelWithTooltip.scss";
import FormInputTooltip, { FormInputTooltipProps } from "./FormInputTooltip";
import { Form } from "react-bootstrap";
import cn from "classnames";

interface InlineFormItemWithTooltipProps {
  tooltipProps: FormInputTooltipProps;
  inlineFormItem: JSX.Element;
  className?: string;
}

const InlineFormItemWithTooltip: React.FC<InlineFormItemWithTooltipProps> = ({
  tooltipProps,
  inlineFormItem,
  className
}) => {
  return (
    <div className={cn("inlineFormItemWithTooltip", className)}>
      {inlineFormItem}
      <FormInputTooltip {...tooltipProps} iconClassName="inlineFormItemWithTooltip__icon" />
    </div>
  );
};

interface FormLabelWithTooltip {
  tooltipProps: FormInputTooltipProps;
  inputLabel: string;
}

const FormLabelWithTooltip: React.FC<FormLabelWithTooltip> = ({ tooltipProps, inputLabel }) => {
  return <InlineFormItemWithTooltip
    inlineFormItem={<Form.Label>{inputLabel}</Form.Label>}
    tooltipProps={tooltipProps}
    className={'formLabelWithTooltip'}
  />;
};

export { InlineFormItemWithTooltip, FormLabelWithTooltip };
