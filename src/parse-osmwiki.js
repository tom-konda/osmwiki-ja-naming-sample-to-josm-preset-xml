import wtf from 'wtf_wikipedia';

wtf.extend((models, templates) => {    
  templates.tag = (template, list) => {
    let tagArray = template.match(/{{(.+?)}}/)[1].split('|').slice(1);
    let key = '';
    let value = '';
    tagArray.forEach(
      (text = '') => {
        if (text.includes('=') === false) {
          if (key === '') {
            key = text;
          }
          else if (value === '') {
            value = text;
          }
        }
      }
    )

    if (key !== '' && value != '') {
      list.push({
        template: 'tag',
        kv : {key, value},
      });
      return `${key}=${value}`;
    }
  }
});

export async function parseWiki() {
  const osm = await wtf.fetch('JA:Naming_sample', { domain: 'wiki.openstreetmap.org', path: 'w/api.php'});
  const [...wikiTextSectionTitles] = wikiText.match(/==.+?==/g);
  const [...sectionWikitexts] = wikiText.split(/==.+?==\n/g);
  const sectionTitles = [...[''], ...wikiTextSectionTitles];
  return osm.sections().map(
    (section, index) => {
      if (sectionTitles[index]) {
        const sectionTitle = wtf(sectionTitles[index].match(/==(.+?)==/)[1].trim()).text();
        if (sectionTitle && RegExp(/^[_a-z]+=[_a-z]+$/).exec(sectionTitle)) {
          const [key, value] = sectionTitle.split('=');
          const sectionWikitext = sectionWikitexts[index];
          const [, tableCaption] = sectionWikitext.match(/\|\+(.+)\n/m);
          const tables = section.tables();
          let tableKeyValue = [];
          if (tableCaption && tables) {
            tables.forEach(
              table => {
                tableKeyValue = [...tableKeyValue, ...table.keyValue().map(item => new Map(Object.entries(item)))];
              }
            )
          }
          return {
            description: tableCaption,
            key,
            value,
            candidates: tableKeyValue,
          }
        }
      }
      return null;
    }
  ).filter(value => value !== null);
}