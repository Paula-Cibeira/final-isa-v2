import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IArtist } from '../artist.model';
import { ArtistService } from '../service/artist.service';
import { ArtistFormService, ArtistFormGroup } from './artist-form.service';

@Component({
  standalone: true,
  selector: 'jhi-artist-update',
  templateUrl: './artist-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ArtistUpdateComponent implements OnInit {
  isSaving = false;
  artist: IArtist | null = null;

  protected artistService = inject(ArtistService);
  protected artistFormService = inject(ArtistFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ArtistFormGroup = this.artistFormService.createArtistFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ artist }) => {
      this.artist = artist;
      if (artist) {
        this.updateForm(artist);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const artist = this.artistFormService.getArtist(this.editForm);
    if (artist.id !== null) {
      this.subscribeToSaveResponse(this.artistService.update(artist));
    } else {
      this.subscribeToSaveResponse(this.artistService.create(artist));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArtist>>): void {
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

  protected updateForm(artist: IArtist): void {
    this.artist = artist;
    this.artistFormService.resetForm(this.editForm, artist);
  }
}
