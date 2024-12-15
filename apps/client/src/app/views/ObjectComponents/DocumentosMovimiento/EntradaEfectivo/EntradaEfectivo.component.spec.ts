import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaEfectivoComponent } from './EntradaEfectivo.component';

describe('EntradaEfectivoComponent', () => {
  let component: EntradaEfectivoComponent;
  let fixture: ComponentFixture<EntradaEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaEfectivoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
