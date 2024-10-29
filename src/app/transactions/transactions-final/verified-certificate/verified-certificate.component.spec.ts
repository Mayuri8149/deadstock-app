import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifiedCertificateComponent } from './verified-certificate.component';

describe('VerifiedCertificateComponent', () => {
  let component: VerifiedCertificateComponent;
  let fixture: ComponentFixture<VerifiedCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifiedCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
