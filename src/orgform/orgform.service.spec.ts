import { Test, TestingModule } from '@nestjs/testing';
import { OrgformService } from './orgform.service';

describe('OrgformService', () => {
  let service: OrgformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgformService],
    }).compile();

    service = module.get<OrgformService>(OrgformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
