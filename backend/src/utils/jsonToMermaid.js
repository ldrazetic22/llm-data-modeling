function jsonToMermaid(model) {
  const lines = ['erDiagram'];

  const cardinalityMap = {
    "1:1": "||--||",
    "1:N": "||--o{",
    "N:M": "}o--o{"
  };

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