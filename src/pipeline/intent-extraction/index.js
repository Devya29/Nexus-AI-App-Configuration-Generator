
const { callLLM } = require('../../llm');

async function extractIntent(userPrompt) {
  const baseSystemPrompt = `You are an intent extractor for an app configuration generator. Your task is to parse the user's app idea into structured JSON.

Follow these rules STRICTLY:
1. Output ONLY valid JSON - NO extra text
2. Use this exact schema:
{
  "appName": string,
  "features": array of { "name": string, "description": string },
  "roles": array of { "name": string, "description": string },
  "entities": array of { "name": string, "description": string },
  "assumptions": array of strings,
  "missingInfo": array of strings
}

CRITICAL REQUIREMENT: You MUST ALWAYS extract entities from the app description!

Examples of entities:
- CRM: Contact, User, Subscription, Lead
- Hospital/Clinic: Doctor, Patient, Appointment, MedicalRecord
- Ecommerce: Product, Order, Customer, Cart
- Blog: Post, Comment, Author, Category
- Social Media: User, Post, Comment, Follow
- Todo App: Task, Project, User
- Project Management: Task, Project, User, Team

Entities are the core data objects the app will store and manage.

If prompt is vague, make reasonable assumptions and list them in 'assumptions'.`;

  // First try LLM-powered extraction
  let llmResult = await callLLM(`Parse this app idea:\n${userPrompt}`, baseSystemPrompt);

  // If entities are empty, retry with a stronger, more explicit prompt
  if (llmResult && (!llmResult.entities || llmResult.entities.length === 0)) {
    console.log("⚠️ Entities array empty - retrying with stronger prompt...");
    const retryPrompt = `CRITICAL: You MUST extract ENTITIES from the following app idea!
Entities are core data objects the app stores (like User, Contact, Product, Order, etc.)

App idea: ${userPrompt}

Output JSON with 'entities' array containing at least 1 entity!`;
    llmResult = await callLLM(retryPrompt, baseSystemPrompt);
  }

  if (llmResult) {
    console.log("✅ Using LLM-extracted intent");
    const intent = {
      appName: llmResult.appName || "NexusApp",
      features: llmResult.features || [],
      roles: llmResult.roles || [],
      entities: llmResult.entities || [],
      assumptions: llmResult.assumptions || [],
      missingInfo: llmResult.missingInfo || []
    };

    // Final fallback - ensure entities is never empty
    if (intent.entities.length === 0) {
      console.log("⚠️ Entities still empty - adding default User entity");
      intent.assumptions.push("Assuming basic User entity is required");
      intent.entities.push({ name: "User", description: "System user" });
    }

    return intent;
  }

  // Fallback to hardcoded logic if LLM fails
  console.log("⚠️ Using fallback intent extraction");
  const extracted = {
    appName: "NexusApp",
    features: [],
    roles: [],
    entities: [],
    assumptions: [],
    missingInfo: []
  };

  const lowerPrompt = userPrompt.toLowerCase();

  if (lowerPrompt.includes("crm")) {
    extracted.appName = "CRM System";
    extracted.entities.push({ name: "Contact", description: "Customer contact information" });
    extracted.entities.push({ name: "User", description: "System user" });
  }

  if (lowerPrompt.includes("hospital") || lowerPrompt.includes("clinic") || lowerPrompt.includes("doctor") || lowerPrompt.includes("patient")) {
    extracted.appName = "Hospital Management System";
    extracted.entities.push({ name: "Doctor", description: "Medical professional" });
    extracted.entities.push({ name: "Patient", description: "Person receiving medical care" });
    extracted.entities.push({ name: "Appointment", description: "Scheduled medical visit" });
  }

  if (lowerPrompt.includes("ecommerce") || lowerPrompt.includes("e-commerce") || lowerPrompt.includes("product") || lowerPrompt.includes("order")) {
    extracted.appName = "E-commerce Platform";
    extracted.entities.push({ name: "Product", description: "Item for sale" });
    extracted.entities.push({ name: "Customer", description: "Person making purchases" });
    extracted.entities.push({ name: "Order", description: "Customer purchase record" });
  }

  if (lowerPrompt.includes("blog") || lowerPrompt.includes("post")) {
    extracted.appName = "Blog Platform";
    extracted.entities.push({ name: "Post", description: "Blog article or article" });
    extracted.entities.push({ name: "Author", description: "Person writing content" });
    extracted.entities.push({ name: "Comment", description: "User comment on posts" });
  }

  if (lowerPrompt.includes("todo") || lowerPrompt.includes("task")) {
    extracted.appName = "Todo List App";
    extracted.entities.push({ name: "Task", description: "Task or todo item" });
    extracted.entities.push({ name: "User", description: "System user" });
  }

  if (lowerPrompt.includes("login")) {
    extracted.features.push({ name: "Login", description: "User authentication" });
  }

  if (lowerPrompt.includes("dashboard")) {
    extracted.features.push({ name: "Dashboard", description: "Overview dashboard" });
  }

  if (lowerPrompt.includes("contacts")) {
    extracted.features.push({ name: "Contact Management", description: "CRUD operations for contacts" });
  }

  if (lowerPrompt.includes("role-based") || lowerPrompt.includes("role based")) {
    extracted.roles.push({ name: "Admin", description: "Full system access" });
    extracted.roles.push({ name: "User", description: "Standard user access" });
  }

  if (lowerPrompt.includes("premium") || lowerPrompt.includes("payment")) {
    extracted.features.push({ name: "Premium Plan", description: "Paid subscription tier" });
    extracted.entities.push({ name: "Subscription", description: "User subscription details" });
  }

  if (lowerPrompt.includes("analytics")) {
    extracted.features.push({ name: "Analytics", description: "Data analytics and insights" });
  }

  if (extracted.features.length === 0) {
    extracted.missingInfo.push("Could not identify key features. Please specify the core features of your app.");
  }

  if (extracted.entities.length === 0) {
    extracted.assumptions.push("Assuming basic User entity is required");
    extracted.entities.push({ name: "User", description: "System user" });
  }

  return extracted;
}

module.exports = { extractIntent };
