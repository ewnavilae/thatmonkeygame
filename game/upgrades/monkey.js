export const CODE_MONKEY_UPGRADE = "CODE_MONKEY_UPGRADE"
export const DEV_MONKEY_UPGRADE = "DEV_MONKEY_UPGRADE"
export const APE_UPGRADE = "APE_UPGRADE"
export const HUMAN_UPGRADE = "HUMAN_UPGRADE"

const codeMonkeyUpgrades = [
  {
    key: "REDBULL_MONKEY",
    type: CODE_MONKEY_UPGRADE,
    name: "Redbull Code",
    description: "What happens if your code monkeys get redbull instead of coffee?",
    short: "Code Monkey x 2",
    tier: 1,
    price: 250,
    unlocked: ( game ) => game.getIn( [ "monkeys", 0 ] ) >= 10,
  },
  {
    key: "COFFEE_MONKEY",
    type: CODE_MONKEY_UPGRADE,
    name: "Extra Coffee!",
    description: "What happens if you give them BOTH redbull AND coffee!?",
    short: "Code Monkey x 2",
    tier: 2,
    price: 5000,
    unlocked: ( game ) => game.getIn( [ "monkeys", 0 ] ) >= 25,
  },
]

const devMonkeyUpgrades = [
  {
    key: "APPLE_MONKEY",
    type: DEV_MONKEY_UPGRADE,
    name: "Apple Coders",
    description: "Get your web developers some nice apple computers",
    short: "Web Dev Monkey x 2",
    tier: 1,
    price: 2500,
    unlocked: ( game ) => game.getIn( [ "monkeys", 1 ] ) >= 10,
  },
  {
    key: "SPOTIFY_MONKEY",
    type: DEV_MONKEY_UPGRADE,
    name: "Spotify subscription",
    description: "Free spotify for everyone will make them happy, right?",
    short: "Web Dev Monkey x 2",
    tier: 2,
    price: 10000,
    unlocked: ( game ) => game.getIn( [ "monkeys", 1 ] ) >= 25,
  },
]

const apeUpgrades = [
  {
    key: "APE_SMASH",
    type: APE_UPGRADE,
    name: "Ape evolution",
    description: "The ape gets smarter and realises he can use both hands.",
    short: "Code Ape x 2",
    tier: 1,
    price: 10000,
    unlocked: ( game ) => game.getIn( [ "monkeys", 2 ] ) >= 10,
  },
  {
    key: "APE_KEYBOARDS",
    type: APE_UPGRADE,
    name: "More keyboards for Ape",
    description: "The ape gets even smarter and realises he can use one hand on each keyboard!",
    short: "Code Ape x 2",
    tier: 2,
    price: 30000,
    unlocked: ( game ) => game.getIn( [ "monkeys", 2 ] ) >= 25,
  },
]

const humanUpgrades = [
  {
    key: "COFFEE_TIME",
    type: HUMAN_UPGRADE,
    name: "Give em' a break",
    description: "Give your humans coffee breaks during the day, they work faster!",
    short: "Human x 2",
    tier: 1,
    price: 25000,
    unlocked: ( game ) => game.getIn( [ "monkeys", 3 ] ) >= 10,
  },
]

const monkeyUpgrades = codeMonkeyUpgrades.concat( devMonkeyUpgrades, apeUpgrades, humanUpgrades )

export default monkeyUpgrades
