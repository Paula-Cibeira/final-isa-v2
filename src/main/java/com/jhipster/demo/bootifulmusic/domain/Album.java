package com.jhipster.demo.bootifulmusic.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

/**
 * A Album.
 */
@Node("album")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Album implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    private String id;

    @NotNull
    @Property("name")
    private String name;

    @Relationship(value = "HAS_ARTIST", direction = Relationship.Direction.OUTGOING)
    private Artist artist;

    @Relationship(value = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    private Genre genre;

    @Relationship(value = "HAS_TRACK", direction = Relationship.Direction.OUTGOING)
    private Set<Track> tracks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Album id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Album name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Artist getArtist() {
        return this.artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public Album artist(Artist artist) {
        this.setArtist(artist);
        return this;
    }

    public Genre getGenre() {
        return this.genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public Album genre(Genre genre) {
        this.setGenre(genre);
        return this;
    }

    public Set<Track> getTracks() {
        return this.tracks;
    }

    public void setTracks(Set<Track> tracks) {
        this.tracks = tracks;
    }

    public Album tracks(Set<Track> tracks) {
        this.setTracks(tracks);
        return this;
    }

    public Album addTrack(Track track) {
        this.tracks.add(track);
        return this;
    }

    public Album removeTrack(Track track) {
        this.tracks.remove(track);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Album)) {
            return false;
        }
        return getId() != null && getId().equals(((Album) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Album{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
