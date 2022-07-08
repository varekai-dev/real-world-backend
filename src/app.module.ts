import { AuthMiddleware } from './user/middleware/auth.middleware'
import { ConfigService } from '@nestjs/config'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import { TagModule } from '@app/tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormconfig from '@app/ormconfig'
import { UserModule } from './user/user.module'
import { ArticleModule } from './article/article.module'
import { ProfileModule } from './profile/profile.module'

@Module({
	imports: [
		TypeOrmModule.forRoot(ormconfig),
		TagModule,
		UserModule,
		ArticleModule,
		ProfileModule,
	],
	controllers: [AppController],
	providers: [AppService, ConfigService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL,
		})
	}
}
