import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../album.test-samples';

import { AlbumFormService } from './album-form.service';

describe('Album Form Service', () => {
  let service: AlbumFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumFormService);
  });

  describe('Service methods', () => {
    describe('createAlbumFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlbumFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            artist: expect.any(Object),
            genre: expect.any(Object),
            tracks: expect.any(Object),
          }),
        );
      });

      it('passing IAlbum should create a new form with FormGroup', () => {
        const formGroup = service.createAlbumFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            artist: expect.any(Object),
            genre: expect.any(Object),
            tracks: expect.any(Object),
          }),
        );
      });
    });

    describe('getAlbum', () => {
      it('should return NewAlbum for default Album initial value', () => {
        const formGroup = service.createAlbumFormGroup(sampleWithNewData);

        const album = service.getAlbum(formGroup) as any;

        expect(album).toMatchObject(sampleWithNewData);
      });

      it('should return NewAlbum for empty Album initial value', () => {
        const formGroup = service.createAlbumFormGroup();

        const album = service.getAlbum(formGroup) as any;

        expect(album).toMatchObject({});
      });

      it('should return IAlbum', () => {
        const formGroup = service.createAlbumFormGroup(sampleWithRequiredData);

        const album = service.getAlbum(formGroup) as any;

        expect(album).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAlbum should not enable id FormControl', () => {
        const formGroup = service.createAlbumFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAlbum should disable id FormControl', () => {
        const formGroup = service.createAlbumFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
