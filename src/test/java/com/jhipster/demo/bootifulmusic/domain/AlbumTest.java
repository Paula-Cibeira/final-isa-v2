package com.jhipster.demo.bootifulmusic.domain;

import static com.jhipster.demo.bootifulmusic.domain.AlbumTestSamples.*;
import static com.jhipster.demo.bootifulmusic.domain.ArtistTestSamples.*;
import static com.jhipster.demo.bootifulmusic.domain.GenreTestSamples.*;
import static com.jhipster.demo.bootifulmusic.domain.TrackTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.jhipster.demo.bootifulmusic.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AlbumTest {

    // Testeando creación de álbum
    @Test
    public void testAlbumCreation() {
        Album album = new Album();
        album.setId("1");
        album.setName("Parachutes");

        assertEquals(album.getId(), "1");
        assertEquals(album.getName(), "Parachutes");
    }

    //Testeando setear artista
    @Test
    public void testSetGetArtist() {
        Album album = new Album();
        Artist artist = new Artist();
        artist.setName("Coldplay");

        album.setArtist(artist);

        assertEquals(album.getArtist().getName(), "Coldplay");
    }

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Album.class);
        Album album1 = getAlbumSample1();
        Album album2 = new Album();
        assertThat(album1).isNotEqualTo(album2);

        album2.setId(album1.getId());
        assertThat(album1).isEqualTo(album2);

        album2 = getAlbumSample2();
        assertThat(album1).isNotEqualTo(album2);
    }

    @Test
    void artistTest() {
        Album album = getAlbumRandomSampleGenerator();
        Artist artistBack = getArtistRandomSampleGenerator();

        album.setArtist(artistBack);
        assertThat(album.getArtist()).isEqualTo(artistBack);

        album.artist(null);
        assertThat(album.getArtist()).isNull();
    }

    @Test
    void genreTest() {
        Album album = getAlbumRandomSampleGenerator();
        Genre genreBack = getGenreRandomSampleGenerator();

        album.setGenre(genreBack);
        assertThat(album.getGenre()).isEqualTo(genreBack);

        album.genre(null);
        assertThat(album.getGenre()).isNull();
    }

    @Test
    void trackTest() {
        Album album = getAlbumRandomSampleGenerator();
        Track trackBack = getTrackRandomSampleGenerator();

        album.addTrack(trackBack);
        assertThat(album.getTracks()).containsOnly(trackBack);

        album.removeTrack(trackBack);
        assertThat(album.getTracks()).doesNotContain(trackBack);

        album.tracks(new HashSet<>(Set.of(trackBack)));
        assertThat(album.getTracks()).containsOnly(trackBack);

        album.setTracks(new HashSet<>());
        assertThat(album.getTracks()).doesNotContain(trackBack);
    }
}
