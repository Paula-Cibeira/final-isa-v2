import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';

@Component({
  standalone: true,
  templateUrl: './album-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AlbumDeleteDialogComponent {
  album?: IAlbum;

  protected albumService = inject(AlbumService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.albumService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
