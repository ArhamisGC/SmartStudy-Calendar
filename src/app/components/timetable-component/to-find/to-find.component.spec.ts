import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToFindComponent } from './to-find.component';

describe('ToFindComponent', () => {
  let component: ToFindComponent;
  let fixture: ComponentFixture<ToFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToFindComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
