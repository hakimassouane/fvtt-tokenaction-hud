import { ActionHandler } from "../actionHandler.js";
import * as settings from "../../settings.js";

export class ActionHandlerLvddQueteRapide extends ActionHandler {
  constructor(filterManager, categoryManager) {
    super(filterManager, categoryManager);
  }

  async doBuildActionList(token, multipleTokens) {
    let result = this.initializeEmptyActionList();
    console.log('Initialize dobuildactionlist tokenHUD')
    if (!token) return result;
    let tokenId = token.id;
    result.tokenId = tokenId;
    let actor = token.actor;
    if (!actor) return result;
    result.actorId = actor.id;

    let attributes = this._getAttributeList(actor, tokenId);
/*     let archetypes = this._getArchetypes(actor, tokenId);
    let inventory = this._getInventory(actor, tokenId);
    let baseSkills = this._getBaseSkills(actor, tokenId);
    let customSkills = this._getCustomSkills(actor, tokenId); */

    console.log("attributes in do build action list is => ", attributes)

    this._combineCategoryWithList(
      result,
      "Attributs",
      attributes
    );
   /*  this._combineCategoryWithList(
      result,
      "Archétypes",
      archetypes
    );
    this._combineCategoryWithList(
      result,
      "Inventaire",
      inventory
    );
    this._combineCategoryWithList(
      result,
      "Compétences de base",
      baseSkills
    );
    this._combineCategoryWithList(
      result,
      "Compétences particulières",
      customSkills
    ); */

    this._setFilterSuggestions(actor);

    if (settings.get("showHudTitle")) result.hudTitle = token.data?.name;

    return result;
  }

  _getAttributeList(actor, tokenId) {
    let categoryId = "attributes";
    let type = "attribute";
    let attributeCategory = this.initializeEmptyCategory(categoryId);
    let attributeSubCategory = this.initializeEmptySubcategory();

    for (let attributeName in actor.data.data.attributes) {
      console.log('Attribute in token hud')
      
      attributeSubCategory.actions.push({
        name: attributeName,
        encodedValue: [type, tokenId, attributeName].join(this.delimiter),
      });

     console.log("Attribute category is => ", attributeSubCategory)
    }

    this._combineSubcategoryWithCategory(attributeCategory, "Attributs", attributeSubCategory);

    return attributeCategory
  }

  _getArchetypes(actor, tokenId) {
    let basicActions = this.initializeEmptySubcategory();

    let unarmed = ["unarmed", tokenId, "unarmed"].join(this.delimiter);
    const unarmedAction = {
      id: "unarmed",
      name: this.i18n("tokenactionhud.unarmed"),
      encodedValue: unarmed,
    };
    basicActions.actions.push(unarmedAction);

    let stompValue = ["stomp", tokenId, "stomp"].join(this.delimiter);
    const stompAction = {
      id: "stomp",
      name: this.i18n("tokenactionhud.stomp"),
      encodedValue: stompValue,
    };
    basicActions.actions.push(stompAction);

    let improvisedValue = ["improvise", tokenId, "improvise"].join(
      this.delimiter
    );
    const improvisedAction = {
      id: "improvise",
      name: this.i18n("tokenactionhud.improvisedWeapon"),
      encodedValue: improvisedValue,
    };
    basicActions.actions.push(improvisedAction);

    let dodgeValue = ["dodge", tokenId, "dodge"].join(this.delimiter);
    const dodgeAction = {
      id: "dodge",
      name: this.i18n("tokenactionhud.dodge"),
      encodedValue: dodgeValue,
    };
    basicActions.actions.push(dodgeAction);

    return basicActions;
  }

  _getInventory(actor, tokenId) {
    let result = this.initializeEmptyCategory("characteristics");
    let macroType = "characteristic";

    let characteristics = Object.entries(actor.characteristics);
    let characteristicsCategory = this.initializeEmptySubcategory();
    characteristicsCategory.actions = characteristics.map((c) => {
      let encodedValue = [macroType, tokenId, c[0]].join(this.delimiter);
      return {
        name: this.i18n(c[1].abrev),
        encodedValue: encodedValue,
        id: c[0],
      };
    });

    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.characteristics"),
      characteristicsCategory
    );

