
async function designSystem(extractedIntent) {
  const design = {
    appName: extractedIntent.appName,
    entities: {},
    roles: {},
    flows: [],
    businessRules: []
  };
  function getDefaultFields(entityName) {
  const defaults = {
    Student: [
      { name: "id", type: "uuid", primary: true },
      { name: "name", type: "string", required: true },
      { name: "email", type: "string", required: true }
    ],

    Teacher: [
      { name: "id", type: "uuid", primary: true },
      { name: "name", type: "string", required: true },
      { name: "department", type: "string" }
    ],

    Class: [
      { name: "id", type: "uuid", primary: true },
      { name: "name", type: "string", required: true },
      { name: "semester", type: "string" }
    ],

    Subject: [
      { name: "id", type: "uuid", primary: true },
      { name: "name", type: "string", required: true },
      { name: "code", type: "string" }
    ],

    Attendance: [
      { name: "id", type: "uuid", primary: true },
      { name: "studentId", type: "uuid" },
      { name: "date", type: "date" },
      { name: "status", type: "string" }
    ]
  };

  return defaults[entityName] || [
    { name: "id", type: "uuid", primary: true },
    { name: "name", type: "string", required: true }
  ];
}
  extractedIntent.entities.forEach(entity => {
    design.entities[entity.name] = {
      name: entity.name,
      fields: [],
      relations: []
    };
    
    if (entity.name === "User") {
      design.entities[entity.name].fields = [
        { name: "id", type: "uuid", primary: true },
        { name: "email", type: "string", required: true, unique: true },
        { name: "password", type: "string", required: true },
        { name: "role", type: "string", required: true },
        { name: "createdAt", type: "datetime", required: true },
        { name: "updatedAt", type: "datetime", required: true }
      ];
    }

    if (entity.name === "Contact") {
      design.entities[entity.name].fields = [
        { name: "id", type: "uuid", primary: true },
        { name: "firstName", type: "string", required: true },
        { name: "lastName", type: "string", required: true },
        { name: "email", type: "string" },
        { name: "phone", type: "string" },
        { name: "company", type: "string" },
        { name: "createdBy", type: "uuid", required: true },
        { name: "createdAt", type: "datetime", required: true },
        { name: "updatedAt", type: "datetime", required: true }
      ];
      design.entities[entity.name].relations.push({ type: "belongsTo", target: "User", foreignKey: "createdBy" });
    }

    if (entity.name === "Subscription") {
      design.entities[entity.name].fields = [
        { name: "id", type: "uuid", primary: true },
        { name: "userId", type: "uuid", required: true },
        { name: "plan", type: "string", required: true },
        { name: "status", type: "string", required: true },
        { name: "startDate", type: "datetime", required: true },
        { name: "endDate", type: "datetime" },
        { name: "createdAt", type: "datetime", required: true },
        { name: "updatedAt", type: "datetime", required: true }
      ];
      design.entities[entity.name].relations.push({ type: "belongsTo", target: "User", foreignKey: "userId" });
    }
    if (design.entities[entity.name].fields.length === 0) {
  design.entities[entity.name].fields =
    getDefaultFields(entity.name);
}
  });
  
  extractedIntent.roles.forEach(role => {
    design.roles[role.name] = {
      name: role.name,
      description: role.description,
      permissions: []
    };

    if (role.name === "Admin") {
      design.roles[role.name].permissions = ["*"];
    }

    if (role.name === "User") {
      design.roles[role.name].permissions = ["read:own", "write:own"];
    }
  });

  extractedIntent.features.forEach(feature => {
    if (feature.name === "Login") {
      design.flows.push({
        name: "User Login",
        steps: ["User enters credentials", "System validates credentials", "System creates session", "User redirected to dashboard"]
      });
    }
  });

  if (extractedIntent.features.some(f => f.name === "Premium Plan")) {
    design.businessRules.push({
      name: "Premium Feature Gating",
      rule: "Only users with active Premium subscription can access premium features"
    });
  }

  return design;
}

module.exports = { designSystem };
