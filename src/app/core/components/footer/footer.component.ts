import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private viewportScroller: ViewportScroller) { }

  onBackToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

}
