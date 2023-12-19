/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    if (!thread) {
      throw new Error('GET_THREAD_USE_CASE.THREAD_NOT_FOUND');
    }

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    for (const comment of comments) {
      const likeCount = await this._likeRepository.getLikesByCommentId(comment.id);
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.setLikeCount(likeCount);
      comment.setReplies(replies);
    }

    thread.setComments(comments);

    return thread;
  }
}

module.exports = GetThreadUseCase;
