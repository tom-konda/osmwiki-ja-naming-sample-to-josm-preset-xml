
// const xmlBuilder = require('xmlbuilder');
import xmlBuilder from 'xmlBuilder';
import {promises} from 'fs';

export async function writeXML(wikiTables) {
  let chunks = [];
  const presetXML = wikiTables.map(
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
          const items = [];
          const keys = [];
          const texts = [];
          candidate.forEach(
            (value, key) => {
              if (value === '') {
                return false;
              }
              if (key.includes('name') || key.includes('brand')) {
                if (key === 'name') {
                  items.push({
                    '@name': value,
                    '@type': 'node,closedway',
                    '@preset_name_label': 'true',
                  });
                }
                keys.push({'@key': key, '@value': value});
              }
              else if (key.includes('operator') || key.includes('branch')) {
                texts.push({'@key': key.match(/[a-z]+/), '@text': `${key}：${value}`});
              }
            }
          );
          items[items.length - 1].reference = {'@ref': `${key}_${value}`}
          items[items.length - 1].key = keys;
          items[items.length - 1].text = texts;
          return items;
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
      '@xmlns': 'http://josm.openstreetmap.de/tagging-preset-1.0',
      '@author': 'Tom Konda and contributers',
      '@version': Date.now(),
      '@shortdescription': 'OSM wiki JA:Naming sample presets',
      '@baselanguage': 'ja',
      chunk: chunks,
      group: {
        '@name': 'OSM wiki JA:Naming sample',
        group : presetXML,
      },
    }
  };
  const presetRoot = xmlBuilder.create(presetRootObj).end({pretty: true});
  return promises.writeFile('./dist/presets.xml', presetRoot);
}