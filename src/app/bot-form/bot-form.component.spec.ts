import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotFormComponent } from './bot-form.component';

describe('BotFormComponent', () => {
  let component: BotFormComponent;
  let fixture: ComponentFixture<BotFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
