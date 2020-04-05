package org.ideakat.webapp.persistence.service.images;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public final class ImageUploadUtil {

    /**
     *
     * @param imageUploadService
     * @param image image to upload
     * @return URL of the upload or nothing if the image to upload is invalid
     */
    public static Optional<String> uploadValidImage(ImageUploadService imageUploadService, Optional<MultipartFile> image) {
        return image.map(img -> {
            try {
                if (imageUploadService.isValidImageUpload(img.getInputStream(), img.getSize(), img.getOriginalFilename())){
                    return imageUploadService.uploadImage(img.getInputStream(), img.getSize(), img.getOriginalFilename());
                }
                return null;
            } catch (IOException e) {
                throw new RuntimeException("Error uploading image: " + img.getOriginalFilename(), e);
            }
        });
    }

    public static Optional<String> upsertValidImage(ImageUploadService imageUploadService, Optional<MultipartFile> newImage, Optional<String> existingImageUrl){
        return newImage.map(img -> {
            try {
                if (imageUploadService.isValidImageUpload(img.getInputStream(), img.getSize(), img.getOriginalFilename())){
                    if (existingImageUrl.isPresent()){
                        return imageUploadService.replaceImage(img.getInputStream(), img.getSize(), img.getOriginalFilename(), existingImageUrl.get());
                    }
                    else {
                        return imageUploadService.uploadImage(img.getInputStream(), img.getSize(), img.getOriginalFilename());
                    }
                }
                return null;
            } catch (IOException e) {
                throw new RuntimeException("Error uploading image: " + img.getOriginalFilename(), e);
            }
        });
    }

    private ImageUploadUtil(){}
}
