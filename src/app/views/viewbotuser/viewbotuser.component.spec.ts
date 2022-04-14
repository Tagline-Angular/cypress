import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbotuserComponent } from './viewbotuser.component';

describe('ViewbotuserComponent', () => {
  let component: ViewbotuserComponent;
  let fixture: ComponentFixture<ViewbotuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewbotuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbotuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
