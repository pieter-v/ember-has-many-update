import DS from "ember-data";
import ModelRegistry from "ember-data/types/registries/model";
import RSVP, { resolve } from "rsvp";

export default class Application extends DS.JSONAPIAdapter {
  deleteRecord<K extends keyof ModelRegistry>(
    store: DS.Store,
    type: ModelRegistry[K],
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return resolve();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module "ember-data/types/registries/adapter" {
  export default interface AdapterRegistry {
    application: Application;
  }
}
