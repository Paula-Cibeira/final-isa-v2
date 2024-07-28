package com.jhipster.demo.bootifulmusic.web.rest;

import com.jhipster.demo.bootifulmusic.domain.Genre;
import com.jhipster.demo.bootifulmusic.repository.GenreRepository;
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
 * REST controller for managing {@link com.jhipster.demo.bootifulmusic.domain.Genre}.
 */
@RestController
@RequestMapping("/api/genres")
public class GenreResource {

    private static final Logger log = LoggerFactory.getLogger(GenreResource.class);

    private static final String ENTITY_NAME = "genre";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GenreRepository genreRepository;

    public GenreResource(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    /**
     * {@code POST  /genres} : Create a new genre.
     *
     * @param genre the genre to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new genre, or with status {@code 400 (Bad Request)} if the genre has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Genre> createGenre(@Valid @RequestBody Genre genre) throws URISyntaxException {
        log.debug("REST request to save Genre : {}", genre);
        if (genre.getId() != null) {
            throw new BadRequestAlertException("A new genre cannot already have an ID", ENTITY_NAME, "idexists");
        }
        genre = genreRepository.save(genre);
        return ResponseEntity.created(new URI("/api/genres/" + genre.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, genre.getId()))
            .body(genre);
    }

    /**
     * {@code PUT  /genres/:id} : Updates an existing genre.
     *
     * @param id the id of the genre to save.
     * @param genre the genre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genre,
     * or with status {@code 400 (Bad Request)} if the genre is not valid,
     * or with status {@code 500 (Internal Server Error)} if the genre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Genre genre
    ) throws URISyntaxException {
        log.debug("REST request to update Genre : {}, {}", id, genre);
        if (genre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!genreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        genre = genreRepository.save(genre);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genre.getId()))
            .body(genre);
    }

    /**
     * {@code PATCH  /genres/:id} : Partial updates given fields of an existing genre, field will ignore if it is null
     *
     * @param id the id of the genre to save.
     * @param genre the genre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genre,
     * or with status {@code 400 (Bad Request)} if the genre is not valid,
     * or with status {@code 404 (Not Found)} if the genre is not found,
     * or with status {@code 500 (Internal Server Error)} if the genre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Genre> partialUpdateGenre(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Genre genre
    ) throws URISyntaxException {
        log.debug("REST request to partial update Genre partially : {}, {}", id, genre);
        if (genre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!genreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Genre> result = genreRepository
            .findById(genre.getId())
            .map(existingGenre -> {
                if (genre.getName() != null) {
                    existingGenre.setName(genre.getName());
                }

                return existingGenre;
            })
            .map(genreRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genre.getId()));
    }

    /**
     * {@code GET  /genres} : get all the genres.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of genres in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Genre>> getAllGenres(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Genres");
        Page<Genre> page = genreRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /genres/:id} : get the "id" genre.
     *
     * @param id the id of the genre to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the genre, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Genre> getGenre(@PathVariable("id") String id) {
        log.debug("REST request to get Genre : {}", id);
        Optional<Genre> genre = genreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(genre);
    }

    /**
     * {@code DELETE  /genres/:id} : delete the "id" genre.
     *
     * @param id the id of the genre to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable("id") String id) {
        log.debug("REST request to delete Genre : {}", id);
        genreRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
