export const originUrlUser = "http://localhost:4000/api/user";
export const originUrlPub = "http://localhost:4000/api/pub";
const auth = {
  localSignupCache: originUrlUser + "/auth/local-signup-cache",
  login: originUrlUser + "/auth/login",
  logout: originUrlUser + "/auth/logout",
  currentUser: originUrlUser + "/auth/getinfor",
  googleLogin: originUrlUser + "/auth/google-login",
  fbLogin: originUrlUser + "/auth/facebook-login",
  sendResetPwEmail: originUrlUser + "/auth/otp/reset-password",
  requestResetPw: originUrlUser + "/auth/request/reset-password",
  sendVerifyEmail: originUrlUser + "/auth/otp/verify-email",
  requestVerifyEmail: originUrlUser + "/auth/request/verify-email",
};
const test = {
  getByQuery: originUrlUser + "/test",
  getById: originUrlPub + "/test/id",
};
const result = {
  storeResult: originUrlUser + "/result/items",
  getResultByTest: originUrlUser + "/result/test",
  getResultByUser: originUrlUser + "/result/user",
  getResultById: originUrlUser + "/result/id",
};
const resultItem = {
  getResultItemByResult: originUrlUser + "/result-item/result",
};
const setFlashcard = {
  getByUser: originUrlUser + "/set-flashcard/user",
  create: originUrlUser + "/set-flashcard",
  delete: originUrlUser + "/set-flashcard",
  update: originUrlUser + "/set-flashcard",
  getById: originUrlUser + "/set-flashcard/id",
};
const flashcardItem = {
  getBySet: originUrlUser + "/flashcard/set",
  create: originUrlUser + "/flashcard",
  createMany: originUrlUser + "/flashcard/many",
  update: originUrlUser + "/flashcard",
  remove: originUrlUser + "/flashcard",
};
const aichat = {
  getFlashcardInfor: originUrlUser + "/ai-chat/get-fc-infor",
  getQuizData: originUrlUser + "/ai-chat/get-quizz",
  getExplanation: originUrlUser + "/ai-chat/get-explanation",
};
const learningSet = {
  addSetToLearn: originUrlUser + "/learning-set",
  removeSetFromLearn: originUrlUser + "/learning-set",
  getByUser: originUrlUser + "/learning-set/user",
  getBySet: originUrlUser + "/learning-set/set",
  getById: originUrlUser + "/learning-set/id",
};
const payment = {
  createPayment: originUrlUser + "/payment",
};
const learningFlashcard = {
  getBySet: originUrlUser + "/learning-flashcard/set",
  updateShortTermScore:
    originUrlUser + "/learning-flashcard/update-short-term-score",
  updateLearningSession:
    originUrlUser + "/learning-flashcard/update-session-score",
};
const word = {
  get4RandomWords: originUrlPub + "/word/4-random",
};
const profile = {
  updateProfile: originUrlUser + "/profile/update",
  getAnalysis: originUrlUser + "/profile/analysis",
};
export const endpoint = {
  auth,
  test,
  result,
  resultItem,
  setFlashcard,
  flashcardItem,
  aichat,
  learningSet,
  payment,
  learningFlashcard,
  word,
  profile,
};
export const RATE_LIMIT = 0.2;