    return result;
  }

  _getBaseSkills(actor, tokenId) {
    let categoryId = "skills";
    let macroType = "skill";

    let result = this.initializeEmptyCategory(categoryId);
    let skills = actor.getItemTypes("skill").filter((i) => i.id);

    result.choices = skills.length;

    let transMelee = game.i18n.localize("tokenactionhud.wfrp.meleeSkillPrefix");
    let transRanged = game.i18n.localize(
      "tokenactionhud.wfrp.rangedSkillPrefix"
    );

    let meleeSkills = skills.filter((s) => s.data.name.startsWith(transMelee));
    let meleeId = `${categoryId}_melee`;
    this._setFilterSuggestions(meleeId, meleeSkills);
    let meleeCat = this.initializeEmptySubcategory(meleeId);
    meleeCat.canFilter = meleeSkills.length > 0 ? true : false;
    let filteredMeleeSkills = this._filterElements(meleeId, meleeSkills);
    meleeCat.actions = this._produceMap(
      tokenId,
      filteredMeleeSkills,
      macroType
    );

    let rangedSkills = skills.filter((s) =>
      s.data.name.startsWith(transRanged)
    );
    let rangedId = `${categoryId}_ranged`;
    this._setFilterSuggestions(rangedId, rangedSkills);
    let rangedCat = this.initializeEmptySubcategory(rangedId);
    rangedCat.canFilter = rangedSkills.length > 0 ? true : false;
    let filteredRangedSkills = this._filterElements(rangedId, rangedSkills);
    rangedCat.actions = this._produceMap(
      tokenId,
      filteredRangedSkills,
      macroType
    );

    let basicSkills = skills.filter(
      (s) =>
        !(
          s.data.name.startsWith(transMelee) ||
          s.data.name.startsWith(transRanged)
        ) && s.data.data.advanced.value !== "adv"
    );
    let basicId = `${categoryId}_basic`;
    this._setFilterSuggestions(basicId, basicSkills);
    let basicSkillsCat = this.initializeEmptySubcategory(basicId);
    let filteredBasicSkills = this._filterElements(basicId, basicSkills);
    basicSkillsCat.canFilter = basicSkills.length > 0 ? true : false;
    basicSkillsCat.actions = this._produceMap(
      tokenId,
      filteredBasicSkills,
      macroType
    );

    let advancedSkills = skills.filter(
      (s) =>
        !(
          s.data.name.startsWith(transMelee) ||
          s.data.name.startsWith(transRanged)
        ) && s.data.data.advanced.value === "adv"
    );
    let advancedId = `${categoryId}_advanced`;
    this._setFilterSuggestions(advancedId, advancedSkills);
    let advancedSkillsCat = this.initializeEmptySubcategory(advancedId);
    advancedSkillsCat.canFilter = advancedSkills.length > 0 ? true : false;
    let filteredAdvancedSkills = this._filterElements(
      advancedId,
      advancedSkills
    );
    advancedSkillsCat.actions = this._produceMap(
      tokenId,
      filteredAdvancedSkills,
      macroType
    );

    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.melee"),
      meleeCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.ranged"),
      rangedCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.basic"),
      basicSkillsCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.advanced"),
      advancedSkillsCat
    );

    return result;
  }

  _getBaseSkills(actor, tokenId) {
    let categoryId = "skills";
    let macroType = "skill";

    let result = this.initializeEmptyCategory(categoryId);
    let skills = actor.getItemTypes("skill").filter((i) => i.id);

    result.choices = skills.length;

    let transMelee = game.i18n.localize("tokenactionhud.wfrp.meleeSkillPrefix");
    let transRanged = game.i18n.localize(
      "tokenactionhud.wfrp.rangedSkillPrefix"
    );

    let meleeSkills = skills.filter((s) => s.data.name.startsWith(transMelee));
    let meleeId = `${categoryId}_melee`;
    this._setFilterSuggestions(meleeId, meleeSkills);
    let meleeCat = this.initializeEmptySubcategory(meleeId);
    meleeCat.canFilter = meleeSkills.length > 0 ? true : false;
    let filteredMeleeSkills = this._filterElements(meleeId, meleeSkills);
    meleeCat.actions = this._produceMap(
      tokenId,
      filteredMeleeSkills,
      macroType
    );

    let rangedSkills = skills.filter((s) =>
      s.data.name.startsWith(transRanged)
    );
    let rangedId = `${categoryId}_ranged`;
    this._setFilterSuggestions(rangedId, rangedSkills);
    let rangedCat = this.initializeEmptySubcategory(rangedId);
    rangedCat.canFilter = rangedSkills.length > 0 ? true : false;
    let filteredRangedSkills = this._filterElements(rangedId, rangedSkills);
    rangedCat.actions = this._produceMap(
      tokenId,
      filteredRangedSkills,
      macroType
    );

    let basicSkills = skills.filter(
      (s) =>
        !(
          s.data.name.startsWith(transMelee) ||
          s.data.name.startsWith(transRanged)
        ) && s.data.data.advanced.value !== "adv"
    );
    let basicId = `${categoryId}_basic`;
    this._setFilterSuggestions(basicId, basicSkills);
    let basicSkillsCat = this.initializeEmptySubcategory(basicId);
    let filteredBasicSkills = this._filterElements(basicId, basicSkills);
    basicSkillsCat.canFilter = basicSkills.length > 0 ? true : false;
    basicSkillsCat.actions = this._produceMap(
      tokenId,
      filteredBasicSkills,
      macroType
    );

    let advancedSkills = skills.filter(
      (s) =>
        !(
          s.data.name.startsWith(transMelee) ||
          s.data.name.startsWith(transRanged)
        ) && s.data.data.advanced.value === "adv"
    );
    let advancedId = `${categoryId}_advanced`;
    this._setFilterSuggestions(advancedId, advancedSkills);
    let advancedSkillsCat = this.initializeEmptySubcategory(advancedId);
    advancedSkillsCat.canFilter = advancedSkills.length > 0 ? true : false;
    let filteredAdvancedSkills = this._filterElements(
      advancedId,
      advancedSkills
    );
    advancedSkillsCat.actions = this._produceMap(
      tokenId,
      filteredAdvancedSkills,
      macroType
    );

    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.melee"),
      meleeCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.ranged"),
      rangedCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.basic"),
      basicSkillsCat
    );
    this._combineSubcategoryWithCategory(
      result,
      this.i18n("tokenactionhud.advanced"),
      advancedSkillsCat
    );

    return result;
  }

  /** @override */
  _setFilterSuggestions(id, items) {
    let suggestions = items?.map((s) => {
      return { id: s.id, value: s.name };
    });
    if (suggestions?.length > 0)
      this.filterManager.setSuggestions(id, suggestions);
  }

  _filterElements(categoryId, skills) {
    let filteredNames = this.filterManager.getFilteredNames(categoryId);
    let result = skills.filter((s) => !!s);
    if (filteredNames.length > 0) {
      if (this.filterManager.isBlocklist(categoryId)) {
        result = skills.filter((s) => !filteredNames.includes(s.name));
      } else {
        result = skills.filter((s) => filteredNames.includes(s.name));
      }
    }

    return result;
  }


  _produceMap(tokenId, itemSet, type) {
    return itemSet.map((i) => {
      let encodedValue = [type, tokenId, i.id].join(this.delimiter);
      let img = this._getImage(i);
      return { name: i.name, encodedValue: encodedValue, id: i.id, img: img };
    })
    .sort((a, b) => {
      return a.name
        .toUpperCase()
        .localeCompare(b.name.toUpperCase(), undefined, {
          sensitivity: "base",
        });
    });
  }

  _getImage(item) {
    let result = "";
    if (settings.get("showIcons")) result = item.img ?? "";

    return result?.includes("icons/svg/mystery-man.svg") ||
      result?.includes("systems/wfrp4e/icons/blank.png")
      ? ""
      : result;
  }
}
