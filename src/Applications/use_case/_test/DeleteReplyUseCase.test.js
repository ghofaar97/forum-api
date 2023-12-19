const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when thread is not exists', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    const mockReplyRepository = new ReplyRepository();
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const expectedError = new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');

    // Action and Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment is not exists', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(false));
    const mockReplyRepository = new ReplyRepository();
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const expectedError = new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');

    // Action and Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw error when reply is not exists', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest.fn(() => Promise.resolve(false));
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const expectedError = new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');

    // Action and Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(useCasePayload.id);
  });

  it('should throw error when user is not reply owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.isReplyOwner = jest.fn(() => Promise.resolve(false));
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    const expectedError = new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNED');

    // Action and Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.isReplyExist = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.isReplyOwner = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());
    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.isReplyOwner).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.id);
  });
});
