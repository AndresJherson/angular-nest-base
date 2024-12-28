import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionElementoEconomicoComponent } from './CollectionElementoEconomico.component';

describe('CollectionElementoEconomicoComponent', () => {
  let component: CollectionElementoEconomicoComponent;
  let fixture: ComponentFixture<CollectionElementoEconomicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionElementoEconomicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionElementoEconomicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
