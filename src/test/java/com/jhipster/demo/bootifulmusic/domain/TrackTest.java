package com.jhipster.demo.bootifulmusic.domain;

import static com.jhipster.demo.bootifulmusic.domain.AlbumTestSamples.*;
import static com.jhipster.demo.bootifulmusic.domain.TrackTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.jhipster.demo.bootifulmusic.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TrackTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Track.class);
        Track track1 = getTrackSample1();
        Track track2 = new Track();
        assertThat(track1).isNotEqualTo(track2);

        track2.setId(track1.getId());
        assertThat(track1).isEqualTo(track2);

        track2 = getTrackSample2();
        assertThat(track1).isNotEqualTo(track2);
    }

    @Test
    void albumTest() {
        Track track = getTrackRandomSampleGenerator();
        Album albumBack = getAlbumRandomSampleGenerator();

        track.setAlbum(albumBack);
        assertThat(track.getAlbum()).isEqualTo(albumBack);
        assertThat(albumBack.getTracks()).containsOnly(track);

        track.album(null);
        assertThat(track.getAlbum()).isNull();
        assertThat(albumBack.getTracks()).doesNotContain(track);
    }
}
