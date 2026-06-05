
const { INTENT_EXTRACTION_SCHEMA, SYSTEM_DESIGN_SCHEMA, SCHEMA_GENERATION_SCHEMA } = require('../types');
const { callLLM } = require('../llm');

async function validateAndRepair(data, schema, stage) {
  const result = {
    valid: true,
    errors: [],
    repaired: data
  };

  function checkRequired(obj, requiredFields, path) {
    requiredFields.forEach(field => {
      if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
        result.valid = false;
        result.errors.push(`Missing required field: ${path}${field}`);
        if (schema.properties && schema.properties[field]) {
          if (schema.properties[field].type === "array") obj[field] = [];
          if (schema.properties[field].type === "object") obj[field] = {};
          if (schema.properties[field].type === "string") obj[field] = "";
        }
      }
    });
  }

  checkRequired(data, schema.required, "");

  Object.keys(data).forEach(key => {
    if (schema.properties && schema.properties[key]) {
      const expectedType = schema.properties[key].type;
      const actualType = Array.isArray(data[key]) ? "array" : typeof data[key];
      if (actualType !== expectedType) {
        result.valid = false;
        result.errors.push(`Type mismatch for ${key}: expected ${expectedType}, got ${actualType}`);
        if (expectedType === "array") data[key] = [];
        if (expectedType === "object") data[key] = {};
        if (expectedType === "string") data[key] = "";
      }
    }
  });

  // If basic repair didn't work, try LLM-powered intelligent repair
  if (!result.valid) {
    console.log(`🔧 Trying LLM-powered repair for stage: ${stage}`);
    const llmRepair = await callLLM(
      `Fix this invalid JSON data (stage: ${stage}) to match this schema:\n\nSchema: ${JSON.stringify(schema, null, 2)}\n\nInvalid data: ${JSON.stringify(data, null, 2)}\n\nErrors: ${JSON.stringify(result.errors, null, 2)}`,
      "You are a JSON repair assistant. Fix invalid JSON data to match the given schema. Output only valid JSON, no extra text."
    );

    if (llmRepair) {
      console.log("✅ LLM repair successful");
      result.repaired = llmRepair;
      result.valid = true;
    }
  }

  return result;
}

module.exports = { validateAndRepair };
