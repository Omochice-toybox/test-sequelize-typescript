import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";

const schema = {
  username: DataTypes.STRING,
  birthday: DataTypes.DATE,
  age: DataTypes.INTEGER,
} as const;

function defineModel(sequelize: Sequelize) {
  return sequelize.define("user", schema);
}

describe("sequelize", () => {
  let sequelize: Sequelize;
  let User: ModelStatic<Model<typeof schema>>;
  beforeEach(async () => {
    sequelize = new Sequelize("sqlite::memory:", { logging: false });
    User = defineModel(sequelize);
  });
  afterEach(async () => {
    sequelize?.close();
  });
  it("must be found known user", async () => {
    await sequelize.sync();
    const user = await User.findOne({ where: { username: "janedoe" } });
    expect(user).toBeDefined();
  });
  it("must not be found unknown user", async () => {
    await sequelize.sync();
    const user = await User.findOne({ where: { username: "unknown" } });
    expect(user).toBeNull();
  });
});
