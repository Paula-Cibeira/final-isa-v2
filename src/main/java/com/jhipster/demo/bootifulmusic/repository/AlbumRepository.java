package com.jhipster.demo.bootifulmusic.repository;

import com.jhipster.demo.bootifulmusic.domain.Album;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Album entity.
 */
@Repository
public interface AlbumRepository extends Neo4jRepository<Album, String> {}
