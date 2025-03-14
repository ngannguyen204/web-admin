import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountAddComponent } from './admin-account-add.component';

describe('AdminAccountAddComponent', () => {
  let component: AdminAccountAddComponent;
  let fixture: ComponentFixture<AdminAccountAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccountAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
