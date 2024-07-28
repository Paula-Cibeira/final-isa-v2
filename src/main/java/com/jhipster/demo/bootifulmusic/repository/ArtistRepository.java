package com.jhipster.demo.bootifulmusic.repository;

import com.jhipster.demo.bootifulmusic.domain.Artist;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Artist entity.
 */
@Repository
public interface ArtistRepository extends Neo4jRepository<Artist, String> {}
