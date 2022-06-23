import { TagService } from './tag.service'
import { Controller, Get } from '@nestjs/common'
@Controller('tags')
export class TagController {
	constructor(private readonly TagService: TagService) {}
	@Get()
	async findAll(): Promise<{ tags: string[] }> {
		const tags = await this.TagService.findAll()
		return {
			tags: tags.map((tag) => tag.name),
		}
	}
}
