import { Product } from './../../models/product';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['title', 'price', 'imageUrl'];
  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll().subscribe(products => {
      this.products = products;
      this.dataSource = new MatTableDataSource(products);

      this.initializeTableFeatures();
    });
  }

  ngOnInit(): void {}

  private initializeTableFeatures(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /* There are two scenarios to implement this method.
    1. To filter everything on server before getting the data
    2. Or we can filter in the client.

    First approach is good if we have a large database, lets say over
    10 000 objects. If we filter it on server, we skip downloading all object to client,

    Second approach is good if we have a lesser database, lets say around a 1000 or less objects
    We can download them to the client and implement filtering there.

    In this case we choose second approach.
  */
 applyFilter(input: string) {
  this.dataSource.data = (input) ?
  this.products
  .filter(p => p.title.toLowerCase().includes(input.toLowerCase()))
   : this.products;
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
