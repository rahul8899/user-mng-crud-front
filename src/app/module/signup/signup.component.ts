import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupCrudForm!: FormGroup;
  token: any

  constructor(
    private fb: FormBuilder,
    private APIService: APIService,
    private router: Router,
    private toster: ToastrService
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.signupCrudForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required,]]
    });
    if (this.token) {
      this.router.navigate(['/login']);
    }
  }

  signUp() {
    if (this.signupCrudForm.valid) {
      this.APIService.signup(this.signupCrudForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.router.navigate(['/login']);
            return this.toster.success(res.message);
          } else {
            return this.toster.error(res.message);
          }
        },
        error: (err: any) => {
          this.toster.error(err.error.message);
        }
      });
    }
  }

}
