import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './../../Services/product.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Interfaces/Product';
import { ErrorService } from '../../Services/error.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
loading:boolean=false;
products: Product[] = [];
  constructor( private productService:ProductService, private toastr:ToastrService, private errorService: ErrorService) {
  }
  ngOnInit(): void {
    this.getProducts();
    }

  getProducts( ){
    this.productService.getProducts().subscribe({
      next: (v: Product[]) => {
        this.products = v;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
      },
      complete: () => console.info('complete')
    });
  }

}
