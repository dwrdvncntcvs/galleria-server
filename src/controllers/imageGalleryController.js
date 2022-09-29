const { ImagePost } = require("../../models");

exports.getGallery = async (req, res) => {
  const { page, limit } = req.query;
  const curLimit = limit || 6;
  const curPage = (page - 1) * curLimit || 0;
  const user = req.userParams;

  try {
    const { rows: images, count } = await ImagePost.getImagesByUserId({
      userId: user.id,
      limit: curLimit,
      offset: curPage,
    });
    const imageInfo = {
      count,
      page,
      limit,
    };

    return res.status(200).send({ imageInfo, images });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: e });
  }
};
