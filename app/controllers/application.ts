import Controller from "@ember/controller";
import { action, set } from "@ember/object";
import { inject } from "@ember/service";
import { DS } from "ember-data";
import { next } from "@ember/runloop";

const RUNS = 50;
const BATCH_SIZE = 400;

type Run = { size: number; duration: number; payload: any };

export default class Application extends Controller {
  @inject store!: DS.Store;

  runs: Run[] = [];

  init() {
    super.init();

    let size = BATCH_SIZE;
    for (let i = 0; i < RUNS; i++, size += BATCH_SIZE) {
      const payload = {
        data: [
          {
            id: "1",
            type: "parent",
            attributes: { parentName: "parent name" },
            relationships: {
              children: {
                data: []
              }
            }
          }
        ],
        included: []
      };
      const relationships = payload.data[0].relationships.children.data as any[];
      const included = payload.included as any[];

      for (let j = 0; j < size; j++) {
        relationships.push({ id: j.toString(), type: "child" });
        included.push({ id: j.toString(), type: "child", attributes: { childName: "child" + j } });
      }
      this.runs.push({ size, duration: 0, payload });
    }
  }

  private populate(run: Run): Promise<void> {
    return new Promise(resolve => {
      const start = Date.now();
      this.store.push(run.payload);
      set(run, "duration", Date.now() - start);
      next(null, resolve);
    });
  }

  private clear(): Promise<unknown> {
    this.runs.forEach(run => set(run, "duration", 0));
    const childPromises = Promise.all(
      this.store.peekAll("child").map(child => child.destroyRecord())
    );
    const parentPromises = Promise.all(
      this.store.peekAll("parent").map(parent => parent.destroyRecord())
    );
    return Promise.all([childPromises, parentPromises]);
  }

  @action
  run() {
    this.runs.reduce((promise, run) => promise.then(() => this.populate(run)), this.clear());
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module "@ember/controller" {
  interface Registry {
    application: Application;
  }
}
