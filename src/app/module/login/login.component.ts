import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginCrudForm!: FormGroup;
  token: any

  constructor(
    private fb: FormBuilder,
    private APIService: APIService,
    private router: Router,
    private toster: ToastrService
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.loginCrudForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required,]]
    });
    if (this.token) {
      this.router.navigate(['/login']);
    }
  }

  login() {
    if (this.loginCrudForm.valid) {
      this.APIService.login(this.loginCrudForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['/category']);
            this.toster.success(res.message);
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
} 
