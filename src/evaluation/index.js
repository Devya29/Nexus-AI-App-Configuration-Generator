
const { runPipeline } = require('../pipeline');

const realPrompts = [
  "Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics.",
  "Create a todo list app with user authentication, task management, and due dates.",
  "Build a blog platform with posts, comments, authors, and admin dashboard.",
  "Create an e-commerce product listing with categories, search, and product details.",
  "Build a social media app with user profiles, posts, and follow functionality.",
  "Create a project management tool with tasks, boards, and team collaboration.",
  "Build a chat application with real-time messaging and user statuses.",
  "Create a fitness tracker with workout logging, goals, and progress charts.",
  "Build a recipe app with search, favorites, and ingredient lists.",
  "Create a weather app with location-based forecasts and current conditions."
];

const edgeCases = [
  "",
  "Build something cool.",
  "I want an app. It should do things. Maybe with users?",
  "Build a CRM with login, contacts, and also remove all users immediately.",
  "Create a todo list app with time travel, teleportation, and AI that predicts your tasks.",
  "Build an app with login, login, login, and more login.",
  "Create a blog with posts that can't be read, only written.",
  "Build an e-commerce site that sells nothing but dreams.",
  "Create a social network where everyone is anonymous and no one can post.",
  "Build an app with 1000 features, all of which are premium only."
];

async function runEvaluation() {
  console.log("🧪 Starting Evaluation...\n");
  const results = {
    realPrompts: [],
    edgeCases: [],
    overall: {
      totalTests: 0,
      successCount: 0,
      totalRetries: 0,
      totalDuration: 0
    }
  };

  console.log("📝 Testing Real Prompts...");
  for (let i = 0; i < realPrompts.length; i++) {
    const prompt = realPrompts[i];
    console.log(`  Testing ${i + 1}/${realPrompts.length}...`);
    const result = await runPipeline(prompt);
    results.realPrompts.push({
      prompt,
      success: result.success,
      metrics: result.metrics
    });
    results.overall.totalTests++;
    if (result.success) results.overall.successCount++;
    results.overall.totalRetries += result.metrics?.retries || 0;
    results.overall.totalDuration += result.metrics?.totalDuration || 0;
  }

  console.log("\n⚡ Testing Edge Cases...");
  for (let i = 0; i < edgeCases.length; i++) {
    const prompt = edgeCases[i];
    console.log(`  Testing ${i + 1}/${edgeCases.length}...`);
    const result = await runPipeline(prompt);
    results.edgeCases.push({
      prompt: prompt || "(empty)",
      success: result.success,
      metrics: result.metrics
    });
    results.overall.totalTests++;
    if (result.success) results.overall.successCount++;
    results.overall.totalRetries += result.metrics?.retries || 0;
    results.overall.totalDuration += result.metrics?.totalDuration || 0;
  }

  console.log("\n✅ Evaluation Complete!");
  console.log("\n📊 Overall Metrics:");
  console.log(`  Total Tests: ${results.overall.totalTests}`);
  console.log(`  Success Rate: ${((results.overall.successCount / results.overall.totalTests) * 100).toFixed(2)}%`);
  console.log(`  Total Retries: ${results.overall.totalRetries}`);
  console.log(`  Total Duration: ${results.overall.totalDuration}ms`);
  console.log(`  Avg Duration: ${(results.overall.totalDuration / results.overall.totalTests).toFixed(2)}ms`);

  return results;
}

module.exports = { runEvaluation };
