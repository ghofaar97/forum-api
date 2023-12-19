const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist new like and return added like correctly', async () => {
      // Arrange
      const newLike = new NewLike({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedLike = await likeRepositoryPostgres.addLike(newLike);

      // Assert
      expect(addedLike.id).toEqual('like-123');
      expect(addedLike.owner).toEqual(newLike.owner);

      const foundLike = await LikesTableTestHelper.findLikeById('like-123');
      expect(foundLike.id).toEqual('like-123');
      expect(foundLike.owner).toEqual(newLike.owner);
      expect(foundLike.thread_id).toEqual(newLike.threadId);
      expect(foundLike.comment_id).toEqual(newLike.commentId);
    });
  });

  describe('isLikeExist function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeExist = await likeRepositoryPostgres.isLikeExist('user-123', 'comment-123');

      // Assert
      expect(isLikeExist).toEqual(true);
    });

    it('should return false if like not exists', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeExist = await likeRepositoryPostgres.isLikeExist('like-123');

      // Assert
      expect(isLikeExist).toEqual(false);
    });
  });

  describe('isLikeOwner function', () => {
    it('should return true if user is like owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeOwner = await likeRepositoryPostgres.isLikeOwner('like-123', 'user-123');

      // Assert
      expect(isLikeOwner).toEqual(true);
    });

    it('should return false if user is not like owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLikeOwner = await likeRepositoryPostgres.isLikeOwner('like-123', 'user-456');

      // Assert
      expect(isLikeOwner).toEqual(false);
    });
  });

  describe('deleteLike', () => {
    it('should delete like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const foundLike = await LikesTableTestHelper.findLikeById('like-123');
      expect(foundLike).toBe(undefined);
    });
  });

  describe('getLikesByCommentId', () => {
    it('should return number of likes correctly', async () => {
      const wait = (ms) => new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123' });
      await wait(250);
      await LikesTableTestHelper.addLike({ id: 'like-456', commentId: 'comment-123' });
      await wait(250);
      await LikesTableTestHelper.addLike({ id: 'like-789', commentId: 'comment-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await likeRepositoryPostgres.getLikesByCommentId('comment-123');

      // Assert
      expect(likeCounts).toEqual(3);
    });
  });
});
