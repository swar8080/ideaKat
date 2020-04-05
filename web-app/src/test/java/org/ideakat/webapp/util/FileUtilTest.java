package org.ideakat.webapp.util;

import org.junit.Test;

import static org.junit.Assert.*;

public class FileUtilTest {

    @Test
    public void getFileExtensionWithPeriod() {
        assertEquals("", FileUtil.getFileExtensionWithPeriod(null));
        assertEquals(".png3", FileUtil.getFileExtensionWithPeriod("abc.png3"));
        assertEquals(".png3", FileUtil.getFileExtensionWithPeriod("abc.test.png3"));
        assertEquals("", FileUtil.getFileExtensionWithPeriod("abc"));
        assertEquals("", FileUtil.getFileExtensionWithPeriod("abc."));
    }
}