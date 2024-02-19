import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingStatisticsComponent } from './rating-statistics.component';

describe('RatingStatisticsComponent', () => {
  let component: RatingStatisticsComponent;
  let fixture: ComponentFixture<RatingStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingStatisticsComponent]
    });
    fixture = TestBed.createComponent(RatingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
