const { sequelize, Comment } = require("../../models");

exports.createTextComment = async (req, res) => {
  const { text } = req.body;
  const post = req.post;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    await Comment.createNewComment({
      text,
      postId: post.id,
      userId: user.id,
      transaction: t,
    });
    await t.commit();

    return res.status(200).send({ msg: "Comment created successfully" });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(500)
      .send({ msg: "Something went wrong.", err: err.message });
  }
};

exports.getComments = async (req, res) => {
  const post = req.post;
  try {
    const comments = await Comment.getAllCommentsByPostId({ postId: post.id });

    return res
      .status(200)
      .send({ msg: `Comments for post ID: ${post.id}`, data: comments });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "Something went wrong.", err: err.message });
  }
};
