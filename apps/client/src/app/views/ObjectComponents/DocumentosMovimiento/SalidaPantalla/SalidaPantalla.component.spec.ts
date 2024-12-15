import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalidaPantallaComponent } from './SalidaPantalla.component';

describe('SalidaPantallaComponent', () => {
  let component: SalidaPantallaComponent;
  let fixture: ComponentFixture<SalidaPantallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidaPantallaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalidaPantallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
