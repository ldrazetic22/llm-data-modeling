/**
 * Pretvara ERA model (entities, relationships) u Mermaid erDiagram sintaksu.
 * @param {object} model - { entities: [...], relationships: [...] }
 * @returns {string} - Mermaid dijagram kao string, spreman za render
 */
function jsonToMermaid(model) {
  const lines = ['erDiagram'];

  // mapiranje naših tipova kardinalnosti na Mermaid simbole
  const cardinalityMap = {
    "1:1": "||--||",
    "1:N": "||--o{",
    "N:M": "}o--o{"
  };

  // relacije (crte između entiteta)
  model.relationships.forEach((rel) => {
    const symbol = cardinalityMap[rel.type] || "||--||";
    const fromName = rel.from.toUpperCase();
    const toName = rel.to.toUpperCase();
    lines.push(`    ${fromName} ${symbol} ${toName} : "${rel.description}"`);
  });

  // entiteti s atributima
  model.entities.forEach((entity) => {
    const entityName = entity.name.toUpperCase();
    lines.push(`    ${entityName} {`);
    entity.attributes.forEach((attr) => {
      const pkLabel = attr.isPK ? ' PK' : '';
      lines.push(`        ${attr.type} ${attr.name}${pkLabel}`);
    });
    lines.push('    }');
  });

  return lines.join('\n');
}

module.exports = { jsonToMermaid };