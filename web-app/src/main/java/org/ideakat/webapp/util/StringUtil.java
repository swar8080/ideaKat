package org.ideakat.webapp.util;

public final class StringUtil {

    public static boolean hasValue(String value){
        return value != null && !"".equals(value);
    }

    private StringUtil(){};
}
