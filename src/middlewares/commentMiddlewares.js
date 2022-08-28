const { Comment } = require("../../models");
const { isUuidValid } = require("../utils/validation");

exports.checkIfCommentExists = async (req, res, next) => {
  const { commentId } = req.params;

  if (!isUuidValid(commentId))
    return res.status(404).send({ message: "Comment not found" });

  const comment = await Comment.findOne({ where: { id: commentId } });

  if (!comment) return res.status(404).send({ message: "Comment not found" });

  req.commentData = comment;
  next();
};

exports.canEditComment = async (req, res, next) => {
  const user = req.user;
  const comment = req.commentData;

  if (user.id !== comment.userId)
    return res
      .status(403)
      .send({ message: "You do not have permission to edit the comment." });

  next();
};
