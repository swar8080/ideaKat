/**
 * @prettier
 */

import * as React from "react";
import RegistrationRepository from "../../repository/RegistrationRepository";
import "../../style/ideakat-form.scss";
import { OrganizationInputsContract, ProfileInputsContract } from "./model";
import OrganizationDetailsForm from "./OrganizationDetailsForm";
import ProfileForm from "./ProfileForm";
import "./RegistrationController.scss";
import useTabTitle from "../../routing/useTabTitle";

interface RegistrationControllerProps {}

enum RegistrationStage {
  ENTER_ORG_DETAILS,
  ENTER_ADMIN_DETAILS,
  COMPLETE,
  REGISTRATION_FAILED
}

interface RegistrationControllerState {
  organizationDetails: OrganizationInputsContract;
  registrationStage: RegistrationStage;
}

const RegistrationController: React.FC<RegistrationControllerProps> = (
  props: RegistrationControllerProps
) => {
  const [state, setState] = React.useState<RegistrationControllerState>({
    organizationDetails: undefined,
    registrationStage: RegistrationStage.ENTER_ORG_DETAILS
  });
  useTabTitle("Register a team");

  const handleOrganizationDetailsFormComplete = (values: OrganizationInputsContract) => {
    return RegistrationRepository.validateOrganizationInputs(values)
      .then(result => {
        if (result.successful) {
          setState(prevState => ({
            ...prevState,
            organizationDetails: values,
            registrationStage: RegistrationStage.ENTER_ADMIN_DETAILS
          }));
        }
        return result.errors;
      })
      .catch(handleFatalServeError);
  };

  const handleProfileDetailsFormComplete = (values: ProfileInputsContract) => {
    const validateableInputs = {
      fullName: values.fullName,
      password: values.password
    };

    return RegistrationRepository.validateUserProfile(validateableInputs).then(response => {
      if (!response.successful) {
        return response.errors;
      }

      return RegistrationRepository.completeTeamRegistration({
        organizationDetails: state.organizationDetails,
        tenantAdminDetails: values
      })
        .then(response => {
          setState(prevState => ({
            ...prevState,
            registrationStage: response.successful
              ? RegistrationStage.COMPLETE
              : RegistrationStage.REGISTRATION_FAILED
          }));
          return response.errors;
        })
        .catch(handleFatalServeError);
    });
  };

  function handleFatalServeError(): undefined {
    setState(prevState => ({
      ...prevState,
      registrationStage: RegistrationStage.REGISTRATION_FAILED
    }));
    return undefined;
  }

  let content;
  let headerMessage;
  if (RegistrationStage.ENTER_ORG_DETAILS === state.registrationStage) {
    content = (
      <OrganizationDetailsForm
        handleFormComplete={handleOrganizationDetailsFormComplete}
        submitButtonLabel={"Next"}
      />
    );
    headerMessage = "Create a Team";
  } else if (RegistrationStage.ENTER_ADMIN_DETAILS === state.registrationStage) {
    content = (
      <ProfileForm
        handleFormComplete={handleProfileDetailsFormComplete}
        submitButtonLabel={"Complete Registration"}
      />
    );
    headerMessage = "Account Details";
  } else if (RegistrationStage.COMPLETE === state.registrationStage) {
    content = <div className='registrationController__successRegistrationMessage'>Registration complete! Check your email for a confirmation message.</div>;
  } else if (RegistrationStage.REGISTRATION_FAILED === state.registrationStage) {
    headerMessage = "Registration Unsuccessful";
    content = (
      <div className="registrationController__failedRegistrationMessage">
        Unable to complete registration at this time
      </div>
    );
  }

  return (
    <div className="registrationPage ideakat-form">
      {headerMessage && <div className="ideakat-form-header">{headerMessage}</div>}
      <div>{content}</div>
    </div>
  );
};

export default RegistrationController;
