export interface ProfileInputsContract {
    fullName: string,
    password: string,
    profileImage?: File
}

export interface OrganizationInputsContract {
    organizationName: string
    adminEmail: string,
}

export interface OrganizationRegistrationContract {
    organizationDetails: OrganizationInputsContract,
    tenantAdminDetails: ProfileInputsContract
}

export interface UserInviteContract {
    userEmail: string
}

export interface JoinByInviteContract {
    confirmationCode: string,
    userProfileDetails: ProfileInputsContract
}

export interface ResetPasswordContract {
    confirmationCode: string,
    newPassword: string
}

export interface EditProfileContract {
    displayName: string,
    profileImage?: File,
    clearingProfileImage: boolean
}
