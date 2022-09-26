const {
  sequelize,
  Post,
  ImagePost,
  Follower,
  Comment,
  User,
} = require("../../models");
const user = require("../../models/user");
const { uploadFileToFS } = require("../services/firebaseService");
const { errorMessage } = require("../utils/error");
const { addKey, convertToArray, addIDKey } = require("../utils/helper");

exports.createTextPost = async (req, res) => {
  const { content } = req.body;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    await Post.create(
      { content, withImage: false, userId: user.id },
      { transaction: t }
    );
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
      { content, withImage: true, userId: user.id },
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
      { content, withImage: true, userId: user.id },
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
    const postsWithImages = await Promise.all(
      await ImagePost.getPostsImages(data)
    );
    const info = { page, limit, count };

    const postsWithCommentsCount = await Promise.all(
      await Comment.getCommentsCount(postsWithImages)
    );

    const posts = postsWithCommentsCount;

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
  console.log("Getting all posts...");
  const limit = req.query.limit;
  const page = (req.query.page - 1) * limit;
  const userId = req.query.id;
  console.log("User Id: ", userId);

  try {
    let user;
    if (userId) {
      const { userData } = await Follower.getFollowing(userId);
      user = userData;
    }

    const { rows, count } = await Post.findAllPosts({
      userId,
      userData: user,
      limit,
      page,
    });

    const postsWithImages = await Promise.all(
      await ImagePost.getPostsImages(rows)
    );
    const postsWithCommentsCount = await Promise.all(
      await Comment.getCommentsCount(postsWithImages)
    );

    const posts = postsWithCommentsCount;
    const info = { page: req.query.page, limit: req.query.limit, count };

    return res.status(200).send({ msg: "All Posts.", info, posts });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "Something went wrong.", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const post = req.post;

  const t = await sequelize.transaction();
  try {
    await Post.removePost({ post, transaction: t });

    return res.status(200).send({ msg: "Post Deleted" });
  } catch (err) {
    return res.status(500).send({ msg: "Something went wrong.", err });
  }
};

exports.getPostDetails = async (req, res) => {
  const post = req.post;

  try {
    const postDetails = await Post.getPostDetails({ postId: post.id });

    const imagePost = await ImagePost.getAllPostImages({ postId: post.id });

    const { count } = await Comment.getCommentsCountByPost({ postId: post.id });

    const data = {
      ...postDetails.dataValues,
      ImagePosts: imagePost,
      commentsCount: count,
    };

    return res.status(200).send({
      msg: "Post Details Found",
      post: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong.", err });
  }
};
