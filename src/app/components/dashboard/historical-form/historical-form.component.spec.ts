import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalFormComponent } from './historical-form.component';

describe('HistoricalFormComponent', () => {
  let component: HistoricalFormComponent;
  let fixture: ComponentFixture<HistoricalFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalFormComponent]
    });
    fixture = TestBed.createComponent(HistoricalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
