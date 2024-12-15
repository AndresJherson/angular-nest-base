import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalidaProductoComponent } from './SalidaProducto.component';

describe('SalidaProductoComponent', () => {
  let component: SalidaProductoComponent;
  let fixture: ComponentFixture<SalidaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidaProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalidaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
