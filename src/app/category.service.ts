import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll(){
    return this.db.list('/categories', query => query.orderByChild('name'))
    .snapshotChanges()
    .pipe(
      map(actions => actions
      .map(a => ({ key: a.payload.key, ...(a.payload.val() as {})})
        // const object = {
        //   key: a.payload.key,
        //   data: a.payload.val()
        // }
        // return object;
      )));
  }
}
