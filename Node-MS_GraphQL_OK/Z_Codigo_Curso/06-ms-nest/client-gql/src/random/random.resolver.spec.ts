import { Test, TestingModule } from '@nestjs/testing';
import { RandomResolver } from './random.resolver';
import { RandomService } from './random.service';

describe('RandomResolver', () => {
  let resolver: RandomResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomResolver, RandomService],
    }).compile();

    resolver = module.get<RandomResolver>(RandomResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
