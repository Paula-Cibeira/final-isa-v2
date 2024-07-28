import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IArtist } from '../artist.model';
import { ArtistService } from '../service/artist.service';

@Component({
  standalone: true,
  templateUrl: './artist-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ArtistDeleteDialogComponent {
  artist?: IArtist;

  protected artistService = inject(ArtistService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.artistService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
