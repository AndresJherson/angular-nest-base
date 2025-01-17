import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoEfectivoComponent } from './MovimientoEfectivo.component';

describe('MovimientoEfectivoComponent', () => {
  let component: MovimientoEfectivoComponent;
  let fixture: ComponentFixture<MovimientoEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoEfectivoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientoEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
