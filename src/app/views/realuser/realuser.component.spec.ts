import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealuserComponent } from './realuser.component';

describe('RealuserComponent', () => {
  let component: RealuserComponent;
  let fixture: ComponentFixture<RealuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
