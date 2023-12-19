const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newLike = new NewLike(useCasePayload);
    const isThreadExist = await this._threadRepository.isThreadExist(newLike.threadId);
    const isCommentExist = await this._commentRepository.isCommentExist(newLike.commentId);

    if (!isThreadExist) {
      throw new Error('ADD_LIKE_USE_CASE.THREAD_NOT_FOUND');
    }

    if (!isCommentExist) {
      throw new Error('ADD_LIKE_USE_CASE.COMMENT_NOT_FOUND');
    }

    const isLikeExist = await this._likeRepository.isLikeExist(newLike.owner, newLike.commentId);

    if (isLikeExist) {
      return this._likeRepository.deleteLike(newLike.owner, newLike.commentId);
    }

    return this._likeRepository.addLike(newLike);
  }
}

module.exports = AddLikeUseCase;
