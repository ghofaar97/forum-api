const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewLike(payload))
      .toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: {},
      threadId: true,
      commentId: true,
    };

    // Action and Assert
    expect(() => new NewLike(payload))
      .toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newLike object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const newLike = new NewLike(payload);

    // Assert
    expect(newLike.owner).toEqual(payload.owner);
    expect(newLike.threadId).toEqual(payload.threadId);
    expect(newLike.commentId).toEqual(payload.commentId);
  });
});
