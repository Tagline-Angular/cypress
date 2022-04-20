import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotuserpostComponent } from './botuserpost.component';

describe('BotuserpostComponent', () => {
  let component: BotuserpostComponent;
  let fixture: ComponentFixture<BotuserpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotuserpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotuserpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
