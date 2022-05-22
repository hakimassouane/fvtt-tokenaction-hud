import { RollHandler } from "../rollHandler.js";

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
    switch (macroType) {
      case 'attribute':
          this._rollAttribute(actor, actionId);
          break
      case 'archetype':
        this._rollArchetype(actor, actionId);
        break
      case 'inventory':
          this._rollInventory(event, actionId);
          break
      case 'baseSkill':
          this._rollBaseSkill(event, actionId);
          break
      case 'specificSkill':
        this._rollSpecificSkill(event, actionId);
        break
    }
  }

  _rollAttribute(actor, actionId) {
    game.boilerplate.handleTokenActionHudStats(actor, actionId);
  }

  _rollArchetype(actor, actionId) {
    game.boilerplate.handleTokenActionHudStats(actor, actionId);
  }

  _rollInventory(event, actionId) {
    game.boilerplate.handleTokenActionHudItems(event, actionId);
  }

  _rollBaseSkill(event, actionId) {
    game.boilerplate.handleTokenActionHudItems(event, actionId);
  }

  _rollSpecificSkill(event, actionId) {
    game.boilerplate.handleTokenActionHudItems(event, actionId);
  }
}
