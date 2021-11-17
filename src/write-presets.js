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
          let itemElement = {};
          const keys = [];
          const texts = [];
          candidate.forEach(
            (value, key) => {
              if (value === '') {
                return false;
              }
              if (key.includes('name') || key.includes('brand')) {
                if (key === 'name') {
                  itemElement = {
                    '@name': value,
                    '@type': 'node,closedway',
                    '@preset_name_label': 'true',
                  };
                }
                keys.push({'@key': key, '@value': value});
              }
              else if (key.includes('operator') || key.includes('branch')) {
                texts.push({'@key': key.match(/[a-z]+/), '@text': `${key}：${value}`});
              }
            }
          );
          itemElement = {
            ...itemElement,
            ...{
              reference: {'@ref': `${key}_${value}`},
              key: keys,
              text: texts,
            }
          }
          return itemElement;
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
      '@xmlns': 'https://josm.openstreetmap.de/tagging-preset-1.0',
      '@author': 'Tom Konda and OSM wiki contributors',
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