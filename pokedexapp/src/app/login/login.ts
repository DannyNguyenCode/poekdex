import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { LoginServices } from '../services/login-services';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatGridListModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private _snackBar = inject(MatSnackBar);
  loginForm: FormGroup
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required])
  errorMessage = signal('');
  hide = signal(true);
  loginServices = inject(LoginServices)

  constructor(private fb: FormBuilder, private router: Router, private responsvie: BreakpointObserver) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  isMobileView = signal<boolean>(false)
  ngOnInit(): void {
    this.responsvie.observe([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,]).subscribe((result) => {
        this.isMobileView.set(result.matches)

      })
  }
  durationInSeconds = 5;

  openSnackBar(message: string, isSuccess: boolean = true) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 10000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isSuccess ? ['custom-snackbar-success'] : ['custom-snackbar-error'],
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
  onSubmit() {

    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.loginServices.loginUser(user).subscribe({
        next: (res) => {
          console.log("message: ", res.message)
          this.openSnackBar(res.message, true)
          this.router.navigate(['/'])
        },
        error: (err) => {
          console.log("Login error: ", err)
          this.openSnackBar(err.error.error, false)
        }
      })
    }

  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}

