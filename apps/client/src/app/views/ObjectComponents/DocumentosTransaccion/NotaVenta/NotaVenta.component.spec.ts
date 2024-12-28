import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotaVentaComponent, StateDocumentNotaVentaComponent } from './NotaVenta.component';

describe('NotaVentaComponent', () => {
  let component: NotaVentaComponent;
  let fixture: ComponentFixture<NotaVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaVentaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotaVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia haber detalles', () => {
    const storeDetalles = fixture.componentRef.instance.storeDetalles
    expect( storeDetalles.getState().length ).toBeGreaterThan( 1 );
  })

  it('deberia ser borrador', () => {
    const state = fixture.componentRef.instance.stateDocument;
    expect( state ).toBe( StateDocumentNotaVentaComponent.draftCreate );
  })
});
