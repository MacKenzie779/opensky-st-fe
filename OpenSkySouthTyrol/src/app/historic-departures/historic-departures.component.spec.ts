import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDeparturesComponent } from './historic-departures.component';

describe('HistoricDeparturesComponent', () => {
  let component: HistoricDeparturesComponent;
  let fixture: ComponentFixture<HistoricDeparturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricDeparturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricDeparturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
