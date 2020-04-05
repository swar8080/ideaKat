/**
 * @prettier
 */

import { History } from "history";
import * as React from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.scss";
import { Button } from "react-bootstrap";
import { LOGIN, REGISTER } from "../../routing/uiroutes";
const {default: LandingPageMeerkats} = require("../../assets/landing-page-meerkats.png");

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = (props: LandingPageProps) => {
  const history: History = useHistory();

  React.useEffect(() => {
    document.title = "ideaKat";
  }, [])

  return (
    <div className="landingPage">
      <div className="landingPage__main">
        <div className="landingPage__mainContent">
          <div className="landingPage__heading">
            <div className="landingPage__mainHeading">Be on the lookout</div>
            <div className="landingPage__subHeading">for ways to improve your team</div>
          </div>
          <div className="landingPage__description">
            <ul className="landingPage__descriptionList">
              <li>Prioritize discussions that are important to your team's success</li>
              <li>Invite team members to contribute ideas</li>
              <li>Create multiple teams for different projects or departments</li>
              <li>Open Source</li>
            </ul>
            <div className="landingPage__mainActionControls">
              <div className="landingPage-action-control">
                <Button
                  className="landingPage__loginActionControl"
                  variant="info"
                  onClick={() => history.push(LOGIN)}
                >
                  Login
                </Button>
              </div>
              <div className="landingPage-action-control">
                <Button
                  className="landingPage__registerActionControl"
                  variant="info"
                  onClick={() => history.push(REGISTER)}
                >
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="landingPage__mainPhotoEnd">
          <img src={String(LandingPageMeerkats)} />
          <div className="landingPage__mainPhotoEndOverlay" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
