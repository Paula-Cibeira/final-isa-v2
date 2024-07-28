import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { ITrack } from 'app/entities/track/track.model';
import { TrackService } from 'app/entities/track/service/track.service';
import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';
import { AlbumFormService } from './album-form.service';

import { AlbumUpdateComponent } from './album-update.component';

describe('Album Management Update Component', () => {
  let comp: AlbumUpdateComponent;
  let fixture: ComponentFixture<AlbumUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let albumFormService: AlbumFormService;
  let albumService: AlbumService;
  let artistService: ArtistService;
  let genreService: GenreService;
  let trackService: TrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlbumUpdateComponent],
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
      .overrideTemplate(AlbumUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlbumUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    albumFormService = TestBed.inject(AlbumFormService);
    albumService = TestBed.inject(AlbumService);
    artistService = TestBed.inject(ArtistService);
    genreService = TestBed.inject(GenreService);
    trackService = TestBed.inject(TrackService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Artist query and add missing value', () => {
      const album: IAlbum = { id: 'CBA' };
      const artist: IArtist = { id: '07a06c49-a706-443c-804b-2c513c0906d6' };
      album.artist = artist;

      const artistCollection: IArtist[] = [{ id: '5287bf9a-cdc9-47f0-aa7f-2c6a026c54be' }];
      jest.spyOn(artistService, 'query').mockReturnValue(of(new HttpResponse({ body: artistCollection })));
      const additionalArtists = [artist];
      const expectedCollection: IArtist[] = [...additionalArtists, ...artistCollection];
      jest.spyOn(artistService, 'addArtistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(artistService.query).toHaveBeenCalled();
      expect(artistService.addArtistToCollectionIfMissing).toHaveBeenCalledWith(
        artistCollection,
        ...additionalArtists.map(expect.objectContaining),
      );
      expect(comp.artistsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Genre query and add missing value', () => {
      const album: IAlbum = { id: 'CBA' };
      const genre: IGenre = { id: '08170bc8-9542-4a25-9615-b60f9b6a2ad9' };
      album.genre = genre;

      const genreCollection: IGenre[] = [{ id: '59b98a3f-2a71-452d-874d-9b6a4395c99b' }];
      jest.spyOn(genreService, 'query').mockReturnValue(of(new HttpResponse({ body: genreCollection })));
      const additionalGenres = [genre];
      const expectedCollection: IGenre[] = [...additionalGenres, ...genreCollection];
      jest.spyOn(genreService, 'addGenreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(genreService.query).toHaveBeenCalled();
      expect(genreService.addGenreToCollectionIfMissing).toHaveBeenCalledWith(
        genreCollection,
        ...additionalGenres.map(expect.objectContaining),
      );
      expect(comp.genresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Track query and add missing value', () => {
      const album: IAlbum = { id: 'CBA' };
      const tracks: ITrack[] = [{ id: 'f794d1b7-d07e-46af-8ace-7ac2f4a17247' }];
      album.tracks = tracks;

      const trackCollection: ITrack[] = [{ id: 'a5e6bbf4-9fd1-410e-9a14-3dcaf971afe6' }];
      jest.spyOn(trackService, 'query').mockReturnValue(of(new HttpResponse({ body: trackCollection })));
      const additionalTracks = [...tracks];
      const expectedCollection: ITrack[] = [...additionalTracks, ...trackCollection];
      jest.spyOn(trackService, 'addTrackToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(trackService.query).toHaveBeenCalled();
      expect(trackService.addTrackToCollectionIfMissing).toHaveBeenCalledWith(
        trackCollection,
        ...additionalTracks.map(expect.objectContaining),
      );
      expect(comp.tracksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const album: IAlbum = { id: 'CBA' };
      const artist: IArtist = { id: '4d0a28d5-eb9c-4d02-8d4f-448186ed35f4' };
      album.artist = artist;
      const genre: IGenre = { id: 'd1182190-65fe-4f9a-ab51-adb921225c7b' };
      album.genre = genre;
      const track: ITrack = { id: 'e3dd9cbc-ae87-43bb-a5c5-7b6bbd4fe8ac' };
      album.tracks = [track];

      activatedRoute.data = of({ album });
      comp.ngOnInit();

      expect(comp.artistsSharedCollection).toContain(artist);
      expect(comp.genresSharedCollection).toContain(genre);
      expect(comp.tracksSharedCollection).toContain(track);
      expect(comp.album).toEqual(album);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 'ABC' };
      jest.spyOn(albumFormService, 'getAlbum').mockReturnValue(album);
      jest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: album }));
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(albumService.update).toHaveBeenCalledWith(expect.objectContaining(album));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 'ABC' };
      jest.spyOn(albumFormService, 'getAlbum').mockReturnValue({ id: null });
      jest.spyOn(albumService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: album }));
      saveSubject.complete();

      // THEN
      expect(albumFormService.getAlbum).toHaveBeenCalled();
      expect(albumService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlbum>>();
      const album = { id: 'ABC' };
      jest.spyOn(albumService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ album });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(albumService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareArtist', () => {
      it('Should forward to artistService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(artistService, 'compareArtist');
        comp.compareArtist(entity, entity2);
        expect(artistService.compareArtist).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGenre', () => {
      it('Should forward to genreService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(genreService, 'compareGenre');
        comp.compareGenre(entity, entity2);
        expect(genreService.compareGenre).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTrack', () => {
      it('Should forward to trackService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(trackService, 'compareTrack');
        comp.compareTrack(entity, entity2);
        expect(trackService.compareTrack).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
