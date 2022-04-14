import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbotuserComponent } from './addbotuser.component';

describe('AddbotuserComponent', () => {
  let component: AddbotuserComponent;
  let fixture: ComponentFixture<AddbotuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbotuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbotuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
