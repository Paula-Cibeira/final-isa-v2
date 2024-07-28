import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TrackDetailComponent } from './track-detail.component';

describe('Track Management Detail Component', () => {
  let comp: TrackDetailComponent;
  let fixture: ComponentFixture<TrackDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TrackDetailComponent,
              resolve: { track: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TrackDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load track on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TrackDetailComponent);

      // THEN
      expect(instance.track()).toEqual(expect.objectContaining({ id: 'ABC' }));
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
