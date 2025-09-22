import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from "~/utils/validators";

const USER_ROLE = {
  CLIENT: "client",
  ADMIN: "admin",
};
const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .messages({ EMAIL_RULE_MESSAGE }),
  password: Joi.string().required(),

  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(USER_ROLE))
    .default(USER_ROLE.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những trường mà chúng ta không cho phép cập nhậttrong hàm update
const INVALID_UPDATE_FIELDS = ["_id", "email", "username", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(userId),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByEmail = async (emailValid) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: emailValid,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho cập nhật linh tinh
    Object.keys(updateData).forEach((item) => {
      if (INVALID_UPDATE_FIELDS.includes(item)) {
        delete updateData[item];
      }
    });

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: "after" } // trả về kết quả mới sau khi cập nhật
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
};
