exports.getScans = (req, res, next) => {
  res.status(200).json([
    { _id: 1, hash: 'abcde12345', imageUrl: 'images/IMG_20180517_0019.jpg' },
    { _id: 2, hash: '0bcde12345', imageUrl: 'images/IMG_20180517_0019.jpg' },
  ]);
}