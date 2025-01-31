import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { TrackService } from '../service/track.service';
import { ITrack } from '../track.model';
import { TrackFormService } from './track-form.service';

import { TrackUpdateComponent } from './track-update.component';

describe('Track Management Update Component', () => {
  let comp: TrackUpdateComponent;
  let fixture: ComponentFixture<TrackUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trackFormService: TrackFormService;
  let trackService: TrackService;
  let albumService: AlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TrackUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TrackUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrackUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trackFormService = TestBed.inject(TrackFormService);
    trackService = TestBed.inject(TrackService);
    albumService = TestBed.inject(AlbumService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Album query and add missing value', () => {
      const track: ITrack = { id: 'CBA' };
      const album: IAlbum = { id: 'f4f0d92f-5134-4f53-920a-d4252622c337' };
      track.album = album;

      const albumCollection: IAlbum[] = [{ id: '6d28687c-76be-4337-8215-65862952bf18' }];
      jest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [album];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      jest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ track });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(
        albumCollection,
        ...additionalAlbums.map(expect.objectContaining),
      );
      expect(comp.albumsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const track: ITrack = { id: 'CBA' };
      const album: IAlbum = { id: '98f292b9-6c20-42a5-9f59-30864d798a3a' };
      track.album = album;

      activatedRoute.data = of({ track });
      comp.ngOnInit();

      expect(comp.albumsSharedCollection).toContain(album);
      expect(comp.track).toEqual(track);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrack>>();
      const track = { id: 'ABC' };
      jest.spyOn(trackFormService, 'getTrack').mockReturnValue(track);
      jest.spyOn(trackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ track });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: track }));
      saveSubject.complete();

      // THEN
      expect(trackFormService.getTrack).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(trackService.update).toHaveBeenCalledWith(expect.objectContaining(track));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrack>>();
      const track = { id: 'ABC' };
      jest.spyOn(trackFormService, 'getTrack').mockReturnValue({ id: null });
      jest.spyOn(trackService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ track: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: track }));
      saveSubject.complete();

      // THEN
      expect(trackFormService.getTrack).toHaveBeenCalled();
      expect(trackService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrack>>();
      const track = { id: 'ABC' };
      jest.spyOn(trackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ track });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trackService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAlbum', () => {
      it('Should forward to albumService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(albumService, 'compareAlbum');
        comp.compareAlbum(entity, entity2);
        expect(albumService.compareAlbum).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
