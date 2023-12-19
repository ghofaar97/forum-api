const LikeRepository = require('../../Domains/likes/LikeRepository');
const AddedLike = require('../../Domains/likes/entities/AddedLike');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const {
      owner, threadId, commentId,
    } = newLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id, owner',
      values: [id, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new AddedLike({ ...result.rows[0] });
  }

  async isLikeExist(owner, commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async isLikeOwner(likeId, owner) {
    const query = {
      text: 'SELECT owner FROM likes WHERE id = $1',
      values: [likeId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].owner === owner;
  }

  async deleteLike(owner, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [owner, commentId],
    };

    await this._pool.query(query);
  }

  async getLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
