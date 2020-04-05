/**
 * @prettier
 */

import * as React from "react";
import { imageUploadValidationMsg } from "./validationMessageHelper";

const useImageFormInput = () => {
    const [image, setImage] = React.useState<File>();
    const [imageValidationError, setImageValidationError] = React.useState<string>();

    const handleImageChange = (e: React.SyntheticEvent) => {
        const input = e.target as HTMLInputElement;
        if (input.files.length == 1) {
            const image = input.files[0];
            const imageError = imageUploadValidationMsg(image);

            if (!imageError) {
                setImage(image);
                setImageValidationError(undefined);
            } else {
                setImage(undefined);
                input.value = "";
                setImageValidationError(imageError);
            }
        }
    };

    return {
        image,
        imageValidationError,
        handleImageChange
    };
};

export default useImageFormInput;
