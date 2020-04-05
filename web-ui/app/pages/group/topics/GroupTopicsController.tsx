/**
 * @prettier
 */

import * as qs from "qs";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { Group } from "../../../model/group";
import GroupRepository from "../../../repository/GroupRepository";
import { EDIT_GROUP, GroupRouteProps, GroupTopicIdeaRouteProps, GROUP_DISCUSSION_IDEA_ROUTE, GROUP_DISCUSSION_ROUTE } from "../../../routing/uiroutes";
import GroupEditController from "../GroupEditController";
import GroupTopicsPage from "./GroupTopicsPage";
import TopicIdeasPage from "./topic/ideas/TopicIdeasPage";

interface GroupTopicsControllerProps {
    groupId?: number;
}

const GroupTopicsController: React.FC<GroupTopicsControllerProps> = ({ groupId }) => {
    const [group, setGroup] = React.useState<Group>();

    React.useEffect(() => {
        GroupRepository.getById(groupId).then(setGroup);
    }, [groupId]);

    if (!group) {
        return null;
    }

    return (
        <>
            <Route
                exact
                path={GROUP_DISCUSSION_ROUTE}
                component={() => <GroupTopicsPage group={group} />}
            />
            <Route
                exact
                path={GROUP_DISCUSSION_IDEA_ROUTE}
                component={(routeProps: RouteComponentProps<GroupTopicIdeaRouteProps>) => {
                    const urlParams = qs.parse(routeProps.location.search, {
                        ignoreQueryPrefix: true
                    });
                    const isAddingIdea: boolean = urlParams && urlParams.create === "true";
                    return (
                        <TopicIdeasPage
                            group={group}
                            topicId={Number(routeProps.match.params.topicId)}
                            isAddingIdea={isAddingIdea}
                        />
                    );
                }}
            />
        </>
    );
};

export default GroupTopicsController;
