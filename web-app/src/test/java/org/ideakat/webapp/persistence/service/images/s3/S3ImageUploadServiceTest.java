package org.ideakat.webapp.persistence.service.images.s3;

import org.hamcrest.core.StringEndsWith;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class S3ImageUploadServiceTest {

    private S3ImageUploadService s3ImageUploadService;

    private S3Client s3Client;

    private static final String BUCKET_NAME = "BUCKET_NAME";
    private static final String BUCKET_URL = "https://ideakat-dev.s3.amazonaws.com/";

    @Before
    public void setUp(){
        s3ImageUploadService = spy(new S3ImageUploadService(BUCKET_NAME, BUCKET_URL));

        s3Client = mock(S3Client.class);
        doReturn(s3Client).when(s3ImageUploadService).createClient();
    }

    @Test
    public void replaceImage() {
        //setup
        String existingImageUrl = BUCKET_URL + "existing-key.png";
        String newImageName = "new.jpg";

        //run
        String imageUrl = s3ImageUploadService.replaceImage(new ByteArrayInputStream(new byte[]{}), 0L, newImageName, existingImageUrl);

        //verify
        assertNotEquals(existingImageUrl, imageUrl);
        assertThat(imageUrl, StringEndsWith.endsWith(".jpg"));

        verify(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));
        ArgumentCaptor<DeleteObjectRequest> deleteObjectRequestCaptor = ArgumentCaptor.forClass(DeleteObjectRequest.class);

        verify(s3Client).deleteObject(deleteObjectRequestCaptor.capture());
        assertEquals("existing-key.png", deleteObjectRequestCaptor.getValue().key());
    }
}