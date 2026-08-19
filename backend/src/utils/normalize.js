function toCamelCase(str) {
  return str
    .replace(/[_\s-]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^(.)/, (chr) => chr.toLowerCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function normalizeModel(model) {
  return {
    entities: model.entities.map((entity) => ({
      ...entity,
      name: toPascalCase(entity.name),
      attributes: entity.attributes.map((attr) => ({
        ...attr,
        name: toCamelCase(attr.name)
      }))
    })),
    relationships: model.relationships.map((rel) => ({
      ...rel,
      from: toPascalCase(rel.from),
      to: toPascalCase(rel.to)
    }))
  };
}

module.exports = { normalizeModel, toCamelCase, toPascalCase };