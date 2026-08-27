const modelSchema = {
  name: "era_model",
  strict: true,
  schema: {
    type: "object",
    properties: {
      entities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            isWeak: { type: "boolean" },
            attributes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: {
                    type: "string",
                    enum: ["string", "int", "float", "boolean", "date", "datetime"]
                  },
                  isPK: { type: "boolean" }
                },
                required: ["name", "type", "isPK"],
                additionalProperties: false
              }
            }
          },
          required: ["name", "isWeak", "attributes"],
          additionalProperties: false
        }
      },
      relationships: {
        type: "array",
        items: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            type: {
              type: "string",
              enum: ["1:1", "1:N", "N:M"]
            },
            description: { type: "string" }
          },
          required: ["from", "to", "type", "description"],
          additionalProperties: false
        }
      }
    },
    required: ["entities", "relationships"],
    additionalProperties: false
  }
};

module.exports = modelSchema;