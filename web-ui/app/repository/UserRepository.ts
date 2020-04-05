/**
 * @prettier
 */

import { AuthenticationStatus } from "../common/auth";
import { APIResponse } from "./APIResponse";
import { loginApiUrl, LOGIN_API_PATH, USER_API_PATH } from "../routing/apiroutes";
import { ResetPasswordContract, EditProfileContract } from "../pages/account/model";
import {
  postFormdataJsonResponse,
  getJsonResponse,
  postJsonWithJsonResponse,
  postRawResponse
} from "./fetchUtil";
import { UserProfile } from "../model/user";

interface UserRepository {
  getAuthenticationStatus: () => Promise<APIResponse<AuthenticationStatus, void>>;
  login: (email: string, password: string) => Promise<APIResponse<AuthenticationStatus, void>>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<APIResponse<void, void>>;
  resetPassword: (
    resetRequest: ResetPasswordContract
  ) => Promise<APIResponse<AuthenticationStatus, ResetPasswordContract>>;
  getProfile: () => Promise<UserProfile>,
  editProfile: (
    editProfileRequest: EditProfileContract
  ) => Promise<APIResponse<void, EditProfileContract>>;
}

const UserRepositoryImpl: UserRepository = {
  getAuthenticationStatus: () => {
    return getJsonResponse(loginApiUrl("/getAuthenticationStatus"));
  },
  login: (email: string, password: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    return postFormdataJsonResponse(`${LOGIN_API_PATH}`, formData);
  },
  logout: () => {
    postRawResponse("/logout").then(() => {
      window.location.replace("/");
    });
  },
  requestPasswordReset: (email: string) => {
    const formData = new FormData();
    formData.append("email", email);

    return postFormdataJsonResponse(`/public/api/request-reset`, formData);
  },
  resetPassword: (resetRequest: ResetPasswordContract) => {
    return postJsonWithJsonResponse(`/public/api/reset-password`, resetRequest);
  },
  getProfile: () => {
    return getJsonResponse(`${USER_API_PATH}/profile`);
  },
  editProfile: (editProfileRequest: EditProfileContract) => {
    const formData = new FormData();
  
    formData.append("editProfileDetails", new Blob([JSON.stringify({
      displayName: editProfileRequest.displayName,
      clearingProfileImage: editProfileRequest.clearingProfileImage
    })], {type: "application/json"}));

    formData.append("profileImage", editProfileRequest.profileImage);

    return postFormdataJsonResponse(`${USER_API_PATH}/edit`, formData);
  }
};

export default UserRepositoryImpl;
