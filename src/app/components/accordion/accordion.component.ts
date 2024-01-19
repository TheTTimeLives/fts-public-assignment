import { Component, OnInit } from '@angular/core';
import { Size, Price, IsOpenItem } from '../../models/accordion';
import { MockDataService } from '../../services/mock-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  items: IsOpenItem[] = [];
  sizes: Size[] = [];
  prices: Price[] = [];
  selectedSizes: { [key: string]: boolean } = {};
  initialPrices: { [key: string]: number } = {};

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadData();
    this.loadPrices();
  }

  // load data from mock service
  loadData() {
    forkJoin({
      items: this.mockDataService.getItems(),
      sizes: this.mockDataService.getSizes(),
      prices: this.mockDataService.getPrices()
    }).subscribe(({ items, sizes, prices }) => {
      this.items = items.map(item => ({ ...item, isOpen: false }));
      this.sizes = sizes;
      this.prices = prices;
      this.initializeData();
    });
  }

  // init
  initializeData() {
    this.prices.forEach(price => {
      const key = `${price.itemId}_${price.sizeId}`;
      const storedValue = localStorage.getItem(key);
      this.initialPrices[key] = price.price;
      this.selectedSizes[key] = storedValue !== null ? parseFloat(storedValue) !== 0 : true;
      price.price = storedValue !== null ? parseFloat(storedValue) : price.price;
    });
  }

  // added change detection because of issues interacting with items
  trackBySizeId(index: number, size: Size): any {
    return size.sizeId;
  }

  // orignally just a toggle, altered to handle closing other accordion panes
  toggleOpen(clickedItem: any) {
    clickedItem.isOpen = !clickedItem.isOpen;
    this.items.forEach(item => {
      if (item !== clickedItem) {
        item.isOpen = false;
      }
    });
  }
  
  // handling size changes
  onSizeChange(itemId: number, sizeId: number | undefined, event: any) {
    const priceObject = this.prices.find(price => price.itemId === itemId && price.sizeId === sizeId);
    if (priceObject) {
      priceObject.price = event.target.checked ? this.initialPrices[`${itemId}_${sizeId}`] : 0;
    }
    this.selectedSizes[`${itemId}_${sizeId}`] = event.target.checked;
    this.savePrices();
  }

  // Added logic for resetting state of checkboxes
  undoChanges(itemId: number) {
    this.prices.forEach(price => {
      if (price.itemId === itemId) {
        const key = `${itemId}_${price.sizeId}`;
        price.price = this.initialPrices[key];
        this.selectedSizes[key] = this.initialPrices[key] !== 0;
      }
    });
    this.savePrices();
  }

  getPrice(itemId: number, sizeId: number | undefined): number {
    const priceObj = this.prices.find(p => p.itemId === itemId && p.sizeId === sizeId);
    return priceObj ? priceObj.price : 0;
  }

  // Set a new price for a specific item and size
  setPrice(itemId: number, sizeId: number | undefined, newPrice: number): void {
    const priceObj = this.prices.find(p => p.itemId === itemId && p.sizeId === sizeId);
    if (priceObj) {
      priceObj.price = newPrice;
    }
  }

  // For persistence without a real db
  loadPrices() {
    this.prices.forEach(price => {
      const key = `${price.itemId}_${price.sizeId}`;
      const storedValue = localStorage.getItem(key);
      this.initialPrices[key] = price.price;
      this.selectedSizes[key] = storedValue !== null ? parseFloat(storedValue) !== 0 : true;
      price.price = storedValue !== null ? parseFloat(storedValue) : price.price;
    });
  }

  savePrices() {
    this.prices.forEach(price => {
      const key = `${price.itemId}_${price.sizeId}`;
      localStorage.setItem(key, price.price.toString());
    });
  }
}
