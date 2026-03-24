export const RULES = {
    rock: {
        scissors: 'Rock crushes Scissors',
        lizard: 'Rock crushes Lizard',
    },
    paper: {
        rock: 'Paper covers Rock',
        spock: 'Paper disproves Spock',
    },
    scissors: {
        paper: 'Scissors cuts Paper',
        lizard: 'Scissors decapitates Lizard',
    },
    lizard: {
        spock: 'Lizard poisons Spock',
        paper: 'Lizard eats Paper',
    },
    spock: {
        scissors: 'Spock smashes Scissors',
        rock: 'Spock vaporizes Rock',
    },
};