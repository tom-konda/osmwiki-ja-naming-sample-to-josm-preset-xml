import xmlBuilder from 'xmlBuilder';
import {writeFile} from 'fs/promises';

export async function writeXML(wikiTables) {
  let chunks = [];
  const groups = wikiTables.map(
    wikiTable => {
      const {key, value, description, candidates} = wikiTable;
      chunks.push({
        '@id': `${key}_${value}`,
        key: {
          '@key': key,
          '@value': value,
        },
      });
      const keys = candidates.map(
        candidate => {
          const keys = [];
          const texts = [];
          candidate.forEach(
            (value, key) => {
              if (value === '') {
                return false;
              }
              if (key.includes('name') || key.includes('brand')) {
                if (key === 'name') {
                    '@name': value,
                    '@type': 'node,closedway',
                    '@preset_name_label': 'true',
                }
                keys.push({'@key': key, '@value': value});
              }
              else if (key.includes('operator') || key.includes('branch')) {
                texts.push({'@key': key.match(/[a-z]+/), '@text': `${key}：${value}`});
              }
            }
          );
        }
      )
      return {
        '@name': description,
        item: keys,
      }
    }
  )
  const presetRootObj = {
    presets: {
      '@version': Date.now(),
      '@shortdescription': 'OSM wiki JA:Naming sample presets',
      '@baselanguage': 'ja',
      chunk: chunks,
      group: {
        '@name': 'OSM wiki JA:Naming sample',
        group : groups,
      },
    }
  };
  const presetRoot = xmlBuilder.create(presetRootObj).end({pretty: true});
  return writeFile('./dist/presets.xml', presetRoot);
}