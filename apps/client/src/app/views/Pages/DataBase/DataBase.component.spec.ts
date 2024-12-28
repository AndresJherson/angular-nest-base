import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataBaseComponent } from './DataBase.component';

describe('DataBaseComponent', () => {
  let component: DataBaseComponent;
  let fixture: ComponentFixture<DataBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
