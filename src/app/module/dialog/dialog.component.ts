import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../service/api.service';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(
    public apiService: APIService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toast: ToastrService
  ) { }

  async delateDevice() {
    this.apiService.deleteCategory(this.data.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success(res.message)
          this.dialogRef.close({ action: 1, data: "true" });
        } else {
          this.toast.error(res.message)
        }
      },
      error: (err) => {
        this.toast.error(err.message)
      }
    })
  }

}
