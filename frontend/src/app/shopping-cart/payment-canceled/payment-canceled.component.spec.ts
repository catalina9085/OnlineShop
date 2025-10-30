import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCanceledComponent } from './payment-canceled.component';

describe('PaymentCanceledComponent', () => {
  let component: PaymentCanceledComponent;
  let fixture: ComponentFixture<PaymentCanceledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCanceledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCanceledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
