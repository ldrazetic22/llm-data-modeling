/**
 * Pretvara relacijsku shemu (tables s attributes i foreignKeys) u standardnu
 * tekstualnu notaciju: NazivRelacije(PK, atribut, FK...)
 * PK je označen <u>, FK je označen <mark> - HTML spreman za prikaz na frontendu.
 *
 * @param {object} relationalSchema - { tables: [...] }
 * @returns {string} - HTML string, jedna relacija po redu
 */
function relationalToText(relationalSchema) {
  const lines = relationalSchema.tables.map((table) => {
    const fkNames = new Set(table.foreignKeys.map((fk) => fk.name));

    const attrStrings = table.attributes.map((attr) => {
      if (attr.isPK) {
        return `<u>${attr.name}</u>`;
      }
      if (fkNames.has(attr.name)) {
        return `<mark>${attr.name}</mark>`;
      }
      return attr.name;
    });

    return `${table.name}(${attrStrings.join(', ')})`;
  });

  return lines.join('<br>');
}

module.exports = { relationalToText };