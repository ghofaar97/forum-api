const AddedLike = require('../AddedLike');

describe('AddedLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedLike(payload))
      .toThrowError('ADDED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedLike(payload))
      .toThrowError('ADDED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedLike object correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      owner: 'user-123',
    };

    // Action
    const addedLike = new AddedLike(payload);

    // Assert
    expect(addedLike.id).toEqual(payload.id);
    expect(addedLike.owner).toEqual(payload.owner);
  });
});
