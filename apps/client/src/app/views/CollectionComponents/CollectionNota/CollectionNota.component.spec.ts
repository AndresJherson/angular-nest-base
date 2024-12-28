import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionNotaComponent } from './CollectionNota.component';

describe('CollectionNotaComponent', () => {
  let component: CollectionNotaComponent;
  let fixture: ComponentFixture<CollectionNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionNotaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
