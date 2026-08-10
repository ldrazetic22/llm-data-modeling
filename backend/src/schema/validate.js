const { z } = require('zod');

const attributeSchema = z.object({
  name: z.string().min(1, "Naziv atributa ne smije biti prazan."),
  type: z.enum(["string", "int", "float", "boolean", "date", "datetime"]),
  isPK: z.boolean()
});

const entitySchema = z.object({
  name: z.string().min(1, "Naziv entiteta ne smije biti prazan."),
  attributes: z.array(attributeSchema).min(1, "Entitet mora imati barem jedan atribut.")
}).refine(
  (entity) => entity.attributes.some((attr) => attr.isPK === true),
  (entity) => ({ message: `Entitet "${entity.name}" nema definiran primarni ključ (isPK: true).` })
);

const relationshipSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(["1:1", "1:N", "N:M"]),
  description: z.string().min(1)
});

const eraModelSchema = z.object({
  entities: z.array(entitySchema).min(1, "Model mora sadržavati barem jedan entitet."),
  relationships: z.array(relationshipSchema)
}).superRefine((model, ctx) => {
  const entityNames = model.entities.map((e) => e.name);

  // provjera da relationships referenciraju postojeće entitete
  model.relationships.forEach((rel, index) => {
    if (!entityNames.includes(rel.from)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Relacija #${index + 1}: entitet "${rel.from}" (from) ne postoji među definiranim entitetima.`
      });
    }
    if (!entityNames.includes(rel.to)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Relacija #${index + 1}: entitet "${rel.to}" (to) ne postoji među definiranim entitetima.`
      });
    }
  });

  // provjera duplikata naziva entiteta
  const duplicates = entityNames.filter((name, i) => entityNames.indexOf(name) !== i);
  if (duplicates.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Pronađeni duplicirani nazivi entiteta: ${[...new Set(duplicates)].join(', ')}`
    });
  }
});

/**
 * Validira ERA model dobiven od LLM-a.
 * @param {object} model - parsirani JSON model
 * @returns {{ success: boolean, data?: object, errors?: string[] }}
 */
function validateModel(model) {
  const result = eraModelSchema.safeParse(model);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => issue.message);
  return { success: false, errors };
}

module.exports = { validateModel };