import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ShareModuleService {
	constructor(private readonly prisma: PrismaService) {}

	async getNextCode(
		table: string,
		column: string,
		prefix: string,
		plus = 1,
		year = new Date().getFullYear(),
		padding = 4,
	): Promise<string> {
		const pattern = `${prefix}-${year}-%`;

		const result = await this.prisma.$queryRawUnsafe<{ max: number | null }[]>(
			`
      SELECT MAX(
        CAST(
          SPLIT_PART("${column}", '-', 3)
          AS INTEGER
        )
      ) AS max
      FROM "${table}"
      WHERE "${column}" LIKE $1
      `,
			pattern,
		);
		const next = (result?.[0]?.max ?? 0) + plus;
		return `${prefix}-${year}-${String(next).padStart(padding, '0')}`;
	}
}
