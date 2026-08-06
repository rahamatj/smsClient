import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { EditAdminsComponent } from './edit-admins.component';

describe('EditAdminsComponent', () => {
  let component: EditAdminsComponent;
  let fixture: ComponentFixture<EditAdminsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdminsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'test-id' }),
            },
          },
        },
      ],
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EditAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController
      .expectOne('http://localhost:5270/api/admins/edit/test-id')
      .flush({ admin: { username: 'test-user', role: 1 } });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the username into the edit admin form', () => {
    fixture.detectChanges();

    const usernameInput: HTMLInputElement | null = fixture.nativeElement.querySelector('input#username');

    expect(component.username).toBe('test-user');
    expect(component.role).toBe('1');
    expect(usernameInput?.value).toBe('test-user');
  });
});
