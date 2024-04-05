const pointsCalculator = (likes, dislikes, createdDate) => {
  const result = {};
  const points = likes - dislikes;

  if (points <= 0) {
    result.pointsCount = 0;
  } else {
    result.pointsCount = points;
  }

  const voteRatio = likes / dislikes;

  if (!isFinite(voteRatio)) {
    result.voteRatio = 1;
  } else {
    result.voteRatio = voteRatio;
  }

  result.hotAlgo =
    Math.log(Math.max(Math.abs(likes - dislikes), 1)) + createdDate / 4500;

  result.controversialAlgo =
    (likes + dislikes) / Math.max(Math.abs(likes - dislikes), 1);

  return result;
};

module.exports = pointsCalculator;
