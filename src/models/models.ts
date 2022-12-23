import { Models } from "@rematch/core";
import { example } from "./example";

export interface RootModel extends Models<RootModel> {
  example: typeof example;
}

export const models: RootModel = { example };
