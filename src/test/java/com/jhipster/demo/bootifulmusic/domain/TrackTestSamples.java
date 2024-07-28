package com.jhipster.demo.bootifulmusic.domain;

import java.util.UUID;

public class TrackTestSamples {

    public static Track getTrackSample1() {
        return new Track().id("id1").name("name1");
    }

    public static Track getTrackSample2() {
        return new Track().id("id2").name("name2");
    }

    public static Track getTrackRandomSampleGenerator() {
        return new Track().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
