import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoPantallaComponent } from './MovimientoPantalla.component';

describe('MovimientoPantallaComponent', () => {
  let component: MovimientoPantallaComponent;
  let fixture: ComponentFixture<MovimientoPantallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoPantallaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientoPantallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
