import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { APIService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatExpansionModule, MatAccordion, MatFormFieldModule, MatSelectModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  categoryCrudFrom!: FormGroup;
  isEdit: boolean = false;
  isOpen: boolean = false
  categoryDataSource: any;
  beforeUpdateUser: any;
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  displayedColumns: string[] = ['NO', 'name', 'Action'];

  constructor(
    private fb: FormBuilder,
    private APIService: APIService,
    private toster: ToastrService,
    private dialog: MatDialog

  ) { }

  ngOnInit() {
    this.categoryCrudFrom = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.getCategory();
  }


  openPanel() {
    this.categoryCrudFrom.reset();
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

  getCategory() {
    this.APIService.getCategory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.categoryDataSource = new MatTableDataSource(res.data);
        } else {
          this.toster.error(res.message);
        }
      },
      error: (err: any) => {
        this.toster.error(err.error.message);
      }
    })
  }

  addNewCategory() {
    if (this.categoryCrudFrom.valid) {
      this.APIService.createCategory(this.categoryCrudFrom.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.isOpen = !this.isOpen;
            this.accordion?.closeAll();
            this.categoryCrudFrom.reset();
            this.toster.success(res.message);
            this.getCategory()
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
    this.categoryCrudFrom.patchValue(element);
    this.openModel();
    this.scrollToTop('scrollableElement')
  }

  updateCategory() {
    if (this.categoryCrudFrom.valid) {
      this.APIService.updateCategory(this.beforeUpdateUser.id, this.categoryCrudFrom.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.isOpen = !this.isOpen;
            this.accordion?.closeAll();
            this.categoryCrudFrom.reset();
            this.toster.success(res.message);
            this.getCategory()
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
        this.getCategory()
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
