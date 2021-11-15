import {parseWiki} from './src/parse-osmwiki.js';
import {writeXML} from './src/write-presets.js';

(
  async () => {
    const wikiTables = await parseWiki();
    await writeXML(wikiTables);
  }
)().catch(
  error => console.error(error)
)