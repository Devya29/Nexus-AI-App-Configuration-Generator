
const { extractIntent } = require('./intent-extraction');
const { designSystem } = require('./system-design');
const { generateSchemas } = require('./schema-generation');
const { refineSchemas } = require('./refinement');
const { validateAndRepair } = require('../validation');
const { INTENT_EXTRACTION_SCHEMA, SYSTEM_DESIGN_SCHEMA, SCHEMA_GENERATION_SCHEMA } = require('../types');

async function runPipeline(userPrompt) {
  const start = Date.now();
  const metrics = {
    retries: 0,
    stages: []
  };

  try {
    console.log("Stage 1: Intent Extraction...");
    let intentData = await extractIntent(userPrompt);
    metrics.stages.push({ name: "Intent Extraction", status: "in_progress", duration: 0 });
    let validation = await validateAndRepair(intentData, INTENT_EXTRACTION_SCHEMA, "intent-extraction");
    if (!validation.valid) {
      metrics.retries++;
      intentData = validation.repaired;
    }
    metrics.stages[0].status = "completed";
    metrics.stages[0].duration = Date.now() - start;

    console.log("Stage 2: System Design...");
    const designStart = Date.now();
    metrics.stages.push({ name: "System Design", status: "in_progress", duration: 0 });
    let systemDesign = await designSystem(intentData);
    validation = await validateAndRepair(systemDesign, SYSTEM_DESIGN_SCHEMA, "system-design");
    if (!validation.valid) {
      metrics.retries++;
      systemDesign = validation.repaired;
    }
    metrics.stages[1].status = "completed";
    metrics.stages[1].duration = Date.now() - designStart;

    console.log("Stage 3: Schema Generation...");
    const schemaStart = Date.now();
    metrics.stages.push({ name: "Schema Generation", status: "in_progress", duration: 0 });
    let schemas = await generateSchemas(systemDesign);
    validation = await validateAndRepair(schemas, SCHEMA_GENERATION_SCHEMA, "schema-generation");
    if (!validation.valid) {
      metrics.retries++;
      schemas = validation.repaired;
    }
    metrics.stages[2].status = "completed";
    metrics.stages[2].duration = Date.now() - schemaStart;

    console.log("Stage 4: Refinement...");
    const refineStart = Date.now();
    metrics.stages.push({ name: "Refinement", status: "in_progress", duration: 0 });
    const refinedSchemas = await refineSchemas(schemas);
    metrics.stages[3].status = "completed";
    metrics.stages[3].duration = Date.now() - refineStart;

    const totalDuration = Date.now() - start;
    metrics.totalDuration = totalDuration;

    return {
      success: true,
      metrics,
      intent: intentData,
      systemDesign,
      schemas: refinedSchemas
    };

  } catch (error) {
    console.error("Pipeline Error:", error);
    return {
      success: false,
      error: error.message,
      metrics
    };
  }
}

module.exports = { runPipeline };
