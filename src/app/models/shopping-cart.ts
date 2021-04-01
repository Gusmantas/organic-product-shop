import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
  // Since we use push, we need to initialize this array
  items: ShoppingCartItem [] = [];

  constructor(public itemsMap: { [productId: string]: ShoppingCartItem }){
    itemsMap = itemsMap || {};

    // tslint:disable-next-line: forin
    for (const productId in itemsMap){
      const item = itemsMap[productId];
      // spread operator ...item. TypeScript will iterate through this objects properties and add them to where it is used.
      // It does the same as adding:
      /*
        title: item.title,
        imageUrl: item.imageUrl
        price: item.price,
       */
      this.items.push(new ShoppingCartItem({ ...item, key: productId }));
    }
  }

  // Convert firebase object to array
  // get productIds(){
  //   return Object.keys(this.items);
  // }

  getQuantity(product: Product){
    // This is required here(was not added by Mosh) to prevent null ref error when the product card componenet
    // checks the quantity of every item and renders the big 'Add to cart' button or the qty in the cart
    if (!this.itemsMap)
        return 0;

    const item = this.itemsMap[product.key];
    return item ? item.quantity : 0;
  }

  get totalItemsCount(){
   let count = 0;
   for (const productId in this.items)
      count += this.items[productId].quantity;
   return count;
  }

  get totalPrice(){
    let sum = 0;
    for (const productId in this.items)
      sum += this.items[productId].totalPrice;
    return sum;
  }
}
