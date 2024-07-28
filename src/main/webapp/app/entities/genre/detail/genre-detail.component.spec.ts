import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GenreDetailComponent } from './genre-detail.component';

describe('Genre Management Detail Component', () => {
  let comp: GenreDetailComponent;
  let fixture: ComponentFixture<GenreDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GenreDetailComponent,
              resolve: { genre: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GenreDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load genre on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GenreDetailComponent);

      // THEN
      expect(instance.genre()).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
