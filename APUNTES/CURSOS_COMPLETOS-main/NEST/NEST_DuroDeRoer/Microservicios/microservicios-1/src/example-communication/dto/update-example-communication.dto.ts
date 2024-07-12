import { PartialType } from '@nestjs/mapped-types';
import { CreateExampleCommunicationDto } from './create-example-communication.dto';

export class UpdateExampleCommunicationDto extends PartialType(CreateExampleCommunicationDto) {}
