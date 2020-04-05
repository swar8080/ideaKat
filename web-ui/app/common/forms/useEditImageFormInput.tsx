/**
 * @prettier
 */

import * as React from "react";
import "./useEditImageFormInput.scss";
import { Form } from "react-bootstrap";
import FormFieldErrorMessage from "./FormFieldErrorMessage";
import useImageFormInput from "./useImageFormInput";

const useEditImageFormInput = (existingImageUrl?: string) => {
    const [clearingImage, setClearingImage] = React.useState(false);
    const { image, imageValidationError, handleImageChange } = useImageFormInput();
    const imageInputRef = React.useRef();

    const showImageInput = !existingImageUrl || !!image || !!imageValidationError || clearingImage;

    const hasImageChanged = clearingImage || !!image;

    const handleUploadNewImage = () => {
        const input = imageInputRef.current as HTMLElement;
        input.click();
    };

    const handleRemoveImage = () => {
        setClearingImage(true);
    };

    const editImageFormInput = (
        <>
            {!showImageInput && (
                <div className="editImageFormInput">
                    <img src={existingImageUrl} />
                    <div className="editImageFormInput__controls">
                        <button
                            className="editImageFormInput__uploadImage"
                            onClick={handleUploadNewImage}
                        >
                            Upload Image
                        </button>
                        <button
                            className="editImageFormInput__removeImage"
                            onClick={handleRemoveImage}
                        >
                            Remove Image
                        </button>
                    </div>
                </div>
            )}
            <Form.Control
                as="input"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={{
                    display: showImageInput ? "initial" : "none"
                }}
                ref={imageInputRef}
            />
            <FormFieldErrorMessage
                touched={!!imageValidationError}
                error={imageValidationError}
                className="ideakat-form-field-error"
            />
        </>
    );

    return {
        image,
        clearingImage,
        editImageFormInput,
        hasImageChanged,
        hasImageValidationError: !!imageValidationError
    };
};

export default useEditImageFormInput;
