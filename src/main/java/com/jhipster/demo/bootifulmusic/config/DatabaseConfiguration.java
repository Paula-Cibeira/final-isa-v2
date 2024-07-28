package com.jhipster.demo.bootifulmusic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@Configuration
@EnableNeo4jRepositories("com.jhipster.demo.bootifulmusic.repository")
public class DatabaseConfiguration {}
