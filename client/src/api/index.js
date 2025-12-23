export class Endpoint {
  originUrl = null;
  constructor(originUrl) {
    this.originUrl = originUrl;
    this.originUrlUpload = originUrl + "/uploads";
    this.auth = this.handleAuth();
    this.test = this.handleTest();
    this.result = this.handleResult();
    this.resultItem = this.handleResultItem();
    this.setFlashcard = this.handleSetFlashcard();
    this.flashcardItem = this.handleFlashcardItem();
    this.aichat = this.handleAichat();
    this.learningSet = this.handleLearningSet();
    this.payment = this.handlePayment();
    this.learningFlashcard = this.handleLearningFlashcard();
    this.word = this.handleWord();
    this.profile = this.handleProfile();
    this.provider = this.handleProvider();
    this.transcriptTest = this.handleTranscriptTest();
    this.transcriptTestItem = this.handleTranscriptTestItem();
    this.blog = this.handleBlog();
    this.toeicTest = this.handleToeicTest();
    this.toeicTestSession = this.handleToeicTestSession();
    this.examResult = this.handleExamResult();
  }
  handleAuth() {
    return {
      localSignupCache: this.originUrl + "/api/user/auth/local-signup-cache",
      login: this.originUrl + "/api/user/auth/login",
      logout: this.originUrl + "/api/user/auth/logout",
      currentUser: this.originUrl + "/api/user/auth/getinfor",
      googleLogin: this.originUrl + "/api/user/auth/google-login",
      fbLogin: this.originUrl + "/api/user/auth/facebook-login",
      sendResetPwEmail: this.originUrl + "/api/user/auth/otp/reset-password",
      requestResetPw: this.originUrl + "/api/user/auth/request/reset-password",
      sendVerifyEmail: this.originUrl + "/api/user/auth/otp/verify-email",
      requestVerifyEmail:
        this.originUrl + "/api/user/auth/request/verify-email",
      confirmLogin: this.originUrl + "/api/user/auth/security/confirm-login",
      rejectLogin: this.originUrl + "/api/user/auth/security/reject-login",
    };
  }
  handleTest() {
    return {
      getByQuery: this.originUrl + "/api/user/test",
      getById: this.originUrl + "/api/pub/test/id",
    };
  }
  handleResult() {
    return {
      storeResult: this.originUrl + "/api/user/result/items",
      getResultByTest: this.originUrl + "/api/user/result/test",
      getResultByUser: this.originUrl + "/api/user/result/user",
      getResultById: this.originUrl + "/api/user/result/id",
    };
  }
  handleResultItem() {
    return {
      getResultItemByResult: this.originUrl + "/api/user/result-item/result",
    };
  }
  handleSetFlashcard() {
    return {
      getByUser: this.originUrl + "/api/user/set-flashcard/user",
      create: this.originUrl + "/api/user/set-flashcard",
      delete: this.originUrl + "/api/user/set-flashcard",
      update: this.originUrl + "/api/user/set-flashcard",
      getById: this.originUrl + "/api/user/set-flashcard/id",
    };
  }
  handleFlashcardItem() {
    return {
      getBySet: this.originUrl + "/api/user/flashcard/set",
      create: this.originUrl + "/api/user/flashcard",
      createMany: this.originUrl + "/api/user/flashcard/many",
      update: this.originUrl + "/api/user/flashcard",
      remove: this.originUrl + "/api/user/flashcard",
    };
  }
  handleAichat() {
    return {
      getFlashcardInfor: this.originUrl + "/api/user/ai-chat/get-fc-infor",
      getQuizData: this.originUrl + "/api/user/ai-chat/get-quizz",
      getExplanation: this.originUrl + "/api/user/ai-chat/get-explanation",
      getRecommend: this.originUrl + "/api/user/ai-chat/suggest-for-study",
    };
  }
  handleLearningSet() {
    return {
      addSetToLearn: this.originUrl + "/api/user/learning-set",
      removeSetFromLearn: this.originUrl + "/api/user/learning-set",
      getByUser: this.originUrl + "/api/user/learning-set/user",
      getBySet: this.originUrl + "/api/user/learning-set/set",
      getById: this.originUrl + "/api/user/learning-set/id",
    };
  }
  handlePayment() {
    return {
      createPayment: this.originUrl + "/api/user/payment",
      createPaymentTestRegistration:
        this.originUrl + "/api/user/payment/test-registration",
    };
  }
  handleLearningFlashcard() {
    return {
      getBySet: this.originUrl + "/api/user/learning-flashcard/set",
      updateShortTermScore:
        this.originUrl + "/api/user/learning-flashcard/update-short-term-score",
      updateLearningSession:
        this.originUrl + "/api/user/learning-flashcard/update-session-score",
    };
  }
  handleWord() {
    return {
      get4RandomWords: this.originUrl + "/api/pub/word/4-random",
    };
  }
  handleProfile() {
    return {
      updateProfile: this.originUrl + "/api/user/profile/update-profile",
      getAnalysis: this.originUrl + "/api/user/profile/analysis",
      updateAvatar: this.originUrl + "/api/user/profile/update-avatar",
      updateTargetScore:
        this.originUrl + "/api/user/profile/update-target-score",
      getRecommend: this.originUrl + "/api/user/profile/recommend",
    };
  }
  handleProvider() {
    return {
      speechToText: this.originUrl + "/api/user/provider/speech-to-text",
    };
  }
  handleTranscriptTest() {
    return {
      getByQuery: this.originUrl + "/api/pub/transcript-test",
    };
  }
  handleTranscriptTestItem() {
    return {
      getByTranscriptTestId:
        this.originUrl + "/api/pub/transcript-test-item/transcript-test-id",
    };
  }
  handleBlog() {
    return {
      getBlog: this.originUrl + "/api/pub/blog",
      searchBlog: this.originUrl + "/api/pub/blog/search",
      viewBlog: this.originUrl + "/api/pub/blog",
      getRelatedBlog: this.originUrl + "/api/pub/blog", // + /id/related
    };
  }
  handleExamRegistration() {
    return {
      create: this.originUrl + "/api/user/test-registration",
      getByUser: this.originUrl + "/api/user/test-registration/user",
      getById: this.originUrl + "/api/user/test-registration/id",
    };
  }
  handleToeicTest() {
    return {
      getPendingTests: this.originUrl + "/api/user/toeic-testing/pending",
    };
  }
  handleToeicTestSession() {
    return {
      getByUser: this.originUrl + "/api/user/toeic-test-session/my-sessions",
      getSessionByUserIdAndId:
        this.originUrl + "/api/user/toeic-test-session/my-sessions",
      getExamByToken: this.originUrl + "/api/user/toeic-test-session/exam",
    };
  }
  handleExamResult() {
    return {
      storeResult: this.originUrl + "/api/user/exam-result/items",
    };
  }
}
export const RATE_LIMIT = 0.2;
