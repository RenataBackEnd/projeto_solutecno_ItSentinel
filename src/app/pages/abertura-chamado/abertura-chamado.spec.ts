import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AberturaChamadoComponent } from './abertura-chamado';

describe('AberturaChamado', () => {
  let component: AberturaChamadoComponent;
  let fixture: ComponentFixture<AberturaChamadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AberturaChamadoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AberturaChamadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
