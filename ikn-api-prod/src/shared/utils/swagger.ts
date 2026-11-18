import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function UseSwagger(app: INestApplication<any>) {
	const swaggerConf = new DocumentBuilder()
		.setTitle('IKN V1')
		.setDescription('IKN API')
		.setVersion('1.0')
		.addServer('http://localhost:3000')
		.addServer('http://103.157.96.174:3000')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConf);
	SwaggerModule.setup('swagger', app, document, {
		customSiteTitle: 'Swagger UI - IKN V1',
		swaggerOptions: { defaultModelsExpandDepth: -1 },
		useGlobalPrefix: true,
	});
}
