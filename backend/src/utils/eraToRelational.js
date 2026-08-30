const { toCamelCase } = require('./normalize');

/**
 * Transformira ERA model (konceptualna razina) u relacijsku shemu (logička razina).
 * - 1:1 i 1:N veze -> FK atribut na odgovarajućoj tablici
 * - N:M veze -> nova spojna tablica s dva FK-a
 *
 * @param {object} eraModel - { entities, relationships } iz ERA modela
 * @returns {object} - { tables } relacijska shema
 */
function eraToRelational(eraModel) {
  // duboka kopija entiteta kao početne tablice, s dodanim praznim "foreignKeys" nizom
  const tables = eraModel.entities.map((entity) => ({
    name: entity.name,
    attributes: entity.attributes.map((attr) => ({ ...attr })),
    foreignKeys: []
  }));

  const findTable = (name) => tables.find((t) => t.name === name);

  const junctionTables = [];

  eraModel.relationships.forEach((rel) => {
    const fromTable = findTable(rel.from);
    const toTable = findTable(rel.to);

    if (!fromTable || !toTable) {
      // relacija referencira entitet koji ne postoji - preskačemo (validacija bi ovo trebala uhvatiti ranije)
      return;
    }

    if (rel.type === "1:N" || rel.type === "1:1") {
      // FK ide na "to" stranu (konvencija: "from" je "1" strana, "to" je "N" strana kod 1:N;
      // kod 1:1 po defaultu također stavljamo FK na "to" stranu)
      const fkName = toCamelCase(`${rel.from}Id`);

      const alreadyExists = toTable.attributes.some((a) => a.name === fkName);
      if (!alreadyExists) {
        toTable.attributes.push({
          name: fkName,
          type: "int",
          isPK: false
        });
        toTable.foreignKeys.push({
          name: fkName,
          referencesTable: fromTable.name,
          referencesColumn: "id"
        });
      }
    }

      if (rel.type === "N:M") {
      const junctionName = `${rel.from}${rel.to}`;
      const fkFromName = toCamelCase(`${rel.from}Id`);
      const fkToName = toCamelCase(`${rel.to}Id`);

      junctionTables.push({
        name: junctionName,
        attributes: [
          { name: fkFromName, type: "int", isPK: true },
          { name: fkToName, type: "int", isPK: true }
        ],
        foreignKeys: [
          { name: fkFromName, referencesTable: fromTable.name, referencesColumn: "id" },
          { name: fkToName, referencesTable: toTable.name, referencesColumn: "id" }
        ]
      });
    }
  });

  return { tables: [...tables, ...junctionTables] };
}

module.exports = { eraToRelational };