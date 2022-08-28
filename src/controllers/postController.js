const { sequelize, Post, ImagePost, Follower } = require("../../models");
const { uploadFileToFS } = require("../services/firebaseService");
const { errorMessage } = require("../utils/error");
const { addKey, convertToArray, addIDKey } = require("../utils/helper");

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

  const t = await sequelize.transaction();
  try {
    const post = await Post.create(
      { content, userId: user.id },
      { transaction: t }
    );

    const file = addIDKey(req.file, post.id, "id");

    await ImagePost.createAndUploadImage({
      imageData: file,
      postId: post.id,
      transaction: t,
    });
    await t.commit();

    return res.status(200).send({ msg: "Posted." });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.createImagesPost = async (req, res) => {
  const { content } = req.body;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    const post = await Post.create(
      { content, userId: user.id },
      { transaction: t }
    );
    const files = addKey(req.files, post.id, "id");

    await ImagePost.uploadMultipleImages({
      imageArr: files,
      postId: post.id,
      transaction: t,
    });

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
    const posts = await Promise.all(await ImagePost.getPostsImages(data));
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

exports.getAllPosts = async (req, res) => {
  const limit = req.query.limit;
  const page = (req.query.page - 1) * limit;
  const userId = req.query.id;

  try {
    console.log("User Id: ", userId);
    let user;
    if (userId) {
      const { userData } = await Follower.getFollowing(userId);
      user = userData;
    }

    const data = await Post.findAllPosts({
      userId,
      userData: user,
      limit,
      page,
    });

    const posts = await Promise.all(await ImagePost.getPostsImages(data));

    return res.status(200).send({ msg: "All Posts.", posts });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "Something went wrong.", error: err.message });
  }
};
