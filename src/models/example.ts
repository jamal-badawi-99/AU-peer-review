import { createModel } from "@rematch/core";
import * as yup from "yup";
import { RootModel } from "./models";

export const exampleScheme = yup.object({
  name: yup
    .date()
});
export const example = createModel<RootModel>()({
  state: {
    name: "",
  },
  reducers: {
    handleName(state, payload) {
      state.name = payload;
    },
  },
});
