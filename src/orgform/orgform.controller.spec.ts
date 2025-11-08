import { Test, TestingModule } from '@nestjs/testing';
import { OrgformController } from './orgform.controller';
import { OrgformService } from './orgform.service';

describe('OrgformController', () => {
  let controller: OrgformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgformController],
      providers: [OrgformService],
    }).compile();

    controller = module.get<OrgformController>(OrgformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
