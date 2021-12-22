import { Symbol } from "./utils/checkWinner";

interface Shared {
    waitingList: Record<NonNullable<Symbol>, WaitingUser[]>;
}

export const shared: Shared = {
    waitingList: {
        "X": [],
        "O": []
    },
}

