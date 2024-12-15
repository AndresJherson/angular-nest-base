import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditoPagarComponent } from './CreditoPagar.component';

describe('CreditoPagarComponent', () => {
  let component: CreditoPagarComponent;
  let fixture: ComponentFixture<CreditoPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoPagarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditoPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
