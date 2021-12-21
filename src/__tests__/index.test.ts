import { checkWinner, Symbol } from "utils/checkWinner";

describe("Testing", () => {
    it('should work', () => {
        expect(true).toBe(true);
    })
})

const matrix: [Symbol, Symbol, Symbol][] = [
    ["O", "O", "X"],
    ["O", "X", "O"],
    ["X", "X", "X"],
]

describe("Testing checks", () => {
    it('should return a win for a winning game', () => {
        expect(checkWinner(matrix)).toBe("X");
    })
})