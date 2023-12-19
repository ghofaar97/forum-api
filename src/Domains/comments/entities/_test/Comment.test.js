const Comment = require('../Comment');
const Reply = require('../../../replies/entities/Reply');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.likeCount).toEqual(0);
    expect(comment.replies).toEqual([]);
  });

  it('should create deleted comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw error when replies not contain array', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment = new Comment(payload);

    // Action and Assert
    expect(() => comment.setReplies({})).toThrowError('COMMENT.REPLIES_NOT_ARRAY');
  });

  it('should throw error when replies not contain Reply object', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment = new Comment(payload);

    // Action and Assert
    expect(() => comment.setReplies([
      {},
    ])).toThrowError('COMMENT.REPLIES_CONTAINS_INVALID_MEMBER');
  });

  it('should set replies correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment = new Comment(payload);
    const replies = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:57.000Z',
        content: 'sebuah reply',
        isDelete: false,
      }),
    ];

    // Action
    comment.setReplies(replies);

    // Assert
    expect(comment.replies).toEqual(replies);
  });

  it('should throw error when likeCount not a number', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment = new Comment(payload);

    // Action and Assert
    expect(() => comment.setLikeCount('0')).toThrowError('COMMENT.LIKECOUNT_NOT_NUMBER');
  });

  it('should set likeCount correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:57.000Z',
      content: 'sebuah comment',
      isDelete: false,
    };

    const comment = new Comment(payload);
    const likeCount = 3;

    // Action
    comment.setLikeCount(likeCount);

    // Assert
    expect(comment.likeCount).toEqual(3);
  });
});
