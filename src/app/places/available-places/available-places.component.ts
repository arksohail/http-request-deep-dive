import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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

  private _placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this._placesService.loadAvailablePlaces()
      .subscribe({
        next: (resp: Place[]) => {
          console.log(resp);
          this.places.set(resp);
        },
        error: (err: Error) => {
          this.error.set(err.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this._placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
        next: (resp) => console.log(resp),
        error: (error) => console.log(error),
      })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
