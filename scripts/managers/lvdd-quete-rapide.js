import { SystemManager } from "./manager.js";
import { ActionHandlerLvddQueteRapide as ActionHandler } from "../actions/lvdd-quete-rapide/lvdd-quete-rapide-actions.js";
import { RollHandlerBaseLvddQueteRapide as Core } from "../rollHandlers/lvdd-quete-rapide/lvdd-quete-rapide-base.js";
import * as settings from "../settings/lvdd-quete-rapide-settings.js";

export class LVDDQueteRapideSystemManager extends SystemManager {
  constructor(appName) {
    super(appName);
  }

  /** @override */
  doGetActionHandler(filterManager, categoryManager) {
    let actionHandler = new ActionHandler(filterManager, categoryManager);
    return actionHandler;
  }

  /** @override */
  getAvailableRollHandlers() {
    let choices = { core: "Core LVDD-Quete-Rapide" };

    return choices;
  }

  /** @override */
  doGetRollHandler(handlerId) {
    return new Core();
  }

  /** @override */
  doRegisterSettings(appName, updateFunc) {
    settings.register(appName, updateFunc);
  }
}
