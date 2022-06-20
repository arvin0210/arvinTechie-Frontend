import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { first } from 'rxjs';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { UserAccount } from 'src/app/model/user-account.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;

  constructor(private router: Router, private toast: HotToastService, private authService: AuthenticateService) {
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    this.progressBar.mode = "indeterminate";

    const userName = this.loginForm.get('userName')?.value;
    const password = this.loginForm.get('password')?.value;
    let authRequest: any = {
      "userName": userName,
      "password": password
    };
    this.authService.generateToken(authRequest).subscribe({
      next: (data) => {
        if (data) {
          this.authService.setToken(data);
          this.authService.login(userName, password).subscribe({
            next: (result) => {
              if (!result.status) {
                swal.fire({title:'Warning!', html:'Your status is disabled.<br/>Please ask your admin to activate your account.', icon:'warning', confirmButtonColor: 'red'});
                this.authService.logout();                
              }
              else {
                this.router.navigate(['/work-teamHome']);
              }
            }
          });
        }
        else {
          swal.fire({ title: 'Error!', html: 'Username & Password does not match.<br/>Please try again.', icon: 'error', confirmButtonColor: 'red' });          
        }
        this.progressBar.mode = "determinate";
      }
    });
  }

}
