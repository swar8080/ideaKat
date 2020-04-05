package org.ideakat.webapp.util;

public final class MutableObject<T> {
    private T value;

    public MutableObject(){
        value = null;
    }

    public MutableObject(T value){
        this.value = value;
    }

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}
