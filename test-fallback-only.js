
// Test file that bypasses LLM and only uses fallback logic
const originalCallLLM = require('./src/llm').callLLM;
// Override callLLM to always return null (force fallback)
require('./src/llm').callLLM = async () => null;

const { extractIntent } = require('./src/pipeline/intent-extraction');

const testPrompts = [
  "Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics.",
  "Create a hospital management system for doctors and patients with appointments.",
  "Build an e-commerce platform for selling products online.",
  "Create a todo list app with user login."
];

async function testAll() {
  for (let i = 0; i < testPrompts.length; i++) {
    console.log(`\n=== Testing Prompt ${i + 1}: ${testPrompts[i].substring(0, 60)}...`);
    try {
      const intent = await extractIntent(testPrompts[i]);
      console.log("\n✅ Intent extracted!");
      console.log("Entities:", intent.entities);
    } catch (err) {
      console.error("\n❌ Failed:", err);
    }
  }

  // Restore original function
  require('./src/llm').callLLM = originalCallLLM;
}

testAll();
