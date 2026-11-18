import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { UseAllExceptionsFilter } from '@shared/exceptions/all.exception';
import { JsonParse } from '@shared/utils/json.parse';
import { UseSwagger } from '@shared/utils/swagger';
import { AppModule } from '@src/app.module';
import '@src/module-alias';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	JsonParse();
	const app = await NestFactory.create(AppModule);
	const { httpAdapter } = app.get(HttpAdapterHost);
	const configService = app.get(ConfigService);
	app.setGlobalPrefix('api');
	app.enableVersioning({ type: VersioningType.URI });
	// app.enableCors({ origin: '*' });
	app.enableCors({
		origin: configService.get('DOMAIN_ORIGIN'), // frontend origin atau "*"
		credentials: true, // izinkan cookie
	});
	app.use(compression());
	app.useGlobalFilters(UseAllExceptionsFilter(httpAdapter));
	app.use(cookieParser.default());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true, // <- penting untuk konversi otomatis (misalnya string ke number)
			transformOptions: {
				enableImplicitConversion: false,
			},
		})
	);

	if (configService.get('NODE_ENV') != 'production') {
		//gifff
		UseSwagger(app);
	}

	app.use(helmet());

	const port = configService.get<number>('PORT') || 3000;
	await app.listen(port);
}

bootstrap();
