import * as React from "react";
import "./TagListEditor.scss";
import { IdeaTag } from "../../../../../../../model/idea";
import { RemovableIdeaNoteTag, EditableIdeaNoteTag } from "./IdeaNoteTag";
import { useState } from "react";

interface TagListEditorProps {
  tags: IdeaTag[];
  onTagChange?: (tag: IdeaTag, isValid: boolean) => void;
  onRemoveTag?: (tag: IdeaTag) => void;
  onCancelAddingTag?: () => void;
  onAddTag?: (tag: IdeaTag) => void;
  disabled?: boolean;
}

export const removeEqualTag: (tags: IdeaTag[], toRemove: IdeaTag) => IdeaTag[] = (
  tags,
  toRemove
) => {
  return tags.filter(tag => tag.label !== toRemove.label);
};

const TagListEditor: React.FC<TagListEditorProps> = ({
  tags,
  onTagChange,
  onRemoveTag,
  onAddTag,
  onCancelAddingTag,
  disabled
}) => {
  const [newTagState, setNewTagState] = useState({
    isAddingTag: false,
    label: undefined
  });

  React.useEffect(() => {
    disabled &&
      setNewTagState({
        isAddingTag: false,
        label: undefined
      });
  }, [disabled]);

  function onClickAddTag() {
    !disabled &&
      setNewTagState({
        isAddingTag: true,
        label: ""
      });
  }

  function onChangeLabel(label: string) {
    const tag = { label };
    onTagChange(tag, hasValidLabel(label));

    setNewTagState({
      isAddingTag: true,
      label: label || ""
    });
  }

  function onCancelEditingTag() {
    onCancelAddingTag();
    setNewTagState({
      isAddingTag: false,
      label: undefined
    });
  }

  function onFinishEditingTag() {
    if (hasValidLabel(newTagState.label)) {
      const newTag = { label: newTagState.label };
      onAddTag(newTag);

      setNewTagState({
        isAddingTag: true,
        label: ""
      });
    }
  }

  function hasValidLabel(label: string): boolean {
    if (!label) {
      return false;
    }

    const duplicate = tags.find(tag => tag.label.toUpperCase() === label.toUpperCase());
    return !duplicate;
  }

  const canFinishEditingLabel = hasValidLabel(newTagState.label);
  return (
    <div className="tagSelector">
      {tags.map(tag => {
        return (
          <RemovableIdeaNoteTag tag={tag} onClickRemove={() => onRemoveTag(tag)} key={tag.label} />
        );
      })}
      <EditableIdeaNoteTag
        isEditing={newTagState.isAddingTag}
        label={newTagState.label}
        onClickAdd={onClickAddTag}
        onChangeLabel={onChangeLabel}
        onCancelEditingLabel={onCancelEditingTag}
        canFinishEditingLabel={canFinishEditingLabel}
        onFinishEditingLabel={onFinishEditingTag}
      />
    </div>
  );
};

TagListEditor.defaultProps = {
  disabled: false,
  onAddTag: () => {},
  onCancelAddingTag: () => {},
  onRemoveTag: () => {},
  onTagChange: () => {}
};

export default TagListEditor;
