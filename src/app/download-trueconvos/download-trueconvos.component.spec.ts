import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTrueconvosComponent } from './download-trueconvos.component';

describe('DownloadTrueconvosComponent', () => {
  let component: DownloadTrueconvosComponent;
  let fixture: ComponentFixture<DownloadTrueconvosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadTrueconvosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTrueconvosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
