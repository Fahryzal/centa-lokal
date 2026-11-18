import { Controller, Get, UseGuards } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';

@Controller({ version: '1' })
@SetModuleName('generate-code')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('Generate Code')
export class GenerateCodeController {
	constructor(private readonly generateCodeService: GenerateCodeService) {}

	@Get('unit')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate unit code' })
	async getUnitCode(@GetUser() user: any) {
		console.log('user gunawan', user);
		return { code: await this.generateCodeService.generateUnitCode() };
	}

	@Get('kategori')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate kategori code' })
	async getKtgCode() {
		return { code: await this.generateCodeService.generateKtgCode() };
	}

	@Get('satuan')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate satuan code' })
	async getStnCode() {
		return { code: await this.generateCodeService.generateSatuanCode() };
	}

	@Get('raw-material')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate raw material code' })
	async getBarangjadiCode() {
		return { code: await this.generateCodeService.generateMentahCode() };
	}

	@Get('customer')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate customer code' })
	async getCustCode() {
		return { code: await this.generateCodeService.generateCustomerCode() };
	}

	@Get('po')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate po code' })
	async getPoCode() {
		return { code: await this.generateCodeService.generatePoCode() };
	}

	@Get('po-rn')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate PO RN code' })
	async generatePoRNCode() {
		return { code: await this.generateCodeService.generatePoRNCode() };
	}

	@Get('po-rn-ekspor')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate PO RN EKSPOR code' })
	async generatePoEksporRNCode() {
		return { code: await this.generateCodeService.generatePoEksporRNCode() };
	}

	@Get('invoice')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate invoice code' })
	async getInvoiceCode() {
		return { code: await this.generateCodeService.generateInvoiceCode() };
	}

	@Get('transaction')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate invoice code' })
	async getTransactionCode() {
		return { code: await this.generateCodeService.generateTransactionCode() };
	}

	@Get('barang')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate barang code' })
	async getBarangCode() {
		return { code: await this.generateCodeService.generateBarangjadiCode() };
	}

	@Get('spb')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate SPB code' })
	async getSPBCode() {
		return { code: await this.generateCodeService.generateSPBCode() };
	}

	@Get('number-jurnal')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate jurnal code' })
	async generateJurnalCode() {
		return { code: await this.generateCodeService.generateJurnalCode() };
	}

	@Get('invoice-ekspor')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET generate invoice ekspor code' })
	async generateInvoiceEksporCode() {
		return { code: await this.generateCodeService.generateInvoiceEksporCode() };
	}
}
