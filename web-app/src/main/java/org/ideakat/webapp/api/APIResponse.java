package org.ideakat.webapp.api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

public class APIResponse<T> {
    private boolean successful;
    private T data;
    private Map<String, String> errors;
    private String responseMessage;

    private APIResponse(T data, boolean successful, Map<String, String> errors, String responseMessage){
        this.data = data;
        this.successful = successful;
        this.errors = errors;
        this.responseMessage = responseMessage;
    }

    public static <T> APIResponse<T> create(T data){
        return new APIResponse<>(data, true, new HashMap<>(), null);
    }

    public static <T> APIResponse error(Map<String, String> errors){
        return new APIResponse<T>(null, false, errors, null);
    }

    public static APIResponse successful(){
        return new APIResponse(null, true, new HashMap<>(), null);
    }

    public static APIResponse successfulIfNoErrors(Map<String, String> errors){
        boolean successful = errors == null || errors.isEmpty();
        return new APIResponse(null, successful, errors, null);
    }

    public static APIResponse errorResponseMessage(String responseMessage){
        return new APIResponse(null, false, new HashMap<>(), responseMessage);
    }

    public boolean isSuccessful() {
        return successful;
    }

    public T getData() {
        return data;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    @JsonProperty("hasErrors")
    public boolean hasErrors(){
        return !successful && errors != null && !errors.isEmpty();
    }

    public String getResponseMessage() {
        return responseMessage;
    }
}
