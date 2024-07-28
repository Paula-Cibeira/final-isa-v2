package com.jhipster.demo.bootifulmusic.web.rest;

import com.jhipster.demo.bootifulmusic.domain.Artist;
import com.jhipster.demo.bootifulmusic.repository.ArtistRepository;
import com.jhipster.demo.bootifulmusic.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jhipster.demo.bootifulmusic.domain.Artist}.
 */
@RestController
@RequestMapping("/api/artists")
public class ArtistResource {

    private static final Logger log = LoggerFactory.getLogger(ArtistResource.class);

    private static final String ENTITY_NAME = "artist";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArtistRepository artistRepository;

    public ArtistResource(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    /**
     * {@code POST  /artists} : Create a new artist.
     *
     * @param artist the artist to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new artist, or with status {@code 400 (Bad Request)} if the artist has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Artist> createArtist(@Valid @RequestBody Artist artist) throws URISyntaxException {
        log.debug("REST request to save Artist : {}", artist);
        if (artist.getId() != null) {
            throw new BadRequestAlertException("A new artist cannot already have an ID", ENTITY_NAME, "idexists");
        }
        artist = artistRepository.save(artist);
        return ResponseEntity.created(new URI("/api/artists/" + artist.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, artist.getId()))
            .body(artist);
    }

    /**
     * {@code PUT  /artists/:id} : Updates an existing artist.
     *
     * @param id the id of the artist to save.
     * @param artist the artist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artist,
     * or with status {@code 400 (Bad Request)} if the artist is not valid,
     * or with status {@code 500 (Internal Server Error)} if the artist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Artist artist
    ) throws URISyntaxException {
        log.debug("REST request to update Artist : {}, {}", id, artist);
        if (artist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        artist = artistRepository.save(artist);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artist.getId()))
            .body(artist);
    }

    /**
     * {@code PATCH  /artists/:id} : Partial updates given fields of an existing artist, field will ignore if it is null
     *
     * @param id the id of the artist to save.
     * @param artist the artist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated artist,
     * or with status {@code 400 (Bad Request)} if the artist is not valid,
     * or with status {@code 404 (Not Found)} if the artist is not found,
     * or with status {@code 500 (Internal Server Error)} if the artist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Artist> partialUpdateArtist(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Artist artist
    ) throws URISyntaxException {
        log.debug("REST request to partial update Artist partially : {}, {}", id, artist);
        if (artist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, artist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!artistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Artist> result = artistRepository
            .findById(artist.getId())
            .map(existingArtist -> {
                if (artist.getName() != null) {
                    existingArtist.setName(artist.getName());
                }

                return existingArtist;
            })
            .map(artistRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, artist.getId()));
    }

    /**
     * {@code GET  /artists} : get all the artists.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of artists in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Artist>> getAllArtists(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Artists");
        Page<Artist> page = artistRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /artists/:id} : get the "id" artist.
     *
     * @param id the id of the artist to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the artist, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtist(@PathVariable("id") String id) {
        log.debug("REST request to get Artist : {}", id);
        Optional<Artist> artist = artistRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(artist);
    }

    /**
     * {@code DELETE  /artists/:id} : delete the "id" artist.
     *
     * @param id the id of the artist to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable("id") String id) {
        log.debug("REST request to delete Artist : {}", id);
        artistRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
