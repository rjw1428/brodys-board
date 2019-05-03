import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryFormComponent } from './catagory-form.component';

describe('CatagoryFormComponent', () => {
  let component: CatagoryFormComponent;
  let fixture: ComponentFixture<CatagoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatagoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatagoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
