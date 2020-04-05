package org.ideakat.webapp.util;

import java.util.ArrayList;
import java.util.List;

public final class CollectionUtil {

    public static <T> List<T> newArrayList(Iterable<T> iterable){
        List<T> list = new ArrayList<>();
        if (iterable != null){
            iterable.forEach(list::add);
        }
        return list;
    }

    private CollectionUtil(){}
}
