import { Injectable } from '@angular/core';
import { Item, Size, Price } from '../models/accordion'; // Update the path as necessary
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private items: Item[] = [
    {
      itemId: 0,
      name: 'Margherita'
    },
    {
      itemId: 1,
      name: 'Pepperoni'
    },
  ];
  private itemPrices: Price[] = [
    {
      itemId: 0,
      sizeId: 0,
      price: 3.99
    },
    {
      itemId: 0,
      sizeId: 1,
      price: 5.99
    },
    {
      itemId: 0,
      sizeId: 2,
      price: 7.99
    },
    {
      itemId: 1,
      sizeId: 0,
      price: 4.42
    },
    {
      itemId: 1,
      sizeId: 1,
      price: 6.52
    },
    {
      itemId: 1,
      sizeId: 2,
      price: 8.62
    },
  ];
  // There were repeat ids in here which I assume was an error, Large was set to 0 as well
  private itemSizes: Size[] = [
    {
      sizeId: 0,
      name: 'Small'
    },
    {
      sizeId: 1,
      name: 'Medium'
    },
    {
      sizeId: 2,
      name: 'Large'
    }
  ];

  constructor() { }

  getItems(): Observable<Item[]> {
    return of(this.items);
  }

  getPrices(): Observable<Price[]> {
    return of(this.itemPrices);
  }

  getSizes(): Observable<Size[]> {
    return of(this.itemSizes);
  }
}
