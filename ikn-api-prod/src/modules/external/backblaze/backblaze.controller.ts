import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, UseGuards, Res, Query, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BackblazeService } from './backblaze.service';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';
import axios from 'axios';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('files')
@ApiTags('Files')
export class BackblazeController {
	constructor(private readonly backblazeService: BackblazeService) {}

	@Post('upload')
	@ApiBearerAuth()
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiOperation({ summary: 'Upload file PO (PDF, Image, etc)' })
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const uploadResponse = await this.backblazeService.uploadFile(file);
		return { url: uploadResponse.Location };
	}

	@Get('/merged')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Merged' })
	async downloadMerged(@Query('urls') urls: string[], @Res() res: any) {
		try {
			const filteredUrls = Array.isArray(urls) ? urls.filter(Boolean) : [urls];
			const mergedBuffer = await this.backblazeService.mergePDFs(filteredUrls);

			res.set({
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=merged.pdf',
			});

			res.send(mergedBuffer);
		} catch (e) {
			throw e;
		}
	}

	@Get(':name')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Files' })
	async getdFile(@Param('name') fileName: string) {
		return await this.backblazeService.getFileUrlV2(fileName);
	}
}
