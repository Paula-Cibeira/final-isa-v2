package com.jhipster.demo.bootifulmusic.domain;

import java.util.UUID;

public class ArtistTestSamples {

    public static Artist getArtistSample1() {
        return new Artist().id("id1").name("name1");
    }

    public static Artist getArtistSample2() {
        return new Artist().id("id2").name("name2");
    }

    public static Artist getArtistRandomSampleGenerator() {
        return new Artist().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
