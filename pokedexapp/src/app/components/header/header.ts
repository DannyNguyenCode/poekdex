import { Component, inject, OnInit, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LoginServices } from '../../services/login-services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ResponsiveServices } from '../../services/responsive-services';
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, RouterLink, MatIconModule,],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private authenticateServices = inject(LoginServices)
  private responsiveService = inject(ResponsiveServices)
  durationInSeconds = 5;
  constructor() { }

  isAuthenticated = this.authenticateServices.authState
  isMobileView = this.responsiveService.isMobile

  ngOnInit(): void {
    this.isAuthenticated.set(this.authenticateServices.isAuthenticated())

  }
  openSnackBar(message: string, isSuccess: boolean = true) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 10000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: isSuccess ? ['custom-snackbar-success'] : ['custom-snackbar-error'],
    });
  }
  logout() {
    this.authenticateServices.logout()
    this.openSnackBar("User has logged out", true)
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }
}
