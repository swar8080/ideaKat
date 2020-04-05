/**
 * @prettier
 */

import * as React from "react";
import GroupRepository from "../../repository/GroupRepository";
import { Link, useHistory } from "react-router-dom";
import { makeGroupTopicsPath, CREATE_GROUP, makeEditGroupPath } from "../../routing/uiroutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { Button, Tooltip, OverlayTrigger, TooltipProps, Modal } from "react-bootstrap";
import "./GroupPage.scss";
import useTabTitle from "../../routing/useTabTitle";
import { GroupPageGroup } from "./model";
import { onEnterKeyPressed } from "../../common/forms/keyPressListener";
const { default: HelpModalGroupImage } = require("../../assets/helpmodal/groups.png");
const { default: HelpModalTopicImage } = require("../../assets/helpmodal/topics.png");
const { default: HelpModalIdeaImage } = require("../../assets/helpmodal/ideas.png");
const { default: HelpModalInviteImage } = require("../../assets/helpmodal/invite.png");

interface GroupPageProps {
    initiallyShowHelpModal: boolean;
}

const GroupPage: React.FC<GroupPageProps> = ({ initiallyShowHelpModal }) => {
    const [groups, setGroups] = React.useState<GroupPageGroup[]>();

    React.useEffect(() => {
        GroupRepository.getGroupsOrderedByActivityCount().then(groups => setGroups(groups));
    }, []);

    return <GroupPageComponent groups={groups} initiallyShowHelpModal={initiallyShowHelpModal} />;
};

interface GroupLinkWithDescriptionTooltipProps {
    group: GroupPageGroup;
}

const GroupLinkWithDescriptionTooltip: React.FC<GroupLinkWithDescriptionTooltipProps> = ({
    group
}) => {
    const groupDescriptionTooltip = (props: TooltipProps) => {
        return (
            <Tooltip {...props} placement="top" id={`group-description-tooltip-${group.groupId}`}>
                {group.description}
            </Tooltip>
        );
    };

    const link = (
        <Link to={makeGroupTopicsPath(group.groupId)} className={"groupsPage__groupTopicsLink"}>
            {group.groupName}
        </Link>
    );

    if (!!group.description) {
        return (
            <OverlayTrigger
                overlay={groupDescriptionTooltip}
                delay={150}
                /* https://github.com/react-bootstrap/react-bootstrap/issues/3393 */
                popperConfig={{
                    modifiers: {
                        preventOverflow: {
                            enabled: false
                        }
                    }
                }}
            >
                {link}
            </OverlayTrigger>
        );
    } else {
        return link;
    }
};

interface GroupPageComponentProps {
    groups: GroupPageGroup[];
    initiallyShowHelpModal?: boolean;
}

export const GroupPageComponent: React.FC<GroupPageComponentProps> = ({
    groups,
    initiallyShowHelpModal
}) => {
    const [showHelpModal, setShowHelpModal] = React.useState(initiallyShowHelpModal);
    const history = useHistory();
    useTabTitle("Groups");

    React.useEffect(() => {
        setShowHelpModal(initiallyShowHelpModal);
    }, [initiallyShowHelpModal]);

    const activityCountTitle = (count: number) =>
        `${count} discussion${count > 1 ? "s" : ""} with new activity`;

    const handleClickEditGroup = (groupId: number) => {
        const editGroupPath = makeEditGroupPath(groupId);
        history.push(editGroupPath);
    };

    return (
        <div className="groupsPage">
            <div className="groupsPage__header">
                <h1 className="groupsPage__headerText">Groups</h1>
                <div
                    className="groupsPage__headerHelpIcon"
                    onClick={() => setShowHelpModal(true)}
                    onKeyPress={e => onEnterKeyPressed(e, () => setShowHelpModal(true))}
                    title="Show help"
                    tabIndex={0}
                >
                    <FontAwesomeIcon icon={faQuestionCircle} size="1x" color={"blue"} />
                </div>
            </div>
            <div className="groupsPage__groupList">
                {groups &&
                    groups.map(group => (
                        <div className="groupsPage__groupListItem" key={group.groupId}>
                            <div className="groupsPage__groupListItemImage">
                                {(group.imageUrl && <img src={group.imageUrl} />) || (
                                    <FontAwesomeIcon icon={faUsers} size="sm" />
                                )}
                            </div>
                            <GroupLinkWithDescriptionTooltip group={group} />
                            {group.activityCount > 0 && (
                                <div
                                    className="groupsPage__groupActivityCount"
                                    title={activityCountTitle(group.activityCount)}
                                >
                                    +{group.activityCount}
                                </div>
                            )}
                            {group.isEditable && (
                                <div
                                    className="groupsPage__editGroup"
                                    //@ts-ignore
                                    tabIndex="0"
                                    onClick={() => handleClickEditGroup(group.groupId)}
                                    title="Edit"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            <div className="divider" />
            <Button
                onClick={() => history.push(CREATE_GROUP)}
                variant="outline-success"
                className="groupsPage__createButton"
            >
                <FontAwesomeIcon icon={faPlusCircle} size="1x" />
                <span>Create Group</span>
            </Button>
            {showHelpModal && (
                <Modal onHide={() => setShowHelpModal(false)} size="xl" show>
                    <Modal.Header closeButton>
                        <Modal.Title className="groupsPage__helpModalTitle">ideaKat</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="groupsPage__helpModalBody">
                        <div className="groupsPage__helpStatement">
                            <i>Groups</i> organize <i>discussions</i> with your team that have a
                            similar theme:
                        </div>
                        <img src={HelpModalGroupImage} />
                        <div className="groupsPage__helpStatement">
                            Within a group, team members can create, view, and prioritize
                            discussions:
                        </div>
                        <img src={HelpModalTopicImage} />
                        <div className="groupsPage__helpStatement">
                            Team members can contribute their <i>ideas</i> to each discussion:
                        </div>
                        <img src={HelpModalIdeaImage} />
                        <div className="groupsPage__helpStatement">
                            To invite team members, click the icon in the header:
                        </div>
                        <img src={HelpModalInviteImage} />
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

GroupPage.defaultProps = {
    initiallyShowHelpModal: false
};

export default GroupPage;
