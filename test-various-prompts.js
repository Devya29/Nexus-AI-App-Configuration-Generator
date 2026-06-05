
const { runPipeline } = require('./src/pipeline');

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
      const result = await runPipeline(testPrompts[i]);
      console.log("\n✅ Success!");
      console.log("Entities found:", result.intent.entities.map(e => e.name));
    } catch (err) {
      console.error("\n❌ Failed:", err);
    }
  }
}

testAll();
