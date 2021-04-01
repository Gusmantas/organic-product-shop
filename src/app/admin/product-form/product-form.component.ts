import { ProductService } from './../../product.service';
import { CategoryService } from './../../category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product: any = {};
  id;

  constructor(
      private categoryService: CategoryService,
      private productService: ProductService,
      private router: Router,
      private route: ActivatedRoute) {
    this.categories$ = categoryService.getAll();

    // Rendering object when clicking edit button in products.
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      // take() operator takes only one item from observable and closes it,
      // so we do not need to unsubscribe
      this.productService.getProduct(this.id)
      .pipe(take(1))
      .subscribe(p => this.product = p);

      // Now we get a new object with all the new values.
      // next we need to implement two way binding in html template
      // see html file [(ngModel)]
    }
   }

  save(product){
    if (this.id){
      this.productService.update(this.id, product);
    }
    else{
     this.productService.create(product);
    }
    this.router.navigate(['/admin/products']);
  }

  delete(){
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnInit(): void {}
}
