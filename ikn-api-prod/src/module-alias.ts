import * as moduleAlias from 'module-alias';
import { join } from 'path';

const rootDir = __dirname;
const distDir = join(rootDir, 'dist');

moduleAlias.addAliases({
	'@src': join(distDir, 'src'),
	'@modules': join(distDir, 'src/modules'),
	'@common': join(distDir, 'src/common'),
	'@shared': join(distDir, 'src/shared'),
	'@guards': join(distDir, 'src/guards'),
});
