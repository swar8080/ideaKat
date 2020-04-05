package org.ideakat.webapp.persistence.service.images;

import javax.validation.constraints.NotNull;
import java.io.InputStream;

public interface ImageUploadService {

    boolean isValidImageUpload(InputStream imageStream, Long imageSizeBytes, String knownImageFileName);

    /**
     *
     * @param imageStream
     * @param imageSizeBytes
     * @param sourceImageFileName File name of the original image, used to determine the file extension
     * @return URL of uploaded image
     */
    String uploadImage(InputStream imageStream, Long imageSizeBytes, String sourceImageFileName);

    /**
     *
     * @param imageStream
     * @param imageSizeBytes
     * @param sourceImageFileName File name of the original image, used to determine the file extension
     * @param existingImageUrl not null, existing url of the image
     * @return URL of uploaded image
     */
    String replaceImage(InputStream imageStream, Long imageSizeBytes, String sourceImageFileName, @NotNull String existingImageUrl);

    void deleteImage(@NotNull String existingImageUrl);
}
