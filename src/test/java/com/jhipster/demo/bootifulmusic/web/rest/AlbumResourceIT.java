package com.jhipster.demo.bootifulmusic.web.rest;

import static com.jhipster.demo.bootifulmusic.domain.AlbumAsserts.*;
import static com.jhipster.demo.bootifulmusic.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhipster.demo.bootifulmusic.IntegrationTest;
import com.jhipster.demo.bootifulmusic.domain.Album;
import com.jhipster.demo.bootifulmusic.repository.AlbumRepository;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link AlbumResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AlbumResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/albums";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private MockMvc restAlbumMockMvc;

    private Album album;

    private Album insertedAlbum;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Album createEntity() {
        Album album = new Album().name(DEFAULT_NAME);
        return album;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Album createUpdatedEntity() {
        Album album = new Album().name(UPDATED_NAME);
        return album;
    }

    @BeforeEach
    public void initTest() {
        album = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAlbum != null) {
            albumRepository.delete(insertedAlbum);
            insertedAlbum = null;
        }
    }

    @Test
    void createAlbum() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Album
        var returnedAlbum = om.readValue(
            restAlbumMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(album)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Album.class
        );

        // Validate the Album in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAlbumUpdatableFieldsEquals(returnedAlbum, getPersistedAlbum(returnedAlbum));

        insertedAlbum = returnedAlbum;
    }

    @Test
    void createAlbumWithExistingId() throws Exception {
        // Create the Album with an existing ID
        album.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlbumMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(album)))
            .andExpect(status().isBadRequest());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        album.setName(null);

        // Create the Album, which fails.

        restAlbumMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(album)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllAlbums() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        // Get all the albumList
        restAlbumMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    void getAlbum() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        // Get the album
        restAlbumMockMvc
            .perform(get(ENTITY_API_URL_ID, album.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    void getNonExistingAlbum() throws Exception {
        // Get the album
        restAlbumMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingAlbum() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the album
        Album updatedAlbum = albumRepository.findById(album.getId()).orElseThrow();
        updatedAlbum.name(UPDATED_NAME);

        restAlbumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAlbum.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAlbum))
            )
            .andExpect(status().isOk());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAlbumToMatchAllProperties(updatedAlbum);
    }

    @Test
    void putNonExistingAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(put(ENTITY_API_URL_ID, album.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(album)))
            .andExpect(status().isBadRequest());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(album))
            )
            .andExpect(status().isBadRequest());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(album)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAlbumWithPatch() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the album using partial update
        Album partialUpdatedAlbum = new Album();
        partialUpdatedAlbum.setId(album.getId());

        partialUpdatedAlbum.name(UPDATED_NAME);

        restAlbumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlbum.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAlbum))
            )
            .andExpect(status().isOk());

        // Validate the Album in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlbumUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAlbum, album), getPersistedAlbum(album));
    }

    @Test
    void fullUpdateAlbumWithPatch() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the album using partial update
        Album partialUpdatedAlbum = new Album();
        partialUpdatedAlbum.setId(album.getId());

        partialUpdatedAlbum.name(UPDATED_NAME);

        restAlbumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlbum.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAlbum))
            )
            .andExpect(status().isOk());

        // Validate the Album in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlbumUpdatableFieldsEquals(partialUpdatedAlbum, getPersistedAlbum(partialUpdatedAlbum));
    }

    @Test
    void patchNonExistingAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, album.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(album))
            )
            .andExpect(status().isBadRequest());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(album))
            )
            .andExpect(status().isBadRequest());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAlbum() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        album.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlbumMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(album)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Album in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAlbum() throws Exception {
        // Initialize the database
        insertedAlbum = albumRepository.save(album);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the album
        restAlbumMockMvc
            .perform(delete(ENTITY_API_URL_ID, album.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return albumRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Album getPersistedAlbum(Album album) {
        return albumRepository.findById(album.getId()).orElseThrow();
    }

    protected void assertPersistedAlbumToMatchAllProperties(Album expectedAlbum) {
        assertAlbumAllPropertiesEquals(expectedAlbum, getPersistedAlbum(expectedAlbum));
    }

    protected void assertPersistedAlbumToMatchUpdatableProperties(Album expectedAlbum) {
        assertAlbumAllUpdatablePropertiesEquals(expectedAlbum, getPersistedAlbum(expectedAlbum));
    }
}
