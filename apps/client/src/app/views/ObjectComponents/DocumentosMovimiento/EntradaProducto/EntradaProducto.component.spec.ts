import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaProductoComponent } from './EntradaProducto.component';

describe('EntradaProductoComponent', () => {
  let component: EntradaProductoComponent;
  let fixture: ComponentFixture<EntradaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
