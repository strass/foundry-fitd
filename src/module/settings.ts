import { SimpleActor } from "./actor.js";
import { SimpleItemSheet } from "./item-sheet.js";
import { FitDActorSheet } from "./actor-sheet.js";

export const registerSettings = function () {
  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2,
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = SimpleActor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dnd5e", FitDActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dnd5e", SimpleItemSheet, { makeDefault: true });

  // Register system settings
  game.settings.register("fitd", "macroShorthand", {
    name: "Shortened Macro Syntax",
    hint:
      "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value. Disable this setting if you need the ability to reference the full attribute model, for example @attributes.str.label.",
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });
};
