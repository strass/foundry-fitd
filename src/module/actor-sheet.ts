import { FitDActorSheetData } from "../types/actor";
import type Lodash from "lodash";
const _: typeof Lodash = require("lodash");

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class FitDActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fitd", "sheet", "actor"],
      template: "systems/fitd/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData(): FitDActorSheetData {
    const sheet = super.getData();
    console.log("getData:", sheet);
    return sheet as any;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html: HTMLElement | JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    (html as JQuery<HTMLElement>).find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      if (item) {
        item.sheet.render(true);
      } else {
        console.error("Could not find item");
      }
    });

    // Delete Inventory Item
    (html as JQuery<HTMLElement>).find(".item-delete").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Add or Remove Attribute
    (html as JQuery<HTMLElement>).find(".attributes").on(
      // @ts-ignore
      "click",
      ".attribute-control",
      this._onClickAttributeControl.bind(this)
    );
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = (this.element as JQuery<Element>).find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickAttributeControl(event: MouseEvent) {
    event.preventDefault();
    const a = event.currentTarget;
    // @ts-ignore
    const action = a?.dataset.action;
    const attrs = this.object.data.data.attributes;
    const form = this.form;

    // Add new attribute
    if (action === "create") {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key" value="attr${nk}"/>`;
      newKey = newKey.children[0] as HTMLDivElement;
      form.appendChild(newKey);
      await this._onSubmit(event);
    }

    // Remove existing attribute
    else if (action === "delete") {
      // @ts-ignore
      const li = a.closest(".attribute");
      li.parentElement.removeChild(li);
      await this._onSubmit(event);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event: MouseEvent, formData: Record<string, any>) {
    // Sync the sheet's name with the data's name
    console.debug("_updateObject in", formData);
    formData["data.name"] = formData.name;
    formData["data.stress"] =
      _.findLastIndex(formData["data.stress"] as boolean[], Boolean) + 1;
    // Server complains if I don't do this?
    formData["img"] = undefined;
    console.debug("_updateObject out:", formData);
    return this.object.update(formData);
  }
}
