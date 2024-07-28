import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITrack } from '../track.model';

@Component({
  standalone: true,
  selector: 'jhi-track-detail',
  templateUrl: './track-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TrackDetailComponent {
  track = input<ITrack | null>(null);

  previousState(): void {
    window.history.back();
  }
}
