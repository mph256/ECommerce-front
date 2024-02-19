import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  cols = 3;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.resize(window.innerWidth);
  }

  resize(innerWidth: number): void {

    if(innerWidth > 1001)
      this.cols = 3;

    if(innerWidth <= 1001)
      this.cols = 2;

    if(innerWidth <= 689)
      this.cols = 1;

  }

  onClick(param: string): void {
    this.router.navigateByUrl(`/account/${param}`);
  }

  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

}
