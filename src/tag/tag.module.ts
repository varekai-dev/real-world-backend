import { TypeOrmModule } from '@nestjs/typeorm'
import { TagController } from './tag.controller'
import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagEntity } from './tag.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TagEntity])],
	controllers: [TagController],
	providers: [TagService],
})
export class TagModule {}
