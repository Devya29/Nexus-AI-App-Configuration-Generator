
async function refineSchemas(schemas) {
  const refined = JSON.parse(JSON.stringify(schemas));

  refined.ui.layouts = [{
    name: "MainLayout",
    components: ["Header", "Sidebar", "Footer"]
  }];

  return refined;
}

module.exports = { refineSchemas };
