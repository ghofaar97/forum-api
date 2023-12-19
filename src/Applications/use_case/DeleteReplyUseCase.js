const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    const isThreadExist = await this._threadRepository.isThreadExist(deleteReply.threadId);
    if (!isThreadExist) {
      throw new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const isCommentExist = await this._commentRepository.isCommentExist(deleteReply.commentId);
    if (!isCommentExist) {
      throw new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    const isReplyExist = await this._replyRepository.isReplyExist(deleteReply.id);
    if (!isReplyExist) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    }

    const isReplyOwner = await this._replyRepository.isReplyOwner(
      deleteReply.id,
      deleteReply.owner,
    );
    if (!isReplyOwner) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNED');
    }

    return this._replyRepository.deleteReply(deleteReply.id);
  }
}

module.exports = DeleteReplyUseCase;
