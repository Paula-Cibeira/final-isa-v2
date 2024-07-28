package com.jhipster.demo.bootifulmusic.domain;

import static com.jhipster.demo.bootifulmusic.domain.ArtistTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.jhipster.demo.bootifulmusic.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ArtistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Artist.class);
        Artist artist1 = getArtistSample1();
        Artist artist2 = new Artist();
        assertThat(artist1).isNotEqualTo(artist2);

        artist2.setId(artist1.getId());
        assertThat(artist1).isEqualTo(artist2);

        artist2 = getArtistSample2();
        assertThat(artist1).isNotEqualTo(artist2);
    }
}
