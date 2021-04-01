import { ShoppingCartItem } from './models/shopping-cart-item';
import { Product } from './models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>>{
    const cartId = await this.getOrCreateCartId();

    return this.db.object('/shopping-carts/' + cartId).snapshotChanges()
    .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)));
  }

  async addToCart(product: Product){
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product){
    this.updateItem(product, -1);
  }

  async clearCart(){
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }


  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productKey: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productKey);
  }

  private async getOrCreateCartId(): Promise<string>{
    const cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;

      // Async await lets us write this code, as above :
      // this.create().then(result => {
      //   return this.getCart(result.key);
      //   localStorage.setItem('cartId', result.key);
      // });
  }

  private async updateItem(product: Product, change: number){
    const cartId = await this.getOrCreateCartId();
    const item = this.getItem(cartId, product.key);

    item
    .valueChanges()
    .pipe(take(1))
    .subscribe((data: ShoppingCartItem) => {
      const quantity = (data ? (data.quantity || 0) : 0) + change;

      if (!quantity) item.remove();

      else item.update({
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity
      });
    });
  }

}
