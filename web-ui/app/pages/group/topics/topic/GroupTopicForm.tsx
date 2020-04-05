/**
 * @prettier
 */

import * as React from "react";
import { Form } from "react-bootstrap";
import { FormLabelWithTooltip, InlineFormItemWithTooltip } from "../../../../common/forms/FormLabelWithTooltip";
import LengthRestrictedInput from "../../../../common/forms/LengthRestrictedInput";
import { TopicValues } from "../../../../model/topic";
import { TopicValidation } from "../../../../model/validation";
import "./GroupTopicForm.scss";

interface GroupTopicFormProps {
  inputs: TopicValues;
  onValueChange?: (inputName: keyof TopicValues, newValue: string) => void;
  onTogglePinned?: () => void;
  isSaving: boolean;
  autoFocusOnFirstInput?: boolean;
}

const GroupTopicForm: React.FC<GroupTopicFormProps> = ({
  inputs,
  onValueChange,
  onTogglePinned,
  isSaving,
  autoFocusOnFirstInput
}) => {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Discussion Title</Form.Label>
        <LengthRestrictedInput
          value={inputs.summary}
          inputName="summary"
          characterLimit={TopicValidation.SUMMARY_CHAR_LIMIT}
          onTruncatedValueChange={onValueChange}
          formControlProps={{
            disabled: isSaving
          }}
          rows="1"
          autoFocus={autoFocusOnFirstInput}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <LengthRestrictedInput
          value={inputs.description}
          inputName="description"
          characterLimit={TopicValidation.DESCRIPTION_CHAR_LIMIT}
          onTruncatedValueChange={onValueChange}
          formControlProps={{
            disabled: isSaving
          }}
          rows="3"
        />
      </Form.Group>
      <Form.Group>
        <FormLabelWithTooltip
          inputLabel="Idea Contribution Suggestions"
          tooltipProps={{
            title: "Organize Ideas",
            content:
              "Suggestions shown to team members to help organize their ideas.\nFor example, ideas can be organized by colour and with tags."
          }}
        />
        <LengthRestrictedInput
          value={inputs.ideaContributionInstructions}
          inputName="ideaContributionInstructions"
          characterLimit={TopicValidation.IDEA_CONTRIBUTION_INSTRUCTION_CHAR_LIMIT}
          onTruncatedValueChange={onValueChange}
          formControlProps={{
            disabled: isSaving
          }}
          rows="3"
        />
      </Form.Group>
      <Form.Group>
        <InlineFormItemWithTooltip
          inlineFormItem={
            <Form.Check
              type="checkbox"
              checked={inputs.pinned}
              onClick={onTogglePinned}
              label="Pinned"
              disabled={isSaving}
            />
          }
          tooltipProps={{
            title: "Prioritize Discussions",
            content: "Pinned discussions appear at the top of a group",
            iconClassName: "groupTopicForm__pinnedIcon"
          }}
        />
      </Form.Group>
    </Form>
  );
};

GroupTopicForm.defaultProps = {
  autoFocusOnFirstInput: false
};

export default GroupTopicForm;
