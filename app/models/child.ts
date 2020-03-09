import DS from "ember-data";
import Parent from "./parent";

export default class Child extends DS.Model {
  @DS.belongsTo("parent") parent!: Parent;
  @DS.attr("string") childName?: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    child: Child;
  }
}
