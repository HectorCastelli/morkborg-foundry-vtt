import { rollMisery } from "../../miseries.js";
import { miseryTrackerAnimations } from "../../settings.js";

export class MBMiseryTrackerSheet extends foundry.appv1.sheets.ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["morkborg", "sheet", "actor", "misery-tracker"],
      width: 500,
      height: 740,
    });
  }

  /** @override */
  get template() {
    return "systems/morkborg/templates/actor/misery-tracker-sheet.hbs";
  }

  /** @override */
  async getData() {
    const data = await super.getData();
    for (let i = 1; i <= 6; i++) {
      const field = `misery${i}`;
      const misery = data.data.system[field];
      data.data.system[field].cssClass =
        misery.psalm && misery.verse ? "activated" : "";
    }
    data.data.system.miseryAnimationClass = miseryTrackerAnimations()
      ? "misery-animations"
      : "";
    data.data.system.seventhMiseryClass = data.data.system
      .seventhMiseryActivated
      ? "seventh-misery"
      : "";

    data.data.system.miseryDieOptions = {
      "1d100": "MB.MiseryDie100",
      "1d20": "MB.MiseryDie20",
      "1d10": "MB.MiseryDie10",
      "1d6": "MB.MiseryDie6",
      "1d2": "MB.MiseryDie2",
    };

    // console.log(data);
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // sheet header
    html.find(".misery-button").on("click", this._rollMisery.bind(this));
  }

  _rollMisery(event) {
    event.preventDefault();
    rollMisery(this.actor);
  }
}
