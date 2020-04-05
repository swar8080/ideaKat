/**
 * @prettier
 */

export const minCharMsg = (min: number) => `Minimum of ${min} characters required`;
export const maxCharMsg = (max: number) => `Maximum of ${max} characters`;
export const REQUIRED_MSG = "Required";
export const INVALID_EMAIL = "Invalid email";

const MAX_PROFILE_IMAGE_SIZE_MB = 1;
const MAX_PROFILE_IMAGE_SIZE_B = MAX_PROFILE_IMAGE_SIZE_MB * 1000000;

export const imageUploadValidationMsg = (file: File): string | null => {
    if (file.size > MAX_PROFILE_IMAGE_SIZE_B){
        return `Image size must be less than ${MAX_PROFILE_IMAGE_SIZE_MB}MB` ;
    }
    return null;
}