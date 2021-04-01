import { Product } from './product';
export class ShoppingCartItem {
  key: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;

  // init it optional. It can be an object that looks like ShoppingCartItem 
  constructor(init?: Partial<ShoppingCartItem>){
    // Copying what comes with init and paste it as this shoppingCartItem
    Object.assign(this, init);
  }
  
  get totalPrice(){
    return this.price * this.quantity;
  }
}