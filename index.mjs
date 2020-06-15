import {parseWiki} from './src/parse-osmwiki.mjs';
import {writeXML} from './src/write-presets.mjs';

(
  async () => {
    const wikiTables = await parseWiki();
    await writeXML(wikiTables);
  }
)().catch(
  error => console.error(error)
)