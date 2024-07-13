import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RESOURCE.USERS,
    },
    content: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.CONTENTS,
      },
    ],
    design: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.DESIGNS,
      },
    ],
    setting: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RESOURCE.SETTINGS,
      },
    ],
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.FORMS] ||
  mongoose.model(RESOURCE.FORMS, schema);
