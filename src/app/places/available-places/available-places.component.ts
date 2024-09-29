import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, tap } from 'rxjs';

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
        })
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.places.set(resp);
        },
        complete: () => {
          this.isFetching.set(true);
        }
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
