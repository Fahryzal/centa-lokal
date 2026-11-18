import { dayjs } from '@shared/utils/dayjs';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isDate', async: false })
export class IsDate implements ValidatorConstraintInterface {
	validate(date: string, _args: ValidationArguments) {
		return dayjs(date, 'YYYY-MM-DD', true).isValid();
	}
	defaultMessage({ property }: ValidationArguments) {
		return `${property} is not a valid date in the format YYYY-MM-DD`;
	}
}

@ValidatorConstraint({ name: 'isMonth', async: false })
export class IsMonth implements ValidatorConstraintInterface {
	validate(month: string | number, _args: ValidationArguments) {
		const monthNumber = Number(month);
		return monthNumber >= 1 && monthNumber <= 12;
	}
	defaultMessage({ property }: ValidationArguments) {
		return `${property} is not a valid month`;
	}
}

@ValidatorConstraint({ name: 'isYear', async: false })
export class IsYear implements ValidatorConstraintInterface {
	validate(year: string | number, _args: ValidationArguments) {
		return dayjs(String(year), 'YYYY', true).isValid();
	}
	defaultMessage({ property }: ValidationArguments) {
		return `${property} is not a valid year in the format YYYY`;
	}
}
