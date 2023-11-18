import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRenaultApiClientComponent } from './ngx-renault-api-client.component';

describe('NgxRenaultApiClientComponent', () => {
  let component: NgxRenaultApiClientComponent;
  let fixture: ComponentFixture<NgxRenaultApiClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxRenaultApiClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxRenaultApiClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
