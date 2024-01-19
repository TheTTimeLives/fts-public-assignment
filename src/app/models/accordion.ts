// src/app/models/item.model.ts
export interface Item {
    itemId: number;
    name: string;
  }
  
  // src/app/models/size.model.ts
  export interface Size {
    sizeId: number;
    name: string;
  }
  
  // src/app/models/price.model.ts
  export interface Price {
    itemId: number;
    sizeId: number;
    price: number;
  }

  export interface IsOpenItem extends Item {
  isOpen?: boolean;
  }
  