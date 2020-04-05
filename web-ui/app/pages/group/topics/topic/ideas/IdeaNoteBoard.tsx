/**
 * @prettier
 */

import * as React from "react";
import { IdeaColour, IdeaTag, IdeaWithEditability } from "../../../../../model/idea";
import { AddIdeaNote, IdeaNote } from "./idea/IdeaNote";
import "./IdeaNoteBoard.scss";

interface IProps {
    ideas: IdeaWithEditability[];
    onClickAddIdea?: () => void;
    onClickEditIdea?: (idea: IdeaWithEditability) => void;
    addIdeaColour?: IdeaColour;
    isFilteringOnTag: (tag: IdeaTag) => boolean;
}

const IdeaNoteBoard: React.FC<IProps> = ({
    ideas,
    onClickAddIdea,
    onClickEditIdea,
    addIdeaColour,
    isFilteringOnTag
}) => {
    const horizontalAlignment = {
        justifyContent: ideas.length <= 3 ? "flex-start" : "center"
    };

    return (
        <div className="ideaNoteBoard" style={horizontalAlignment}>
            <AddIdeaNote onClick={onClickAddIdea} noteColour={addIdeaColour} />
            {ideas.map(idea => {
                return <IdeaNote idea={idea} onClickEdit={onClickEditIdea} key={idea.id} isFilteringOnTag={isFilteringOnTag} />;
            })}
        </div>
    );
};

IdeaNoteBoard.defaultProps = {
    onClickAddIdea: () => {},
    onClickEditIdea: () => {},
    addIdeaColour: IdeaColour.YELLOW
};

export default IdeaNoteBoard;
