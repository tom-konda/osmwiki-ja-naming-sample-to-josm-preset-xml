import {parseWiki} from './src/parse-osmwiki.js';
import {writeXML} from './src/write-presets.js';

try {
  const wikiTables = await parseWiki();
  await writeXML(wikiTables);
} catch (error) {
  error => console.error(error);
}
