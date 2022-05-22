import { ActionHandler } from "../actionHandler.js";
import * as settings from "../../settings.js";

export class ActionHandlerLvddQueteRapide extends ActionHandler {
  constructor(filterManager, categoryManager) {
    super(filterManager, categoryManager);
    this.baseSkillsFr = [
      "Acrobaties",
      "Athlétisme",
      "Attaque au corps à corps",
      "Attaque à distance",
      "Calme",
      "Course",
      "Discrétion",
      "Dressage",
      "Esquive",
      "Intimidation",
      "Investigation",
      "Mensonge",
      "Médecine",
      "Perception",
      "Performance",
      "Perspicacité",
      "Persuasion",
      "Resistance",
      "Séduction",
      "Voler"
    ]
    this.baseSkillsEn = [
      "Acrobatics",
      "Animal handling",
      "Athletics",
      "Calm",
      "Dodge",
      "Endurance",
      "Insight",
      "Intimidation",
      "Investigation",
      "Lying",
      "Medicine",
      "Melee attack",
      "Perception",
      "Performance",
      "Persuasion",
      "Ranged attack",
      "Running",
      "Seduction",
      "Stealing",
      "Stealth"
    ]
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
    let archetypes = this._getArchetypeList(actor, tokenId);
    let inventory = this._getInventory(actor, tokenId);
    let baseSkills = this._getBaseSkills(actor, tokenId);
    let specificSkills = this._getSpecificSkills(actor, tokenId);

    console.log("attributes in do build action list is => ", attributes)

    this._combineCategoryWithList(
      result,
      this.i18n("tokenactionhud.lvddQueteRapide.attributes.categoryName"),
      attributes
    );
    this._combineCategoryWithList(
      result,
      this.i18n("tokenactionhud.lvddQueteRapide.archetypes.categoryName"),
      archetypes
    );
    this._combineCategoryWithList(
      result,
      this.i18n("tokenactionhud.inventory"),
      inventory
    );
    this._combineCategoryWithList(
      result,
      this.i18n("tokenactionhud.lvddQueteRapide.baseSkills"),
      baseSkills
    );
    this._combineCategoryWithList(
      result,
      this.i18n("tokenactionhud.lvddQueteRapide.specificSkills"),
      specificSkills
    );

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
      attributeSubCategory.actions.push({
        name: this.i18n(`tokenactionhud.lvddQueteRapide.attributes.${attributeName}`),
        encodedValue: [type, tokenId, attributeName].join(this.delimiter),
      });
    }

    this._combineSubcategoryWithCategory(attributeCategory, this.i18n(`tokenactionhud.lvddQueteRapide.attributes.categoryName`), attributeSubCategory);

    return attributeCategory
  }

  _getArchetypeList(actor, tokenId) {
    let categoryId = "archetypes";
    let type = "archetype";
    let archetypeCategory = this.initializeEmptyCategory(categoryId);
    let archetypeSubCategory = this.initializeEmptySubcategory();

    for (let archetypeName in actor.data.data.archetypes) {
      archetypeSubCategory.actions.push({
        name: this.i18n(`tokenactionhud.lvddQueteRapide.archetypes.${archetypeName}`),
        encodedValue: [type, tokenId, archetypeName].join(this.delimiter),
      });
    }

    this._combineSubcategoryWithCategory(archetypeCategory, this.i18n(`tokenactionhud.lvddQueteRapide.archetypes.categoryName`), archetypeSubCategory);

    return archetypeCategory
  }

  _getInventory(actor, tokenId) {
    let categoryId = "inventory";
    let type = "inventory";
    let inventoryCategory = this.initializeEmptyCategory(categoryId);
    let inventorySubCategory = this.initializeEmptySubcategory();

    actor.data.data.resources.items.forEach(item => {
      if (item.data.data.canBeRolled && item.data.data.rollStats.length > 0) {
        inventorySubCategory.actions.push({
          name: item.name,
          img: item.img,
          encodedValue: [type, tokenId, item.name].join(this.delimiter),
        });
      }
    })

    this._combineSubcategoryWithCategory(inventoryCategory, this.i18n(`tokenactionhud.inventory`), inventorySubCategory);

    return inventoryCategory
  }

  _getBaseSkills(actor, tokenId) {
    let categoryId = "baseSkills";
    let type = "baseSkill";
    let baseSkillCategory = this.initializeEmptyCategory(categoryId);
    let baseSkillSubCategory = this.initializeEmptySubcategory();

    actor.data.data.skills.items.forEach(skill => {
      if ((this.baseSkillsFr.includes(skill.name) || this.baseSkillsEn.includes(skill.name)) && (skill.data.data.canBeRolled && (skill.data.data.rollStats &&skill.data.data.rollStats.length > 0))) {
        baseSkillSubCategory.actions.push({
          name: skill.name,
          img: skill.img,
          encodedValue: [type, tokenId, skill.name].join(this.delimiter),
        });
      }
    })

    this._combineSubcategoryWithCategory(baseSkillCategory, this.i18n("tokenactionhud.lvddQueteRapide.baseSkills"), baseSkillSubCategory);

    return baseSkillCategory
  }

  _getSpecificSkills(actor, tokenId) {
    let categoryId = "specificSkills";
    let type = "specificSkill";
    let specificSkillCategory = this.initializeEmptyCategory(categoryId);
    let specificSkillSubCategory = this.initializeEmptySubcategory();

    actor.data.data.skills.items.forEach(skill => {
      if ((!this.baseSkillsFr.includes(skill.name) && !this.baseSkillsEn.includes(skill.name)) && (skill.data.data.canBeRolled && (skill.data.data.rollStats && skill.data.data.rollStats.length > 0))) {
        specificSkillSubCategory.actions.push({
          name: skill.name,
          img: skill.img,
          encodedValue: [type, tokenId, skill.name].join(this.delimiter),
        });
      }
    })

    this._combineSubcategoryWithCategory(specificSkillCategory, this.i18n("tokenactionhud.lvddQueteRapide.specificSkills"), specificSkillSubCategory);

    return specificSkillCategory
  }

  /** @override */
  _setFilterSuggestions(id, items) {
    let suggestions = items?.map((s) => {
      return { id: s.id, value: s.name };
    });
    if (suggestions?.length > 0)
      this.filterManager.setSuggestions(id, suggestions);
  }

}
