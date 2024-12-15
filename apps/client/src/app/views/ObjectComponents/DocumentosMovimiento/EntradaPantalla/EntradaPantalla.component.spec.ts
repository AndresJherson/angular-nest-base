import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaPantallaComponent } from './EntradaPantalla.component';

describe('EntradaPantallaComponent', () => {
  let component: EntradaPantallaComponent;
  let fixture: ComponentFixture<EntradaPantallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaPantallaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaPantallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
