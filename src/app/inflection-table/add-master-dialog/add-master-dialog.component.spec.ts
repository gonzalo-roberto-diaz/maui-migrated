import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterDialogComponent } from './add-master-dialog.component';

describe('AddMasterComponent', () => {
  let component: AddMasterDialogComponent;
  let fixture: ComponentFixture<AddMasterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMasterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
