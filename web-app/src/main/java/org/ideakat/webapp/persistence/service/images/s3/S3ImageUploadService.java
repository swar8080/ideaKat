package org.ideakat.webapp.persistence.service.images.s3;

import org.ideakat.webapp.persistence.service.images.ImageUploadService;
import org.ideakat.webapp.util.FileUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class S3ImageUploadService implements ImageUploadService {

    private String bucketName;

    private String bucketUrl;

    public S3ImageUploadService(@Value("${ideakat.s3.bucketName}") String bucketName, @Value("${ideakat.s3.bucketUrl}") String bucketUrl){
        this.bucketName = bucketName;
        this.bucketUrl = bucketUrl;
    }

    @Override
    public boolean isValidImageUpload(InputStream imageStream, Long imageSizeBytes, String knownImageFileName) {
        String fileExtension = FileUtil.getFileExtensionWithPeriod(knownImageFileName);
        return StringUtils.hasText(fileExtension) && imageSizeBytes > 0;
    }

    @Override
    public String uploadImage(InputStream imageStream, Long imageSizeBytes, String sourceImageFileName) {
        return putImage(imageStream, imageSizeBytes, getImageKey(sourceImageFileName));
    }

    @Override
    public String replaceImage(InputStream imageStream, Long imageSizeBytes, String sourceImageFileName, String existingImageUrl) {
        try {
            deleteImage(existingImageUrl);
        }
        catch (Exception e){
            //TODO log
            e.printStackTrace();
        }

        return uploadImage(imageStream, imageSizeBytes, sourceImageFileName);
    }

    private String putImage(InputStream image, Long imageSizeB, String imageKey) {
        try (S3Client client = createClient()){
            PutObjectRequest request = PutObjectRequest.builder()
               .bucket(bucketName)
               .key(imageKey)
               .cacheControl(getCacheControlHeaderValue())
               .build();

            RequestBody body = RequestBody.fromInputStream(image, imageSizeB);
            client.putObject(request, body);
            return buildImageUrl(imageKey);
        }
    }

    @Override
    public void deleteImage(String existingImageUrl){
        String existingKey = existingImageUrl.substring(existingImageUrl.lastIndexOf('/') + 1);
        try (S3Client client = createClient()){
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                                                             .bucket(bucketName)
                                                             .key(existingKey)
                                                             .build();

            client.deleteObject(request);
        }
    }

    S3Client createClient(){
        return S3Client.create();
    }

    private String getImageKey(String imageName){
        String fileExtension = FileUtil.getFileExtensionWithPeriod(imageName);
        return UUID.randomUUID().toString() + fileExtension;
    }

    private String getCacheControlHeaderValue(){
        return CacheControl
                .maxAge(365, TimeUnit.DAYS)
                .cachePublic()
                .getHeaderValue();
    }

    private String buildImageUrl(String imageKey){
        return bucketUrl + imageKey;
    }
}
