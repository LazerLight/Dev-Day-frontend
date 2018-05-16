import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneBoardComponent } from './one-board.component';

describe('OneBoardComponent', () => {
  let component: OneBoardComponent;
  let fixture: ComponentFixture<OneBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
