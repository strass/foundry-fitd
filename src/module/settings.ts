import { SimpleActor } from "./actor.js";
import { SimpleItemSheet } from "./item-sheet.js";
import { FitDActorSheet } from "./actor-sheet.js";
import type Lodash from "lodash";
const _: typeof Lodash = require("lodash");

const helpers: Record<string, any> = require("handlebars-helpers")();

function repeat({ count, start, step }, thisArg) {
  var max = count * step + start;
  var index = start;
  var str = "";

  while (index < max) {
    str += thisArg;
    index += step;
  }
  return str;
}

function repeatBlock({ count, start, step }, thisArg, options) {
  var max = count * step + start;
  var index = start;
  var str = "";

  do {
    var data = {
      index,
      count,
      start,
      step,
      first: index === start,
      last: index >= max - step,
    };
    var blockParams = [index, data];
    str += options.fn(thisArg, { data, blockParams });
    index += data.step;
  } while (index < max);

  return str;
}

export const registerSettings = function () {
  console.log("foundry-fitd | Registering settings");
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

  Handlebars.registerHelper("array", function () {
    return Array.prototype.slice.call(arguments, 0, -1);
  });
  Handlebars.registerHelper("repeat", function () {
    var args = arguments;

    if (args.length > 2) {
      throw new Error(`Expected 0, 1 or 2 arguments, but got ${args.length}`);
    }

    var options = args[args.length - 1];
    var hash = options.hash || {};
    var count = hash.count || args[0] || 0;
    var start = hash.start || 0;
    var step = hash.step || 1;
    var data = { count, start, step };

    if (typeof args[0] === "string" && !_.isNumber(args[0]) && args[0] !== "") {
      return repeat(data, args[0]);
    }

    if (data.count > 0) {
      return repeatBlock(data, this, options);
    }

    return options.inverse(this);
  });
  console.log(helpers);
  _.forEach(helpers, (helper, key) => {
    console.log(`foundry-fitd | Registering Handlebars helper "${key}"`);
    Handlebars.registerHelper(key, helper);
  });
};
