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

describe('Track e2e test', () => {
  const trackPageUrl = '/track';
  const trackPageUrlPattern = new RegExp('/track(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const trackSample = { name: 'between' };

  let track;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tracks+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tracks').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tracks/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (track) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tracks/${track.id}`,
      }).then(() => {
        track = undefined;
      });
    }
  });

  it('Tracks menu should load Tracks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('track');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Track').should('exist');
    cy.url().should('match', trackPageUrlPattern);
  });

  describe('Track page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(trackPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Track page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/track/new$'));
        cy.getEntityCreateUpdateHeading('Track');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', trackPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tracks',
          body: trackSample,
        }).then(({ body }) => {
          track = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tracks+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/tracks?page=0&size=20>; rel="last",<http://localhost/api/tracks?page=0&size=20>; rel="first"',
              },
              body: [track],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(trackPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Track page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('track');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', trackPageUrlPattern);
      });

      it('edit button click should load edit Track page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Track');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', trackPageUrlPattern);
      });

      it('edit button click should load edit Track page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Track');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', trackPageUrlPattern);
      });

      it('last delete button click should delete instance of Track', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('track').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', trackPageUrlPattern);

        track = undefined;
      });
    });
  });

  describe('new Track page', () => {
    beforeEach(() => {
      cy.visit(`${trackPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Track');
    });

    it('should create an instance of Track', () => {
      cy.get(`[data-cy="name"]`).type('concerning');
      cy.get(`[data-cy="name"]`).should('have.value', 'concerning');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        track = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', trackPageUrlPattern);
    });
  });
});
