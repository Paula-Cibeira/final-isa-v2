import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { ITrack } from 'app/entities/track/track.model';
import { TrackService } from 'app/entities/track/service/track.service';
import { AlbumService } from '../service/album.service';
import { IAlbum } from '../album.model';
import { AlbumFormService, AlbumFormGroup } from './album-form.service';

@Component({
  standalone: true,
  selector: 'jhi-album-update',
  templateUrl: './album-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AlbumUpdateComponent implements OnInit {
  isSaving = false;
  album: IAlbum | null = null;

  artistsSharedCollection: IArtist[] = [];
  genresSharedCollection: IGenre[] = [];
  tracksSharedCollection: ITrack[] = [];

  protected albumService = inject(AlbumService);
  protected albumFormService = inject(AlbumFormService);
  protected artistService = inject(ArtistService);
  protected genreService = inject(GenreService);
  protected trackService = inject(TrackService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AlbumFormGroup = this.albumFormService.createAlbumFormGroup();

  compareArtist = (o1: IArtist | null, o2: IArtist | null): boolean => this.artistService.compareArtist(o1, o2);

  compareGenre = (o1: IGenre | null, o2: IGenre | null): boolean => this.genreService.compareGenre(o1, o2);

  compareTrack = (o1: ITrack | null, o2: ITrack | null): boolean => this.trackService.compareTrack(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ album }) => {
      this.album = album;
      if (album) {
        this.updateForm(album);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const album = this.albumFormService.getAlbum(this.editForm);
    if (album.id !== null) {
      this.subscribeToSaveResponse(this.albumService.update(album));
    } else {
      this.subscribeToSaveResponse(this.albumService.create(album));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbum>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(album: IAlbum): void {
    this.album = album;
    this.albumFormService.resetForm(this.editForm, album);

    this.artistsSharedCollection = this.artistService.addArtistToCollectionIfMissing<IArtist>(this.artistsSharedCollection, album.artist);
    this.genresSharedCollection = this.genreService.addGenreToCollectionIfMissing<IGenre>(this.genresSharedCollection, album.genre);
    this.tracksSharedCollection = this.trackService.addTrackToCollectionIfMissing<ITrack>(
      this.tracksSharedCollection,
      ...(album.tracks ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.artistService
      .query()
      .pipe(map((res: HttpResponse<IArtist[]>) => res.body ?? []))
      .pipe(map((artists: IArtist[]) => this.artistService.addArtistToCollectionIfMissing<IArtist>(artists, this.album?.artist)))
      .subscribe((artists: IArtist[]) => (this.artistsSharedCollection = artists));

    this.genreService
      .query()
      .pipe(map((res: HttpResponse<IGenre[]>) => res.body ?? []))
      .pipe(map((genres: IGenre[]) => this.genreService.addGenreToCollectionIfMissing<IGenre>(genres, this.album?.genre)))
      .subscribe((genres: IGenre[]) => (this.genresSharedCollection = genres));

    this.trackService
      .query()
      .pipe(map((res: HttpResponse<ITrack[]>) => res.body ?? []))
      .pipe(map((tracks: ITrack[]) => this.trackService.addTrackToCollectionIfMissing<ITrack>(tracks, ...(this.album?.tracks ?? []))))
      .subscribe((tracks: ITrack[]) => (this.tracksSharedCollection = tracks));
  }
}
