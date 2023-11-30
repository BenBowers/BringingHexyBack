import { SSTConfig } from "sst";
import { API } from "./infra/MyStack";

export default {
  config(_input) {
    return {
      name: "BringingHexyBack",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(API);
  }
} satisfies SSTConfig;
