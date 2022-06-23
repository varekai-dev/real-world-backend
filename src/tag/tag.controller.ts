import { TagService } from './tag.service'
import { Controller, Get } from '@nestjs/common'

@Controller('tags')
export class TagController {
	constructor(private readonly TagService: TagService) {}
	@Get()
	async findAll() {
		return this.TagService.findAll()
	}
}
