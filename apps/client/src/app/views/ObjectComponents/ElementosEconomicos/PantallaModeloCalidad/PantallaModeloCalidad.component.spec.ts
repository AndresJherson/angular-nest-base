import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallaModeloCalidadComponent } from './PantallaModeloCalidad.component';

describe('PantallaModeloCalidadComponent', () => {
  let component: PantallaModeloCalidadComponent;
  let fixture: ComponentFixture<PantallaModeloCalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaModeloCalidadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaModeloCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
