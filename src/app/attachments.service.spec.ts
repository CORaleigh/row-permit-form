import { TestBed, inject } from '@angular/core/testing';

import { AttachmentsService } from './attachments.service';

describe('AttachmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachmentsService]
    });
  });

  it('should be created', inject([AttachmentsService], (service: AttachmentsService) => {
    expect(service).toBeTruthy();
  }));
});
