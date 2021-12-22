import { Symbol } from "./checkWinner"

export const isGameOver = (matrix: [Symbol, Symbol, Symbol][]) => {
    return matrix.every((row) =>
        row.every((col) =>
            col !== null
        )
    )
}