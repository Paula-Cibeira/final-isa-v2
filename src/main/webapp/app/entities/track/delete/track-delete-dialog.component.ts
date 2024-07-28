import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITrack } from '../track.model';
import { TrackService } from '../service/track.service';

@Component({
  standalone: true,
  templateUrl: './track-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TrackDeleteDialogComponent {
  track?: ITrack;

  protected trackService = inject(TrackService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.trackService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
