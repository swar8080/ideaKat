export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const INVITE = "/invite";
export const REQUEST_RESET_PASSWORD = "/reset-request";
export const EXPIRED_EMAIL_CONFIRMATION = "/expired-email"
export const EDIT_PROFILE = "/profile";

export const JOIN_BY_INVITE = "/join/:confirmationCode";
export const RESET_PASSWORD = "/reset/:confirmationCode";

export interface ConfirmationCodeRouteProps {
    confirmationCode: string
}

export const SHOW_HELP_MODAL_URL_PARAM = "showHelpModal";

export const GROUP_ROUTE = "/groups/:groupId(\\d+)";
export interface GroupRouteProps {
    groupId?: string
}
export const CREATE_GROUP = "/groups/create";

export const EDIT_GROUP = `${GROUP_ROUTE}/edit`;
export const makeEditGroupPath = (groupId: number) => `/groups/${groupId}/edit`;

export const GROUP_DISCUSSION_ROUTE = GROUP_ROUTE + "/discussions";
export const makeGroupTopicsPath = (groupId: number) => {
    return `/groups/${groupId}/discussions`;
}

export const GROUP_DISCUSSION_IDEA_ROUTE = GROUP_DISCUSSION_ROUTE + "/:topicId(\\d+)/ideas";
export interface GroupTopicIdeaRouteProps extends GroupRouteProps {
    topicId: string
}
export const makeGroupTopicIdeaPath = (groupId: number, topicId: number, createNew: boolean) => {
    let base = `${makeGroupTopicsPath(groupId)}/${topicId}/ideas`;
    if (createNew){
        base += "?create=true"
    }
    return base;
}
