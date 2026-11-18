import day from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

day.extend(CustomParseFormat);

export const dayjs = day;
