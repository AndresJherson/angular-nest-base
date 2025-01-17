import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoProductoComponent } from './MovimientoProducto.component';

describe('MovimientoProductoComponent', () => {
  let component: MovimientoProductoComponent;
  let fixture: ComponentFixture<MovimientoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
