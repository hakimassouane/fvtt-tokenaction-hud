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
      case 'attribute':
          this._rollAttribute(actor.id, actionId);
          break
      case 'archetype':
        this._rollArchetype(actor.id, actionId);
        break
      case 'inventory':
          this._rollInventory(event, actor.id, actionId);
          break
      case 'baseSkill':
          this._rollBaseSkill(event, actor.id, actionId);
          break
      case 'specificSkill':
        this._rollSpecificSkill(event, actor.id, actionId);
        break
    }
  }

  _rollAttribute(actorID, actionId) {
    console.log('rolling attribute')
  }

  _rollArchetype(actorID, actionId) {
    console.log('rolling archetype')
  }

  _rollInventory(event, actorID, actionId) {
    console.log('rolling inventory')
    game.boilerplate.rollItemMacro(actionId, {});
  }

  _rollBaseSkill(event, actorID, actionId) {
    console.log('rolling base skill')
    game.boilerplate.rollItemMacro(actionId, {});
  }

  _rollSpecificSkill(event, actorID, actionId) {
    console.log('rolling specific skill')
    game.boilerplate.rollItemMacro(actionId, {});
  }
}
