import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KardexComponent } from './Kardex.component';

describe('KardexComponent', () => {
  let component: KardexComponent;
  let fixture: ComponentFixture<KardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
