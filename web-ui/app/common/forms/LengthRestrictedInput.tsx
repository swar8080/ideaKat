/**
 * @prettier
 */

import * as React from "react";
import "./LengthRestrictedInput.scss";
import { FormControlProps, Form } from "react-bootstrap";
import { SyntheticEvent } from "react";
import useAutoFocus from "./useAutoFocus";

interface LengthRestrictedInputProps {
  value: string;
  characterLimit: number;
  inputName: string;
  formControlProps: FormControlProps;
  onTruncatedValueChange: (key: string, truncatedValue: string) => void;
  rows: string;
  autoFocus?: boolean
  onBlur?: (e: React.FocusEvent<any>) => void
}

const LengthRestrictedInput: React.FC<LengthRestrictedInputProps> = ({
  value,
  characterLimit,
  inputName,
  onTruncatedValueChange,
  rows,
  formControlProps,
  autoFocus,
  onBlur,
}) => {
  const inputRef = React.useRef();
  useAutoFocus(inputRef, autoFocus);

  function onChange(event: SyntheticEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const inputValue = input.value || "";
    onTruncatedValueChange(inputName, inputValue.substring(0, characterLimit));
  }

  const characterLimitString = `${(value && value.length) || 0}/${characterLimit}`;
  return (
    <>
      <Form.Control
        as="textarea"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        {...formControlProps}
        ref={inputRef}
      />
      <Form.Text className="text-muted">{characterLimitString}</Form.Text>
    </>
  );
};

LengthRestrictedInput.defaultProps = {
  autoFocus: false,
  onBlur: () => {}
}

export default LengthRestrictedInput;
