/**
 * @prettier
 */

import { Formik, FormikErrors } from "formik";
import * as React from "react";
import { Form, FormGroup, Modal } from "react-bootstrap";
import LengthRestrictedInput from "../../../../../../common/forms/LengthRestrictedInput";
import ModalFooterSaveControl from "../../../../../../common/modal/ModalFooterSaveControl";
import { IdeaColour, IdeaValues, IdeaWithEditability, IdeaTag } from "../../../../../../model/idea";
import { IdeaProperties, IdeaValidation } from "../../../../../../model/validation";
import { APIResponse } from "../../../../../../repository/APIResponse";
import ColourSelector from "./ColourSelector";
import "./IdeaNoteFormModal.scss";
import TagListEditor, { removeEqualTag } from "./tag/TagListEditor";
import { FormLabelWithTooltip } from "../../../../../../common/forms/FormLabelWithTooltip";
import FormFieldErrorMessage from "../../../../../../common/forms/FormFieldErrorMessage";

interface IdeaNoteModalProps {
  isOpen: boolean;
  values?: IdeaValues;
  onClose: () => void;
  onSubmit: (values: IdeaValues) => Promise<APIResponse<IdeaWithEditability, any>>;
  autoFocusOnFirstInput?: boolean;
}

const IdeaNoteFormModal: React.FC<IdeaNoteModalProps> = ({
  isOpen,
  values,
  onClose,
  onSubmit,
  autoFocusOnFirstInput
}) => {
  const addTag = (tag: IdeaTag, tags: IdeaTag[]) => {
    return tags.concat(tag).sort((tag1, tag2) => tag1.label.localeCompare(tag2.label));
  };

  return (
    <Formik
      initialValues={values}
      validate={(values: IdeaValues) => {
        const errors: FormikErrors<IdeaValues> = {};

        if (!values.summary) {
          errors.summary = "Required";
        }

        return errors;
      }}
      onSubmit={(values: IdeaValues, { setSubmitting }) => {
        onSubmit(values).then(response => {
          setSubmitting(false);
        });
      }}
      render={({
        values,
        errors,
        dirty,
        isValid,
        isSubmitting,
        submitForm,
        handleBlur,
        setFieldValue,
      }) => {
        return (
          <Modal
            className="ideaNoteModal"
            show={isOpen}
            size="lg"
            scrollable
            onHide={onClose}
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Idea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Form.Label>Colour</Form.Label>
                <ColourSelector
                  selectedColour={values.colour}
                  onClickColour={newColour =>
                    !isSubmitting && setFieldValue(IdeaProperties.COLOUR, newColour)
                  }
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>Idea Title</Form.Label>
                <LengthRestrictedInput
                  value={values.summary}
                  inputName={IdeaProperties.SUMMARY}
                  characterLimit={IdeaValidation.IDEA_SUMMARY_CHAR_LIMIT}
                  onTruncatedValueChange={(fieldName, fieldValue) => {
                    setFieldValue(fieldName, fieldValue);
                  }}
                  formControlProps={{
                    disabled: isSubmitting
                  }}
                  rows="1"
                  autoFocus={autoFocusOnFirstInput}
                  onBlur={handleBlur}
                />
                {errors.summary && (
                  <FormFieldErrorMessage touched={true} error={errors.summary} />
                )}
              </FormGroup>
              <FormGroup>
                <Form.Label>Idea Description</Form.Label>
                <LengthRestrictedInput
                  value={values.description}
                  inputName={IdeaProperties.DESCRIPTION}
                  characterLimit={IdeaValidation.IDEA_CHAR_LIMIT}
                  onTruncatedValueChange={(fieldName, fieldValue) => {
                    setFieldValue(fieldName, fieldValue);
                  }}
                  formControlProps={{
                    disabled: isSubmitting
                  }}
                  rows="3"
                  onBlur={handleBlur}
                />
              </FormGroup>
              <FormGroup>
                <FormLabelWithTooltip
                  inputLabel="Tags"
                  tooltipProps={{
                    title: "Categorize Ideas with Tags",
                    content:
                      "Ideas can be searched by their tag values. Click the plus icon to add a tag."
                  }}
                />
                <TagListEditor
                  tags={values.tags}
                  onCancelAddingTag={() => {
                  }}
                  onRemoveTag={tag => {
                    setFieldValue(IdeaProperties.TAGS, removeEqualTag(values.tags, tag));

                  }}
                  onAddTag={newTag => {
                    const updatedTagList = addTag(newTag, values.tags);
                    setFieldValue(IdeaProperties.TAGS, updatedTagList);
                  }}
                  disabled={isSubmitting}
                />
              </FormGroup>
            </Modal.Body>
            <ModalFooterSaveControl
              isSaving={isSubmitting}
              isSavingAllowed={dirty && isValid}
              onClickSave={() => {
                submitForm();
              }}
            />
          </Modal>
        );
      }}
    />
  );
};

IdeaNoteFormModal.defaultProps = {
  values: {
    summary: "",
    description: "",
    colour: IdeaColour.YELLOW,
    tags: []
  },
  autoFocusOnFirstInput: false
};

export default IdeaNoteFormModal;
