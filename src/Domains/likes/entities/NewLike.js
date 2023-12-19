class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      owner, threadId, commentId,
    } = payload;
    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({
    owner, threadId, commentId,
  }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string'
        || typeof commentId !== 'string'
        || typeof owner !== 'string'
    ) {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLike;
