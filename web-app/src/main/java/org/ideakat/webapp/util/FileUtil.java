package org.ideakat.webapp.util;


import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class FileUtil {

    private static Pattern VALID_FILE_EXT_PATTERN = Pattern.compile(
       "\\.[a-zA-Z0-9]+$"
    );

    public static String getFileExtensionWithPeriod(String fileName){
        if (fileName == null){
            return "";
        }

        Matcher fileExtMatcher = VALID_FILE_EXT_PATTERN.matcher(fileName);
        if (fileExtMatcher.find()){
            return fileExtMatcher.group();
        }
        return "";
    }

    private FileUtil(){}
}
