
const INTENT_EXTRACTION_SCHEMA = {
  type: "object",
  required: ["appName", "features", "roles", "entities"],
  properties: {
    appName: { type: "string" },
    features: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        }
      }
    },
    roles: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        }
      }
    },
    entities: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        }
      }
    },
    assumptions: { type: "array", items: { type: "string" } },
    missingInfo: { type: "array", items: { type: "string" } }
  }
};

const SYSTEM_DESIGN_SCHEMA = {
  type: "object",
  required: ["appName", "entities", "roles", "flows", "businessRules"],
  properties: {
    appName: { type: "string" },
    entities: { type: "object" },
    roles: { type: "object" },
    flows: { type: "array" },
    businessRules: { type: "array" }
  }
};

const SCHEMA_GENERATION_SCHEMA = {
  type: "object",
  required: ["ui", "api", "db", "auth"],
  properties: {
    ui: { type: "object" },
    api: { type: "object" },
    db: { type: "object" },
    auth: { type: "object" }
  }
};

module.exports = {
  INTENT_EXTRACTION_SCHEMA,
  SYSTEM_DESIGN_SCHEMA,
  SCHEMA_GENERATION_SCHEMA
};
