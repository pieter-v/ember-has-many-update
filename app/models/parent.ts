import DS from "ember-data";
import Child from "./child";

export default class Parent extends DS.Model {
  @DS.hasMany("child") children?: DS.ManyArray<Child>;
  @DS.attr("string") parentName?: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    parent: Parent;
  }
}
