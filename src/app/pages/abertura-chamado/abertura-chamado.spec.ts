import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AberturaChamado } from './abertura-chamado';

describe('AberturaChamado', () => {
  let component: AberturaChamado;
  let fixture: ComponentFixture<AberturaChamado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AberturaChamado],
    }).compileComponents();

    fixture = TestBed.createComponent(AberturaChamado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
