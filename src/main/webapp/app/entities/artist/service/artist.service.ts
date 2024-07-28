import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArtist, NewArtist } from '../artist.model';

export type PartialUpdateArtist = Partial<IArtist> & Pick<IArtist, 'id'>;

export type EntityResponseType = HttpResponse<IArtist>;
export type EntityArrayResponseType = HttpResponse<IArtist[]>;

@Injectable({ providedIn: 'root' })
export class ArtistService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/artists');

  create(artist: NewArtist): Observable<EntityResponseType> {
    return this.http.post<IArtist>(this.resourceUrl, artist, { observe: 'response' });
  }

  update(artist: IArtist): Observable<EntityResponseType> {
    return this.http.put<IArtist>(`${this.resourceUrl}/${this.getArtistIdentifier(artist)}`, artist, { observe: 'response' });
  }

  partialUpdate(artist: PartialUpdateArtist): Observable<EntityResponseType> {
    return this.http.patch<IArtist>(`${this.resourceUrl}/${this.getArtistIdentifier(artist)}`, artist, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IArtist>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArtist[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getArtistIdentifier(artist: Pick<IArtist, 'id'>): string {
    return artist.id;
  }

  compareArtist(o1: Pick<IArtist, 'id'> | null, o2: Pick<IArtist, 'id'> | null): boolean {
    return o1 && o2 ? this.getArtistIdentifier(o1) === this.getArtistIdentifier(o2) : o1 === o2;
  }

  addArtistToCollectionIfMissing<Type extends Pick<IArtist, 'id'>>(
    artistCollection: Type[],
    ...artistsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const artists: Type[] = artistsToCheck.filter(isPresent);
    if (artists.length > 0) {
      const artistCollectionIdentifiers = artistCollection.map(artistItem => this.getArtistIdentifier(artistItem));
      const artistsToAdd = artists.filter(artistItem => {
        const artistIdentifier = this.getArtistIdentifier(artistItem);
        if (artistCollectionIdentifiers.includes(artistIdentifier)) {
          return false;
        }
        artistCollectionIdentifiers.push(artistIdentifier);
        return true;
      });
      return [...artistsToAdd, ...artistCollection];
    }
    return artistCollection;
  }
}
