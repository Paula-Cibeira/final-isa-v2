import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IArtist } from '../artist.model';

@Component({
  standalone: true,
  selector: 'jhi-artist-detail',
  templateUrl: './artist-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ArtistDetailComponent {
  artist = input<IArtist | null>(null);

  previousState(): void {
    window.history.back();
  }
}
