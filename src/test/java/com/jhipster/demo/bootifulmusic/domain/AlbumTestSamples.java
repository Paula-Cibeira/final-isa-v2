package com.jhipster.demo.bootifulmusic.domain;

import java.util.UUID;

public class AlbumTestSamples {

    public static Album getAlbumSample1() {
        return new Album().id("id1").name("name1");
    }

    public static Album getAlbumSample2() {
        return new Album().id("id2").name("name2");
    }

    public static Album getAlbumRandomSampleGenerator() {
        return new Album().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
