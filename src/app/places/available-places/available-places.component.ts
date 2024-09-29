import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, map, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal('')

  private httpClient = inject(HttpClient);

  private destroyRef = inject(DestroyRef);

  // constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription: Subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map((val) => {
          return val.places;
        }),
        catchError((err) => {
          console.log(err);
          return throwError(() => new Error("Something went wrong fetching the available places. Please try again later."));
        })
      )
      .subscribe({
        next: (resp: Place[]) => {
          console.log(resp);
          this.places.set(resp);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
        complete: () => {
          this.isFetching.set(true);
        }
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
