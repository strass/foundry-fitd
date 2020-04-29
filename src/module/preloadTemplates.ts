export const preloadTemplates = async function () {
  // Add paths to "systems/fitd/templates"
  const templatePaths = ["systems/fitd/templates/actor-sheet.html", "systems/fitd/templates/item-sheet.html"];

  return loadTemplates(templatePaths);
};
