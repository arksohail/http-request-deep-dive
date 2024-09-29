import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal<boolean>(false);
  error = signal('');
  subscription?: Subscription;
  
  private _placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  
  places = this._placesService.loadedUserPlaces;
  
  ngOnInit(): void {
    this.isFetching.set(true);
    this.subscription = this._placesService.loadUserPlaces()
      .subscribe({
        error: (err: Error) => {
          this.error.set(err.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });
    this.destroyRef.onDestroy(() => this.subscription?.unsubscribe());
  }
  
  onRemovePlace(place: Place) {
    const subscription = this._placesService.removeUserPlace(place).subscribe({
      next: (respData) => {
        console.log(respData);
      }, 
      error: (err) => console.log(err)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
