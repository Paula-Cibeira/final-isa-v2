package com.jhipster.demo.bootifulmusic;

import com.jhipster.demo.bootifulmusic.config.AsyncSyncConfiguration;
import com.jhipster.demo.bootifulmusic.config.EmbeddedNeo4j;
import com.jhipster.demo.bootifulmusic.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { BootifulmusicApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedNeo4j
public @interface IntegrationTest {
}
