import { checkWinner, Symbol } from "../utils/checkWinner";
import { isGameOver } from "../utils/isGameOver";

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

const drawMatrix: [Symbol, Symbol, Symbol][] = [
    ["O", "X", "O"],
    ["O", "X", "X"],
    ["X", "O", "O"],
]

describe("Testing checks", () => {
    it('should return a win for a winning game', () => {
        expect(checkWinner(matrix)).toBe("X");
    })


    it("should be a draw", () => {
        expect(isGameOver(drawMatrix)).toBe(true)
        expect(checkWinner(drawMatrix)).toBe(null)
    })
})