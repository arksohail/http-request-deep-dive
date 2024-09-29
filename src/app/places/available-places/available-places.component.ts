import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);

  private httpClient = inject(HttpClient);

  private destroyRef = inject(DestroyRef);
  
  // constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const subscription: Subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places').subscribe({
      next: (resp) => {
        console.log(resp.places);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
