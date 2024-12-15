import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditoCobrarComponent } from './CreditoCobrar.component';

describe('CreditoCobrarComponent', () => {
  let component: CreditoCobrarComponent;
  let fixture: ComponentFixture<CreditoCobrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoCobrarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditoCobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
