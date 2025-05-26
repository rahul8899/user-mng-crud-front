import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { APIService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatExpansionModule, MatAccordion, MatFormFieldModule, MatSelectModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  productForm!: FormGroup;
  isEdit: boolean = false;
  isOpen: boolean = false
  productDataSource: any;
  beforeUpdateUser: any;
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  displayedColumns: string[] = ['NO', 'name', 'category', 'price', 'details', 'Action'];
  categoryList: any;

  constructor(
    private fb: FormBuilder,
    private APIService: APIService,
    private toster: ToastrService,
    private dialog: MatDialog

  ) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      price: ['', [Validators.required]],
      details: ['', [Validators.required]],
    });
    this.getProduct();
    this.getCategory();
  }


  openPanel() {
    this.productForm.reset();
    this.isEdit = false
    if (this.isOpen) {
      this.accordion?.closeAll();
    } else {
      this.accordion?.openAll();
    }
    this.isOpen = !this.isOpen;
  }

  cancelButton() {
    this.accordion?.closeAll();
    this.isOpen = !this.isOpen;
  }

  getProduct() {
    this.APIService.getProduct().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.productDataSource = new MatTableDataSource(res.data);
        } else {
          this.toster.error(res.message);
        }
      },
      error: (err: any) => {
        this.toster.error(err.error.message);
      }
    })
  }

  getCategory() {
    this.APIService.getCategory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.categoryList = res.data;
        } else {
          this.toster.error(res.message);
        }
      },
      error: (err: any) => {
        this.toster.error(err.error.message);
      }
    })
  }

  addNewProduct() {
    if (this.productForm.valid) {
      this.APIService.createProduct(this.productForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.isOpen = !this.isOpen;
            this.accordion?.closeAll();
            this.productForm.reset();
            this.toster.success(res.message);
            this.getProduct()
            return;
          } else {
            this.toster.error(res.message);
          }
        },
        error: (err: any) => {
          this.toster.error(err.error.message);
        }
      })
    }
  }
  openModel() {
    if (this.isOpen) {
      this.accordion?.closeAll();
    } else {
      this.accordion?.openAll();
    }
    this.isOpen = !this.isOpen;
  }

  update(element: any) {
    this.beforeUpdateUser = element;
    this.isEdit = true;
    this.productForm.patchValue(element);
    this.openModel();
    this.scrollToTop('scrollableElement')
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.APIService.updateProduct(this.beforeUpdateUser.id, this.productForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.isOpen = !this.isOpen;
            this.accordion?.closeAll();
            this.productForm.reset();
            this.toster.success(res.message);
            this.getProduct()
            return;
          } else {
            this.toster.error(res.message);
          }
        },
        error: (err: any) => {
          this.toster.error(err.error.message);
        }
      })
    }
  }
  openDialog(element: any) {
    this.beforeUpdateUser = element;
    this.dialog.open(DialogComponent, { data: { id: this.beforeUpdateUser.id } }).afterClosed().subscribe(data => {
      if (data.data == 'true') {
        this.APIService.deleteProduct(this.beforeUpdateUser.id).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toster.success(res.message)
              this.getProduct()
              this.cancelButton();
            } else {
              this.toster.error(res.message)
            }
          },
          error: (err) => {
            this.toster.error(err.message)
          }
        })
      } else {
        this.cancelButton();
      }
    });
  }

  scrollToTop(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

}
