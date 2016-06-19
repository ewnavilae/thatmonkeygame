export const KEYBOARD_UPGRADE = "KEYBOARD_UPGRADE"

const keyboardUpgrades = {
  SUPER_TYPIST: {
    type: KEYBOARD_UPGRADE,
    name: "Super Typist",
    description: "You type fast and can program more, double your points per press!",
    short: "Keyboard power x 2",
    tier: 1,
    price: 250,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 100,
  },
  REAL_PROGRAMMER: {
    type: KEYBOARD_UPGRADE,
    name: "Real Programmer",
    description: "You type more than random words! Double your points per press for a total of 4!",
    short: "Keyboard power x 2",
    tier: 2,
    price: 2500,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 1000,
  },
  LEET_HACKER: {
    type: KEYBOARD_UPGRADE,
    name: "1337 H4CK3R",
    description: "You hack other people on other keyboards! Quadruple points per press for a total of 16!",
    short: "Keyboard power x 4",
    tier: 4,
    price: 30000,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 150000,
  },
  DANK_OVERLORD: {
    type: KEYBOARD_UPGRADE,
    name: "DANK OVERLORD",
    description: "Many years of dank memes means you create great content, keyboard power x 8!",
    short: "Keyboard power x 8",
    tier: 7,
    price: 150000,
    unlocked: ( game ) => game.get( "totalPoints" ) >= 1000000,
  },
}

export default keyboardUpgrades
