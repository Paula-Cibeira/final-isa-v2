package com.jhipster.demo.bootifulmusic.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

/**
 * A Track.
 */
@Node("track")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Track implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    private String id;

    @NotNull
    @Property("name")
    private String name;

    @Relationship(value = "HAS_TRACK", direction = Relationship.Direction.INCOMING)
    private Album album;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Track id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Track name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Album getAlbum() {
        return this.album;
    }

    public void setAlbum(Album album) {
        if (this.album != null) {
            this.album.removeTrack(this);
        }
        if (album != null) {
            album.addTrack(this);
        }
        this.album = album;
    }

    public Track album(Album album) {
        this.setAlbum(album);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Track)) {
            return false;
        }
        return getId() != null && getId().equals(((Track) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Track{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
