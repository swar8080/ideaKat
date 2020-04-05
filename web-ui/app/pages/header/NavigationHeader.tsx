import { faUserCog } from "@fortawesome/free-solid-svg-icons/faUserCog";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import * as React from "react";
import { Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, match, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import AuthContext from "../../common/auth/AuthContext";
import { Group } from "../../model/group";
import GroupRepository from "../../repository/GroupRepository";
import UserRepository from "../../repository/UserRepository";
import {
    EDIT_PROFILE,
    GroupRouteProps,
    GROUP_ROUTE,
    HOME,
    INVITE,
    LOGIN,
    REGISTER,
    makeGroupTopicsPath
} from "../../routing/uiroutes";
import "./NavigationHeader.scss";
const { default: GithubLogo } = require("../../assets/github-logo.png");

interface NavigationHeaderProps {}

const NavigationHeader: React.FC<NavigationHeaderProps> = () => {
    const { isLoggedIn, isAdmin } = React.useContext(AuthContext).authenticationStatus;

    if (isLoggedIn) {
        return <AuthenticatedHeader isAdmin={isAdmin} />;
    } else {
        return <UnauthenticatedHeader />;
    }
};

interface HeaderProps {
    leftSection?: JSX.Element;
    middleSection?: JSX.Element;
    middleClassName?: string;
    rightSection?: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({
    leftSection,
    middleSection,
    middleClassName,
    rightSection
}) => {
    return (
        <Navbar bg="light" className="navigationHeader">
            <div className="navigationHeader__sections">
                <div className="navigationHeader__sections-section left">{leftSection}</div>
                <div
                    className={cn("navigationHeader__sections-section", "middle", middleClassName)}
                >
                    {middleSection}
                </div>
                <div className="navigationHeader__sections-section right">{rightSection}</div>
            </div>
        </Navbar>
    );
};

interface AuthenticatedHeaderProps {
    isAdmin: boolean;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ isAdmin }) => {
    const [group, setGroup] = React.useState<Group>();
    const groupRouteMatch: match<GroupRouteProps> = useRouteMatch<GroupRouteProps>(GROUP_ROUTE);
    const history = useHistory();

    React.useEffect(() => {
        if (groupRouteMatch && groupRouteMatch.params.groupId) {
            GroupRepository.getById(Number(groupRouteMatch.params.groupId)).then(setGroup);
        } else {
            setGroup(undefined);
        }
    }, [groupRouteMatch && groupRouteMatch.params.groupId]);

    const navigateToGroupDiscussions = () => {
        history.push(makeGroupTopicsPath(group.id));
    }   

    const hasGroup = !!group;
    const middleSection = hasGroup && (
        <>
            <div className="groupMiddleSection__groupImage" onClick={navigateToGroupDiscussions}>
                {!!group.imageUrl ? (
                    <img src={group.imageUrl} />
                ) : (
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                )}
            </div>
            <div className="groupMiddleSection__groupName" onClick={navigateToGroupDiscussions}>{group.groupName}</div>
        </>
    );
    const middleClassName = hasGroup && "groupMiddleSection";

    const leftSection = (
        <>
            <NavigationHeaderLogo />
            {isAdmin && (
                <>
                    <div className="header-navigation-divider" />
                    <div
                        onClick={() => history.push(INVITE)}
                        className="navigationHeader__inviteIcon navigationHeader-icon-control"
                    >
                        <FontAwesomeIcon
                            icon={faUserPlus}
                            title={"Invite team members"}
                            className="navigationHeader-icon"
                            size={"1x"}
                        />
                    </div>
                    <div className="header-navigation-divider" />
                </>
            )}
        </>
    );

    const rightSection = (
        <div className="header-navigation-links">
            <div className="header-navigation-divider" />
            <div
                onClick={() => history.push(EDIT_PROFILE)}
                className="navigationHeader__editProfileIcon navigationHeader-icon-control"
            >
                <FontAwesomeIcon
                    icon={faUserCog}
                    title={"Edit Profile"}
                    className="navigationHeader-icon"
                    size={"1x"}
                />
            </div>
            <div className="header-navigation-divider" />
            <a
                href="#"
                className="header-navigation-link"
                onClick={e => {
                    e.preventDefault();
                    UserRepository.logout();
                }}
            >
                Logout
            </a>
        </div>
    );

    return (
        <Header
            leftSection={leftSection}
            middleSection={middleSection}
            middleClassName={middleClassName}
            rightSection={rightSection}
        />
    );
};

const UnauthenticatedHeader = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === LOGIN;

    const rightSectionRoute = isLoginPage ? REGISTER : LOGIN;
    const rightSectionRouteText = isLoginPage ? "Register" : "Login";
    const rightSection = (
        <div className="header-navigation-links">
            <div className="header-navigation-divider" />
            <a
                href="https://github.com/swar8080/ideaKat"
                className="navigationHeader__githubLogoLink"
                target="_blank"
                title="View on Github"
            >
                <img src={GithubLogo} />
            </a>
            <div className="header-navigation-divider" />
            <Link to={rightSectionRoute} className="header-navigation-link">
                {rightSectionRouteText}
            </Link>
        </div>
    );

    return <Header leftSection={<NavigationHeaderLogo />} rightSection={rightSection} />;
};

const NavigationHeaderLogo = () => {
    return (
        <LinkContainer to={HOME}>
            <div className="navigationHeader__logo" title="Home">
                ideaKat
            </div>
        </LinkContainer>
    );
};

export default NavigationHeader;
