import { Product } from './models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product){
    return this.db.list('/products').push(product);
  }

  getAll(){
    return this.db.list('/products')
    .snapshotChanges()
    .pipe(
      map(actions => actions
        .map(a => ({key: a.payload.key, ...(a.payload.val() as Product)})
        )));
  }

  getProduct(productId){
    return this.db.object('/products/' + productId)
    .snapshotChanges()
    .pipe(
      map(action => ({key: action.payload.key, ...(action.payload.val() as {})}))
    );
  }

  update(productId, product){
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId){
    return this.db.object('/products/' + productId).remove();
  }
}
