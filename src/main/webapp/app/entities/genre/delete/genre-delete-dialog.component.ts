import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGenre } from '../genre.model';
import { GenreService } from '../service/genre.service';

@Component({
  standalone: true,
  templateUrl: './genre-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GenreDeleteDialogComponent {
  genre?: IGenre;

  protected genreService = inject(GenreService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.genreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
