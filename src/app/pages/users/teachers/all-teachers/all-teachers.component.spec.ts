import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AllTeachersComponent } from './all-teachers.component';

describe('AllTeachersComponent', () => {
  let component: AllTeachersComponent;
  let fixture: ComponentFixture<AllTeachersComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTeachersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AllTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController.expectOne('http://localhost:5270/api/students').flush([]);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
