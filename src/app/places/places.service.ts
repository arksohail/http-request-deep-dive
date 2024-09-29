import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places/',
      'Something went wrong fetching the available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Something went wrong fetching your favorite places. Please try again later.'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      })
    );
  }

  addPlaceToUserPlaces(selectedPlace: Place) {
    this.userPlaces.update((places) => [...places, selectedPlace]);
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id,
    });
  }

  removeUserPlace(place: Place) { }

  private fetchPlaces(url: string, errMsg: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((respData) => respData.places),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error(errMsg));
        })
      )
  }
}
