/**
 * @prettier
 */

import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useRef, useState } from "react";
import ProfileImage from "../../../../../../common/ProfileImage";
import { IdeaColour, IdeaColourValues, IdeaWithEditability, IdeaTag } from "../../../../../../model/idea";
import "./IdeaNote.scss";
import IdeaNoteTag from "./tag/IdeaNoteTag";

interface IdeaNoteProps {
  idea: IdeaWithEditability;
  onClickEdit: (idea: IdeaWithEditability) => void;
  isFilteringOnTag: (tag: IdeaTag) => boolean;
}

const IdeaNote: React.FC<IdeaNoteProps> = ({ idea, onClickEdit, isFilteringOnTag }) => {
  const containerRef = useRef(undefined);
  const [resizeStyle] = useHeightEqualToWidth(containerRef);

  const style: React.CSSProperties = {
    ...resizeStyle,
    backgroundColor: IdeaColourValues[idea.colour]
  };

  return (
    <div className="ideaNote" ref={containerRef} style={style}>
      <div className="ideaNote__header">
        <ProfileImage
          imageUrl={idea.author.imageUrl}
          username={idea.author.name}
          containerClassName={"ideaNote__avatar"}
          size="lg"
        />
        <div className="ideaNote__summary">{idea.summary}</div>
        {idea.isEditable && (
          <div className="ideaNote__controls">
            <div className="ideaNote__editControl" title="Edit" onClick={() => onClickEdit(idea)}>
              <FontAwesomeIcon icon={faEdit} size="sm" />
            </div>
          </div>
        )}
      </div>
      <div className="ideaNote__description">{idea.description}</div>
      {idea.tags.length > 0 && (
        <div className="ideaNote__tags">
          {idea.tags.map(tag => {
            return <IdeaNoteTag tag={tag} key={tag.label} selected={isFilteringOnTag(tag)} />;
          })}
        </div>
      )}
    </div>
  );
};

interface AddIdeaNoteProps {
  onClick: () => void;
  noteColour?: IdeaColour;
}

const AddIdeaNote: React.FC<AddIdeaNoteProps> = ({ onClick, noteColour }) => {
  const containerRef = useRef(null);
  const [resizeStyle] = useHeightEqualToWidth(containerRef);

  const style = {
    ...resizeStyle,
    backgroundColor: IdeaColourValues[noteColour]
  };

  return (
    <div
      className="ideaNote addIdeaNote"
      style={style}
      title="Add Idea"
      onClick={onClick}
      ref={containerRef}
    >
      <FontAwesomeIcon className="addIdeaNote__plusIcon" icon={faPlus} size="3x" />
    </div>
  );
};

AddIdeaNote.defaultProps = {
  noteColour: IdeaColour.YELLOW
};

const useHeightEqualToWidth = (containerRef: React.MutableRefObject<any>) => {
  const [dimensionStatus, setDimensionStatus] = useState({
    hasTestedDimension: false,
    dimensionPx: 0
  });

  React.useEffect(() => {
    if (!dimensionStatus.hasTestedDimension && containerRef.current) {
      setDimensionStatus({
        hasTestedDimension: true,
        dimensionPx: parseInt(window.getComputedStyle(containerRef.current).width)
      });
    }
  }, [dimensionStatus.hasTestedDimension]);

  React.useEffect(() => {
    const resizeListener = () => {
      setDimensionStatus({
        hasTestedDimension: false,
        dimensionPx: 0
      });
    };

    window.addEventListener("resize", resizeListener);

    return () => window.removeEventListener("resize", resizeListener);
  });

  const resizedHeight = dimensionStatus.dimensionPx * 0.95;
  const resizeStyle: React.CSSProperties = {
    visibility: dimensionStatus.hasTestedDimension ? "visible" : "hidden",
    height: resizedHeight.toString() + "px"
  };

  return [resizeStyle];
};

export { IdeaNote, AddIdeaNote };

