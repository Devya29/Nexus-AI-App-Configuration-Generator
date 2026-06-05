async function generateSchemas(systemDesign) {
  const schemas = {
    ui: {
      pages: [],
      components: [],
      layouts: []
    },
    api: {
      endpoints: []
    },
    db: {
      tables: []
    },
    auth: {
      roles: {},
      permissions: {}
    }
  };

  function pluralize(word) {
    const lower = word.toLowerCase();

    if (
      lower.endsWith("s") ||
      lower.endsWith("x") ||
      lower.endsWith("z") ||
      lower.endsWith("ch") ||
      lower.endsWith("sh")
    ) {
      return lower + "es";
    }

    return lower + "s";
  }

  Object.keys(systemDesign.entities).forEach(entityName => {
    const entity = systemDesign.entities[entityName];
    const lowerName = entityName.toLowerCase();
    const pluralName = pluralize(entityName);

    schemas.db.tables.push({
      name: pluralName,
      columns: entity.fields.map(field => ({
        name: field.name,
        type: field.type,
        required: field.required || false,
        unique: field.unique || false,
        primary: field.primary || false
      }))
    });

    schemas.api.endpoints.push({
      path: `/api/${pluralName}`,
      method: "GET",
      description: `List all ${entityName}s`,
      request: {},
      response: { type: "array", items: { type: "object" } }
    });

    schemas.api.endpoints.push({
      path: `/api/${pluralName}/:id`,
      method: "GET",
      description: `Get a single ${entityName}`,
      request: { params: { id: "uuid" } },
      response: { type: "object" }
    });

    schemas.api.endpoints.push({
      path: `/api/${pluralName}`,
      method: "POST",
      description: `Create a new ${entityName}`,
      request: {
        body: entity.fields.filter(
          f =>
            !f.primary &&
            f.name !== "createdAt" &&
            f.name !== "updatedAt"
        )
      },
      response: { type: "object" }
    });

    schemas.api.endpoints.push({
      path: `/api/${pluralName}/:id`,
      method: "PUT",
      description: `Update an existing ${entityName}`,
      request: {
        params: { id: "uuid" },
        body: entity.fields.filter(
          f =>
            !f.primary &&
            f.name !== "createdAt" &&
            f.name !== "updatedAt"
        )
      },
      response: { type: "object" }
    });

    schemas.api.endpoints.push({
      path: `/api/${pluralName}/:id`,
      method: "DELETE",
      description: `Delete a ${entityName}`,
      request: { params: { id: "uuid" } },
      response: { type: "object" }
    });

    schemas.ui.pages.push({
      name: `${entityName}List`,
      path: `/${pluralName}`,
      components: [`${entityName}ListComponent`]
    });

    schemas.ui.pages.push({
      name: `${entityName}Detail`,
      path: `/${pluralName}/:id`,
      components: [`${entityName}DetailComponent`]
    });
  });

  schemas.auth.roles = systemDesign.roles;

  Object.keys(systemDesign.roles).forEach(roleName => {
    schemas.auth.permissions[roleName] =
      systemDesign.roles[roleName].permissions;
  });

  if (systemDesign.appName === "CRM System") {
    schemas.ui.pages.push({
      name: "Dashboard",
      path: "/dashboard",
      components: ["DashboardComponent"]
    });

    schemas.ui.pages.push({
      name: "Login",
      path: "/login",
      components: ["LoginComponent"]
    });
  }

  return schemas;
}

module.exports = { generateSchemas };