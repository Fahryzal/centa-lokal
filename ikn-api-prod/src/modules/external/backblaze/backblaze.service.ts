import { Injectable, Scope } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { PDFDocument } from 'pdf-lib';

@Injectable({ scope: Scope.REQUEST })
export class BackblazeService {
	private s3: S3;
	private bucketName = process.env.B2_BUCKET_NAME;

	constructor() {
		this.s3 = new S3({
			endpoint: 'https://s3.us-east-005.backblazeb2.com', // Sesuaikan region
			accessKeyId: process.env.B2_APPLICATION_KEY_ID,
			secretAccessKey: process.env.B2_APPLICATION_KEY,
			signatureVersion: 'v4',
		});
	}

	async uploadFile(file: Express.Multer.File) {
		const params = {
			Bucket: this.bucketName,
			Key: file.originalname,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		return this.s3.upload(params).promise();
	}

	async getFileUrl(fileName: string) {
		return `https://${this.bucketName}.s3.us-east-005.backblazeb2.com/${fileName}`;
	}

	async getFileUrlV2(fileName: string) {
		return this.s3.getSignedUrl('getObject', {
			Bucket: this.bucketName,
			Key: fileName,
			Expires: 300,
		});
	}

	async mergePDFs(urls: string[]) {
		const mergedPdf = await PDFDocument.create();

		for (const url of urls) {
			const urlTmp = await this.getFileUrl(url);
			console.log('urlTmp', urlTmp);
			const response = await axios.get(urlTmp, { responseType: 'arraybuffer' });
			const pdf = await PDFDocument.load(response.data);
			const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
			copiedPages.forEach((page) => mergedPdf.addPage(page));
		}

		const pdfBytes = await mergedPdf.save();
		return Buffer.from(pdfBytes);
	}
}
