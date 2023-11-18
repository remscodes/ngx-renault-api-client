import { TestBed } from '@angular/core/testing';

import { NgxRenaultApiClientService } from './ngx-renault-api-client.service';

describe('NgxRenaultApiClientService', () => {
  let service: NgxRenaultApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRenaultApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
