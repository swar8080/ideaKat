/**
 * @prettier
 */

import * as React from "react";
import ProfileForm from "./ProfileForm";
import RegistrationRepository from "../../repository/RegistrationRepository";
import { JoinByInviteContract } from "./model";
import AuthContext from "../../common/auth/AuthContext";
import useTabTitle from "../../routing/useTabTitle";
import { useHistory } from "react-router-dom";
import { History } from "history";
import { HOME, SHOW_HELP_MODAL_URL_PARAM } from "../../routing/uiroutes";

interface JoinByInviteControllerProps {
  confirmationCode: string;
}

const JoinByInviteController: React.FC<JoinByInviteControllerProps> = ({ confirmationCode }) => {
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const authContext = React.useContext(AuthContext);
  const history: History = useHistory();
  useTabTitle("Register");

  return (
    <div className='ideakat-form'>
      <div className='ideakat-form-header'>Account Details</div>
      <ProfileForm
        handleFormComplete={values => {
          const request: JoinByInviteContract = {
            confirmationCode,
            userProfileDetails: values
          };

          return RegistrationRepository.joinByInvite(request)
            .then(response => {
              if (response.successful) {
                authContext.setAuthenticationStatus(response.data);
                history.replace(`${HOME}?${SHOW_HELP_MODAL_URL_PARAM}=true`);
              } else if (!response.hasErrors) {
                //input data is valid but there was a different error on the back-end
                setErrorMessage(response.responseMessage);
              }

              return response.errors;
            })
            .catch(() => {
              setErrorMessage("Unable to complete registration");
              return undefined;
            });
        }}
        submitButtonLabel={"Join"}
      />
      {errorMessage && <div className='ideakat-form-error-message'>{errorMessage}</div>}
    </div>
  );
};

export default JoinByInviteController;
