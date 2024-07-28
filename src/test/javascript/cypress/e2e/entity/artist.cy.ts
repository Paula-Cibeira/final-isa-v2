import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Artist e2e test', () => {
  const artistPageUrl = '/artist';
  const artistPageUrlPattern = new RegExp('/artist(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const artistSample = { name: 'unhand ha' };

  let artist;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/artists+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/artists').as('postEntityRequest');
    cy.intercept('DELETE', '/api/artists/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (artist) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/artists/${artist.id}`,
      }).then(() => {
        artist = undefined;
      });
    }
  });

  it('Artists menu should load Artists page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('artist');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Artist').should('exist');
    cy.url().should('match', artistPageUrlPattern);
  });

  describe('Artist page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(artistPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Artist page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/artist/new$'));
        cy.getEntityCreateUpdateHeading('Artist');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', artistPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/artists',
          body: artistSample,
        }).then(({ body }) => {
          artist = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/artists+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/artists?page=0&size=20>; rel="last",<http://localhost/api/artists?page=0&size=20>; rel="first"',
              },
              body: [artist],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(artistPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Artist page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('artist');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', artistPageUrlPattern);
      });

      it('edit button click should load edit Artist page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Artist');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', artistPageUrlPattern);
      });

      it('edit button click should load edit Artist page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Artist');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', artistPageUrlPattern);
      });

      it('last delete button click should delete instance of Artist', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('artist').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', artistPageUrlPattern);

        artist = undefined;
      });
    });
  });

  describe('new Artist page', () => {
    beforeEach(() => {
      cy.visit(`${artistPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Artist');
    });

    it('should create an instance of Artist', () => {
      cy.get(`[data-cy="name"]`).type('alpenhorn finally unless');
      cy.get(`[data-cy="name"]`).should('have.value', 'alpenhorn finally unless');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        artist = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', artistPageUrlPattern);
    });
  });
});
