import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainManagementComponent } from './main-management.component';

describe('MainManagementComponent', () => {
  let component: MainManagementComponent;
  let fixture: ComponentFixture<MainManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
