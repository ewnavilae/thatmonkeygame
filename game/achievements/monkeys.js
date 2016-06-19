const monkey0 = {
  monkey0Amount1: {
    title: "Rise of the Code Monkeys",
    description: "You need 10 Code Monkeys for this achievement",
    short: "10 Code Monkeys",
    unlocked: game => game.getIn( [ "monkeys", 0 ] ) >= 10,
  },
  monkey0Amount2: {
    title: "Cide of the Rode Monkeys",
    description: "You need 25 Code Monkeys for this achievement",
    short: "25 Code Monkeys",
    unlocked: game => game.getIn( [ "monkeys", 0 ] ) >= 25,
  },
  monkey0Amount3: {
    title: "Mise of the Code Conkeys",
    description: "You need 50 Code Monkeys for this achievement",
    short: "50 Code Monkeys",
    unlocked: game => game.getIn( [ "monkeys", 0 ] ) >= 50,
  },
  monkey0Amount4: {
    title: "Cise of the Mode Conkeys",
    description: "You need 100 Code Monkeys for this achievement",
    short: "100 Code Monkeys",
    unlocked: game => game.getIn( [ "monkeys", 0 ] ) >= 100,
  },
}

export default {
  ...monkey0,
}
