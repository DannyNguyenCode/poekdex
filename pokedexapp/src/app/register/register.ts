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
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatGridListModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private _snackBar = inject(MatSnackBar);
  registerForm: FormGroup
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required])
  errorMessage = signal('');
  hide = signal(true);
  loginServices = inject(LoginServices)

  constructor(private fb: FormBuilder, private router: Router, private responsvie: BreakpointObserver) {
    this.registerForm = this.fb.group({
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
      duration: this.durationInSeconds * 1000,
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

    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.loginServices.registerUser(user).subscribe({
        next: (res) => {
          console.log("message: ", res.message)
          this.openSnackBar(res.message, true)
          this.router.navigate(['/login'])
        },
        error: (err) => {
          console.log("Register error: ", err)
          this.openSnackBar(err.error.message, false)
        }
      })
    }

  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
