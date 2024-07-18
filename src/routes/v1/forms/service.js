import mongoose from "mongoose";
import createError from "http-errors";
import model from "./model.js";
import { lookup } from "../../../utils/index.js";
import { RESOURCE, STATUSCODE } from "../../../constants/index.js";

async function getAll() {
  return await model.find();
}

async function getById(_id) {
  return await model
    .aggregate()
    .match({
      _id: mongoose.Types.ObjectId.createFromHexString(_id),
    })
    .append(
      lookup(RESOURCE.CONTENTS, "content.contentId", RESOURCE.CONTENT, [
        lookup(RESOURCE.DESIGNS, "content.design", RESOURCE.DESIGN, []),
        lookup(RESOURCE.SETTINGS, "content.setting", RESOURCE.SETTING, []),
        lookup(
          RESOURCE.SUBMISSIONS,
          RESOURCE.SUBMISSION,
          RESOURCE.SUBMISSION,
          [],
        ),
      ]),
    );
}

async function addContent(userId, contentId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (form) =>
      form
        ? await model.findByIdAndUpdate(
            form._id,
            {
              $addToSet: {
                form: {
                  content: contentId,
                },
              },
            },
            { new: true, session },
          )
        : await model
            .create(
              [
                {
                  user: userId || "",
                  form: [
                    {
                      content: contentId || "",
                    },
                  ],
                },
              ],
              { session },
            )
            .then((result) => result[0]),
    );
}

async function addDesign(userId, contentId, designId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (data) =>
      data?.form.some((item) => item.content.toString() === contentId)
        ? await model.findOneAndUpdate(
            { _id: data._id, "form.content": contentId },
            { $set: { "form.$.design": designId } },
            { new: true, session },
          )
        : Promise.reject(
            createError(
              STATUSCODE.BAD_REQUEST,
              "Add a form content first to add design",
            ),
          ),
    );
}

async function addSetting(userId, contentId, settingId, session) {
  return await model
    .findOne({ user: userId })
    .session(session)
    .then(async (data) =>
      data.form.find((item) => item.content.toString() === contentId)
        ? data.form.find((item) => item.content.toString() === contentId)
            .setting
          ? Promise.reject(
              createError(
                STATUSCODE.BAD_REQUEST,
                "Setting already exists for this content",
              ),
            )
          : ((data.form.find(
              (item) => item.content.toString() === contentId,
            ).setting = settingId),
            await model.findOneAndUpdate(
              {
                _id: data._id,
                "form.content": contentId,
              },
              { $set: { "form.$.setting": settingId } },
              { new: true, session },
            ))
        : Promise.reject(
            createError(
              STATUSCODE.BAD_REQUEST,
              "Add a form content first to add setting",
            ),
          ),
    );
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

async function removeContent(userId, contentId, session) {
  return await model.findOneAndUpdate(
    { user: userId },
    { $pull: { form: { content: contentId } } },
    { new: true, session },
  );
}

async function removeDesign(userId, designId, session) {
  return await model.findOneAndUpdate(
    { user: userId, "form.design": designId },
    { $set: { "form.$.design": null } },
    { new: true, session },
  );
}

export default {
  getAll,
  getById,
  addContent,
  addDesign,
  addSetting,
  deleteById,
  removeContent,
  removeDesign,
};
