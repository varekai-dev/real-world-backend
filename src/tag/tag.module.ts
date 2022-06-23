import { TagController } from './tag.controller'
import { Module } from '@nestjs/common'
import { TagService } from './tag.service'

@Module({
	imports: [],
	controllers: [TagController],
	providers: [TagService],
})
export class TagModule {}
