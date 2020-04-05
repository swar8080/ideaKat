/**
 * @prettier
 */

import * as React from "react";
import "./GroupTopic.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons/faThumbtack";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faStickyNote } from "@fortawesome/free-regular-svg-icons/faStickyNote";
import classNames from "classnames";
import { useRef, useState } from "react";
import ControlButton from "../../../../common/buttons/ControlButton";
import { TopicCardWithEditability } from "../../../../model/topic";
import renderLinkedControlButton from "../../../../common/buttons/LinkedControlButton";
import ProfileImage from "../../../../common/ProfileImage";
import { makeGroupTopicIdeaPath } from "../../../../routing/uiroutes";

interface IProps {
    topic: TopicCardWithEditability;
    onClickEditTopic: (topicId: number) => void;
    onClickPinnedIcon: (topicId: number) => void;
    onClickDelete: (topicId: number) => void;
}

const descriptionTruncationInitialState = {
    hasTestedTextOverflow: false,
    doesTextOverflow: false,
    isUserRequestingTruncation: true
};

const GroupTopic: React.FC<IProps> = ({
    topic,
    onClickEditTopic,
    onClickPinnedIcon,
    onClickDelete
}) => {
    const [truncation, setTruncation] = useState(descriptionTruncationInitialState);
    const descriptionRef = useRef(null);

    React.useEffect(() => {
        //re-test for truncation whenever the description changes
        setTruncation(prev => ({
            ...prev,
            hasTestedTextOverflow: false
        }));
    }, [topic.model.description]);

    React.useEffect(() => {
        if (!truncation.hasTestedTextOverflow && descriptionRef.current) {
            //When overflow is untested, the text will not be truncated
            //so can show the expand button only when the text would actually be cut-off
            const doesTextOverflow =
                descriptionRef.current.offsetHeight < descriptionRef.current.scrollHeight;

            setTruncation(prev => ({
                ...prev,
                hasTestedTextOverflow: true,
                doesTextOverflow
            }));
        }
    });

    function onUserToggleTruncation() {
        setTruncation(prev => ({
            ...truncation,
            isUserRequestingTruncation: !prev.isUserRequestingTruncation
        }));
    }

    const truncateDescription =
        !truncation.hasTestedTextOverflow ||
        (truncation.doesTextOverflow && truncation.isUserRequestingTruncation);
    const showExpandDescription = truncation.hasTestedTextOverflow && truncation.doesTextOverflow;

    function getPinTitle(topic: TopicCardWithEditability): string {
        if (topic.isPinnable) {
            return topic.model.pinned ? "Unpin Topic" : "Pin Topic";
        } else {
            return topic.model.pinned ? "Pinned Topic" : "Unpinned Topic";
        }
    }

    const hasDescription = topic.model.description.length > 0;
    return (
        <div className="groupTopicCard">
            <div
                className={classNames("groupTopicCard__heading", {
                    "groupTopicCard__heading--summary-only": !hasDescription
                })}
            >
                <ProfileImage
                    imageUrl={topic.model.author.imageUrl}
                    username={topic.model.author.name}
                    containerClassName="groupTopicCard__userAvatar"
                    size="lg"
                />
                <div className="groupTopicCard__summaryContainer">
                    <div className="groupTopicCard__summaryText">{topic.model.summary}</div>
                </div>
                <div className="groupTopicCard__icons">
                    {topic.isDeleteable && (
                        <div
                            className="groupTopicCard__deleteIcon"
                            onClick={() => onClickDelete(topic.model.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} title={"Delete"} size="sm" />
                        </div>
                    )}
                    {(topic.model.pinned || topic.isPinnable) && (
                        <div
                            className={classNames({
                                groupTopicCard__pinnedIcon: true,
                                pinned: topic.model.pinned,
                                unpinned: !topic.model.pinned,
                                pinnable: topic.isPinnable && !topic.model.pinned,
                                unpinnable: topic.isPinnable && topic.model.pinned
                            })}
                            onClick={() => onClickPinnedIcon(topic.model.id)}
                        >
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                title={getPinTitle(topic)}
                                size="sm"
                            />
                        </div>
                    )}
                </div>
            </div>
            {hasDescription && (
                <>
                    <Divider />
                    <div className="groupTopicCard__description">
                        <div
                            className={classNames("groupTopicCard__descriptionText", {
                                truncate: truncateDescription
                            })}
                            ref={descriptionRef}
                        >
                            {topic.model.description}
                        </div>
                        {showExpandDescription && (
                            <div
                                className="groupTopicCard__expandDescription"
                                onClick={() => onUserToggleTruncation()}
                                title="Expand"
                            >
                                <FontAwesomeIcon icon={faEllipsisH} />
                            </div>
                        )}
                    </div>
                </>
            )}
            <Divider />
            <div className="groupTopicCard__controls">
                {renderLinkedControlButton({
                    text: `Add Idea`,
                    icon: faPlusCircle,
                    className: "addIdea",
                    urlPath: makeGroupTopicIdeaPath(topic.model.groupId, topic.model.id, true)
                })}
                {renderLinkedControlButton({
                    text: `View Ideas (${topic.ideaCount})`,
                    icon: faStickyNote,
                    className: "view",
                    disabled: topic.ideaCount <= 0,
                    urlPath: makeGroupTopicIdeaPath(topic.model.groupId, topic.model.id, false)
                })}
                {topic.isEditable && (
                    <ControlButton
                        text={"Edit"}
                        icon={faEdit}
                        className="edit"
                        identifier={EDIT_CLICK_IDENTIFIER}
                        onButtonClick={() => onClickEditTopic(topic.model.id)}
                    />
                )}
            </div>
        </div>
    );
};

const Divider = () => <div className="groupTopicCard__divider" />;

const EDIT_CLICK_IDENTIFIER = "edit identifier";

export default GroupTopic;
