import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { LoginServices } from '../../services/login-services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, RouterLink, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  authenticateServices = inject(LoginServices)
  isMobileView = signal<boolean>(false)
  isAuthenticated = this.authenticateServices.authState
  constructor(private responsvie: BreakpointObserver, private router: Router) {

  }



  ngOnInit(): void {
    this.isAuthenticated.set(this.authenticateServices.isAuthenticated())
    this.responsvie.observe([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,]).subscribe((result) => {
        this.isMobileView.set(result.matches)

      })
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
    console.log("inside logout")
    this.authenticateServices.logout()
    this.openSnackBar("User has logged out", true)
    this.router.navigate
  }
}
