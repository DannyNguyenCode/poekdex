import { Injectable, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveServices {
  private bp = inject(BreakpointObserver);
  isMobile = signal(false);
  constructor() {
    this.bp.observe([
      Breakpoints.Handset,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
    ]).subscribe(result => {
      this.isMobile.set(result.matches);
    });
  }
}
