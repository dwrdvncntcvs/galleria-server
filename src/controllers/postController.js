const { sequelize, Post, ImagePost } = require("../../models");
const { errorMessage } = require("../utils/error");
const { addKey } = require("../utils/helper");

exports.createTextPost = async (req, res) => {
  const { content } = req.body;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    await Post.create({ content, userId: user.id }, { transaction: t });
    await t.commit();

    return res.status(200).send({ msg: "Posted." });
  } catch (err) {
    console.log("Error: ", err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.createImagePost = async (req, res) => {
  const { content } = req.body;
  const user = req.user;
  const { filename, path, mimetype, size } = req.file;

  const t = await sequelize.transaction();
  try {
    const post = await Post.create(
      { content, userId: user.id },
      { transaction: t }
    );
    await ImagePost.create(
      { filename, path, mimetype, size, postId: post.id },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Posted." });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.createImagesPost = async (req, res) => {
  const { content } = req.body;
  const files = req.filesArr;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    const post = await Post.create(
      { content, userId: user.id },
      { transaction: t }
    );

    const filesArr = addKey(files, post.id, "postId");

    await ImagePost.bulkCreate(filesArr, { transaction: t });
    await t.commit();

    return res.status(200).send({ msg: "Images Posted." });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.getUserPosts = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const { first_name } = req.userParams;
  const { data, count } = res.posts;

  try {
    const posts = await Promise.all(
      data.map(async (post) => {
        console.log("Posts: ", post);
        const imagePosts = await ImagePost.findAll({
          where: { postId: post.id },
        });
        post["dataValues"]["ImagePost"] = imagePosts;
        return post;
      })
    );

    const info = { page, limit, count };

    return res.status(200).send({
      msg: `${first_name}'s Posts.`,
      info,
      posts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.updatePostContent = async (req, res) => {
  const postId = req.query.postId;
  const { content } = req.body;

  const t = await sequelize.transaction();
  try {
    await Post.update(
      { content },
      { where: { id: postId } },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Post Updated." });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong." });
  }
};
