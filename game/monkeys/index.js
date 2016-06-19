import { CODE_MONKEY_UPGRADE, DEV_MONKEY_UPGRADE, APE_UPGRADE, HUMAN_UPGRADE } from "game/upgrades/monkey"

const getUpgrade = ( game, upgradeCode ) => {
  const upgrades = game.get( "upgrades" ).filter( upgrade => upgrade.get( "type" ) === upgradeCode )
  let highestUpgrade = null
  if ( upgrades.size > 0 ) {
    highestUpgrade = upgrades
    .sortBy( upgrade => upgrade.get( "tier" ) )
    .reverse()
    .first()
  }
  return highestUpgrade || new Map()
}

const amountPerTick = ( index, pointsPerMonkeyPress, game, upgradeCode ) => {
  const base = pointsPerMonkeyPress * ( game.getIn( [ "monkeys", index ] ) || 0 )
  const upgrade = getUpgrade( game, upgradeCode )
  const modifier = upgrade.get("modifier")
}

export default [
  {
    name: "Code Monkey",
    description:
      "The lowliest type of monkey there is. Code monkey get up get coffee! Clicks one key every two seconds.",
    condition: game => game.get( "unlocked" ).size > 1,
    amountPerTick: ( index, { props: { pointsPerMonkeyPress, game } } ) =>
      ( pointsPerMonkeyPress *
        ( game.getIn( [ "monkeys", index ] ) || 0 )
      ) * ( 2 ** getUpgrade( game, CODE_MONKEY_UPGRADE ) .get( "tier" )),
    interval: 2000,
    price: ( monkeyAmount ) => Math.round( 15 * ( 1.145 ** ( monkeyAmount ) ) ),
    preview: () => "You can almost unlock your first Code Monkey! You need at least 2 keys.",
    notifications: [],
  },
  {
    name: "Dev Monkey",
    description: "This monkey can take care of writing a component by himself! Clicks three keys every two seconds!",
    condition: game => game.get( "unlocked" ).size > 3,
    amountPerTick: ( index, { props: { game, pointsPerMonkeyPress } } ) =>
      pointsPerMonkeyPress * 3 * ( game.getIn( [ "monkeys", index ] ) || 0 ) * (
        ( 2 ** getUpgrade( game, DEV_MONKEY_UPGRADE ).get( "tier" ) )
      ),
    interval: 2000,
    price: ( monkeyAmount ) => Math.round( 150 * ( 1.15 ** ( monkeyAmount ) ) ),
    preview: () => "You need at least 4 keys to get one of these.",
    notifications: [],
  },
  {
    name: "Code Ape",
    description: "This monkey will smash some keys in hope of making quality code! Clicks five keys every second!",
    condition: game => game.get( "unlocked" ).size > 5,
    amountPerTick: ( index, { props: { game, pointsPerMonkeyPress } } ) =>
      pointsPerMonkeyPress * 5 * ( game.getIn( [ "monkeys", index ] ) || 0 ) * (
        ( 2 ** getUpgrade( game, APE_UPGRADE ).get( "tier" ) )
      ),
    interval: 1000,
    price: ( monkeyAmount ) => Math.round( 300 * ( 1.16 ** ( monkeyAmount ) ) ),
    preview: () => "6 keys to make this crazy monkey happy.",
    notifications: [],
  },
  {
    name: "Human",
    description: "This monkey believes it has free will and creative power! It will click 15 keys every second!",
    condition: game => game.get( "unlocked" ).size > 8,
    amountPerTick: ( index, { props: { game, pointsPerMonkeyPress } } ) =>
      pointsPerMonkeyPress * 15 * ( game.getIn( [ "monkeys", index ] ) || 0 ) * (
        ( 2 ** getUpgrade( game, HUMAN_UPGRADE ).get( "tier" ) )
      ),
    interval: 1000,
    price: ( monkeyAmount ) => Math.round( 1000 * ( 1.17 ** ( monkeyAmount ) ) ),
    preview: () => "9 keys should be enough to keep the human at the keyboard all day.",
    notifications: [],
  },
  {
    name: "Super Nerd",
    description: "The bully's boss, enjoying himself by making games! Clicks 50 keys twice a second",
    condition: game => game.get( "unlocked" ).size > 11,
    amountPerTick: ( index, { props: { game, pointsPerMonkeyPress } } ) =>
      pointsPerMonkeyPress * 50 * ( game.getIn( [ "monkeys", index ] ) || 0 ),
    interval: 500,
    price: ( monkeyAmount ) => Math.round( 50000 * ( 1.19 ** ( monkeyAmount ) ) ),
    preview: () => "Reach 12 keys to see who's boss",
    notifications: [],
  },
]
