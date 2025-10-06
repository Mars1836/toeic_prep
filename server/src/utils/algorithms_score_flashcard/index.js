"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmsScoreFlashcard = void 0;
const review_schedule_1 = require("./review_schedule");
const calculate_decay_1 = require("./calculate_decay");
const memory_retention_1 = require("./memory_retention");
class AlgorithmsScoreFlashcard {
    constructor(n, // số lần học
    t_actual, // thời gian thực tế
    EF, // hệ số dễ dàng,(1.3-2.5)
    Q, // Hiệu quả học tập (0-5)
    timeMinutes, accuracy, oldMemoryRetention, interval, difficult_rate) {
        this.superMemo = new review_schedule_1.SuperMemo();
        this.memoryRetentionInstance = new memory_retention_1.MemoryRetention();
        this.n = n;
        this.t_actual = t_actual;
        this.EF = EF;
        this.Q = Q;
        this.oldMemoryRetention = oldMemoryRetention;
        this.timeMinutes = timeMinutes;
        this.accuracy = accuracy;
        this.interval = interval;
        this.difficult_rate = difficult_rate;
    }
    calculateDecay() {
        return (0, calculate_decay_1.calculateDecay)(this.calculateMemoryRetention(), this.t_actual);
    }
    calculateOptimalTime() {
        return this.superMemo.countInterval(this.EF, this.Q, this.n, this.interval, this.difficult_rate);
    }
    calculateEF() {
        return this.superMemo.countEF(this.EF, this.Q, this.difficult_rate);
    }
    calculateMemoryRetention() {
        return this.memoryRetentionInstance.calculateNewMemoryRetention(this.oldMemoryRetention, this.interval, this.t_actual, this.timeMinutes, this.accuracy);
    }
    showAll() {
        console.log({
            interval: this.interval,
            t_actual: this.t_actual,
            EF: this.EF,
            Q: this.Q,
            n: this.n,
            newMemoryRetention: this.calculateMemoryRetention(),
            decay: this.calculateDecay(),
        });
    }
}
exports.AlgorithmsScoreFlashcard = AlgorithmsScoreFlashcard;
