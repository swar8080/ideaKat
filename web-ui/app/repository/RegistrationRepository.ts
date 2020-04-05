/**
 * @prettier
 */

import {
  OrganizationInputsContract,
  ProfileInputsContract,
  OrganizationRegistrationContract,
  UserInviteContract,
  JoinByInviteContract,
} from "../pages/account/model";
import { APIResponse } from "./APIResponse";
import { REGISTER_API_PATH, ADMIN_API_PATH } from "../routing/apiroutes";
import { AuthenticationStatus } from "../common/auth";
import { postJsonWithJsonResponse, postFormdataJsonResponse } from "./fetchUtil";

interface RegistrationRepository {
  validateOrganizationInputs: (
    values: OrganizationInputsContract
  ) => Promise<APIResponse<any, OrganizationInputsContract>>;
  validateUserProfile: (
    values: ProfileInputsContract
  ) => Promise<APIResponse<any, ProfileInputsContract>>;
  completeTeamRegistration: (
    values: OrganizationRegistrationContract
  ) => Promise<APIResponse<any, ProfileInputsContract>>;
  inviteUser: (values: UserInviteContract) => Promise<APIResponse<any, UserInviteContract>>;
  joinByInvite: (
    values: JoinByInviteContract
  ) => Promise<APIResponse<AuthenticationStatus, ProfileInputsContract>>;
}

const RegistrationRepositoryImpl: RegistrationRepository = {
  validateOrganizationInputs: values => {
    return postJsonWithJsonResponse(`${REGISTER_API_PATH}/validate/org`, values);
  },
  validateUserProfile: values => {
    return postJsonWithJsonResponse(`${REGISTER_API_PATH}/validate/profile`, values);
  },
  completeTeamRegistration: values => {
    const formData = new FormData();
    
    formData.append("registrationDetails", new Blob([JSON.stringify({
      organizationDetails: values.organizationDetails,
      tenantAdminDetails: {
        fullName: values.tenantAdminDetails.fullName,
        password: values.tenantAdminDetails.password
      }
    })], {type: "application/json"}))
    formData.append("profileImage", values.tenantAdminDetails.profileImage);

    return postFormdataJsonResponse(`${REGISTER_API_PATH}/team`, formData);
  },
  inviteUser: values => {
    return postJsonWithJsonResponse(`${ADMIN_API_PATH}/invite`, values);
  },
  joinByInvite: values => {
    const formData = new FormData();
    
    formData.append("registrationDetails", new Blob([JSON.stringify({
      confirmationCode: values.confirmationCode,
      userProfileDetails: {
        fullName: values.userProfileDetails.fullName,
        password: values.userProfileDetails.password
      }
    })], {type: "application/json"}))
    formData.append("profileImage", values.userProfileDetails.profileImage);

    return postFormdataJsonResponse(`${REGISTER_API_PATH}/invite/complete`, formData);
  }
};

export default RegistrationRepositoryImpl;
