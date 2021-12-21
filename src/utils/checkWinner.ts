
export type Symbol = "X" | "O" | null

const winningCombinations = [
    [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
    ],
    [
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 1],
    ],
    [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ],
    [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
    ],
]

export const checkWinner = (matrix: [Symbol, Symbol, Symbol][]) => {

    let winner = null

    for (let symbol of ["X", "O"]) {
        if (winningCombinations.some((combination, n) =>
            combination.every((row, y) =>
                row.every((col, x) =>
                    (col === 0) || (col === 1 && matrix[y][x] === symbol)
                )
            )
        )) {
            winner = symbol
            break
        }
    }

    return winner

}

