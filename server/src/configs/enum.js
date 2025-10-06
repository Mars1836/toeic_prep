"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = exports.Role = exports.StatusUserSetFC = exports.TestType = exports.PartOfSpeech = exports.AccountType = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["active"] = "active";
    UserStatus["banned"] = "banned";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var AccountType;
(function (AccountType) {
    AccountType["basic"] = "basic";
    AccountType["pro"] = "pro";
})(AccountType || (exports.AccountType = AccountType = {}));
var PartOfSpeech;
(function (PartOfSpeech) {
    PartOfSpeech["noun"] = "noun";
    PartOfSpeech["verb"] = "verb";
    PartOfSpeech["adjective"] = "adjective";
    PartOfSpeech["averb"] = "adverb";
    PartOfSpeech["preposition"] = "preposition";
    PartOfSpeech["conjunction"] = "conjunction";
    PartOfSpeech["interjection"] = "interjection";
    PartOfSpeech["pronoun"] = "pronoun";
})(PartOfSpeech || (exports.PartOfSpeech = PartOfSpeech = {}));
var TestType;
(function (TestType) {
    TestType["exam"] = "exam";
    TestType["miniexam"] = "miniexam";
    TestType["reading"] = "reading";
    TestType["listening"] = "listening";
})(TestType || (exports.TestType = TestType = {}));
var StatusUserSetFC;
(function (StatusUserSetFC) {
    StatusUserSetFC["studying"] = "studying";
    StatusUserSetFC["studied"] = "studied";
})(StatusUserSetFC || (exports.StatusUserSetFC = StatusUserSetFC = {}));
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["user"] = "user";
})(Role || (exports.Role = Role = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["upgrade_account"] = "upgrade_account";
    TransactionType["test_registration"] = "test_registration";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["pending"] = "pending";
    TransactionStatus["success"] = "success";
    TransactionStatus["failed"] = "failed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
