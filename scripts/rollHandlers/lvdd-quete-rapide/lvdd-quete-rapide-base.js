import { RollHandler } from "../rollHandler.js";
import * as settings from "../../settings.js";

export class RollHandlerBaseLvddQueteRapide extends RollHandler {
  constructor() {
    super();
  }

  async doHandleActionEvent(event, encodedValue) {
    let payload = encodedValue.split("|");

    if (payload.length != 3) {
      super.throwInvalidValueErr();
    }

    let macroType = payload[0];
    let tokenId = payload[1];
    let actionId = payload[2];

    let actor = super.getActor(tokenId);

    if (tokenId === 'multi') {
      for (let t of canvas.tokens.controlled) {
          actor = super.getActor(t.id);
          await this._handleMacros(event, macroType, actor, actionId);
      }
    } else {
        await this._handleMacros(event, macroType, actor, actionId);
    }
  }

  async _handleMacros(event, macroType, actor, actionId) {
    console.log('event in handle macros is => ', event)
    console.log('macroType in handle macros is => ', macroType)
    console.log('actor in handle macros is => ', actor)
    console.log('actionId in handle macros is => ', actionId)
    switch (macroType) {
      case 'attributs':
          this._rollAttribute(actor.id, actionId);
          break
    }
  }

  _rollAttribute(actorID, actionId) {
    console.log('rolling attribute')
  }
}
