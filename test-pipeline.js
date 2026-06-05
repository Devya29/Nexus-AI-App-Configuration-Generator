
const { runPipeline } = require('./src/pipeline');

async function test() {
  console.log("Testing pipeline with sample prompt...");
  const prompt = "Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics.";
  
  try {
    const result = await runPipeline(prompt);
    console.log("\n✅ Pipeline complete!");
    console.log("\nIntent Data:");
    console.log(JSON.stringify(result.intent, null, 2));
    console.log("\nFinal Schemas:");
    console.log(JSON.stringify(result.schemas, null, 2));
  } catch (err) {
    console.error("❌ Test failed:", err);
  }
}

test();
