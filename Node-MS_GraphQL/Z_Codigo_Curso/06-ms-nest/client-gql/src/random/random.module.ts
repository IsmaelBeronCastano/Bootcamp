import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomResolver } from './random.resolver';

@Module({
  providers: [RandomResolver, RandomService],
})
export class RandomModule {}
