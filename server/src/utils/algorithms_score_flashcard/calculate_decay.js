"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDecay = calculateDecay;
function calculateDecay(s, t) {
    // Tính toán giá trị R theo công thức R = R0 * e^(-kt)
    // R0 = 1 vì đây là giá trị ban đầu
    return 1 * Math.exp(-t / s);
}
