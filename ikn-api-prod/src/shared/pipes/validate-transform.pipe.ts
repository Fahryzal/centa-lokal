import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TransformGroup } from '@src/common/utils/helper/transform.helper';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidateTransformPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.shouldValidate(metatype)) return value;
		const object = plainToInstance(metatype, value);
		const errors = await validate(object);
		if (errors.length === 0) return plainToInstance(metatype, value, TransformGroup);
		throw new BadRequestException(this.formatErrors(errors));
	}

	private formatErrors(errors: ValidationError[]): string {
		return errors.flatMap((error) => this.flattenValidationErrors(error))[0];
	}

	private flattenValidationErrors(error: ValidationError): string[] {
		const constraints = error.constraints ? Object.values(error.constraints) : [];
		const childrenErrors = error.children?.flatMap((child) => this.flattenValidationErrors(child)) || [];
		return [...constraints, ...childrenErrors];
	}

	private shouldValidate(metatype: new (...args: any[]) => any): boolean {
		const nonValidatedTypes: (new (...args: any[]) => any)[] = [String, Boolean, Number, Array, Object];
		return !nonValidatedTypes.includes(metatype);
	}
}
