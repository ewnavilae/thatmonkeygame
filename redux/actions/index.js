export const BUY_MONKEY = "BUY_MONKEY"
export const UNLOCK_KEY = "UNLOCK_KEY"
export const SET_POINTS = "SET_POINTS"
export const ADD_POINTS = "ADD_POINTS"
export const TAKE_POINTS = "TAKE_POINTS"
export const UNLOCK_UPGRADE = "UNLOCK_UPGRADE"
export const RESET_INITIAL_STATE = "RESET_INITIAL_STATE"
export const UPDATE_TIME = "UPDATE_TIME"

export const updateTime = time => ( {
  type: UPDATE_TIME,
  time,
} )

export const resetInitialState = () => ( {
  type: RESET_INITIAL_STATE,
} )

export const unlockUpgrade = ( upgrade ) => ( {
  type: UNLOCK_UPGRADE,
  key: upgrade.key,
  price: upgrade.price,
  upgrade: upgrade,
} )

export const buyMonkey = ( id, price ) => ( {
  type: BUY_MONKEY,
  id,
  price,
} )

export const unlockKey = ( key, price ) => ( {
  type: UNLOCK_KEY,
  key,
  price,
} )

export const setPoints = points => ( {
  type: SET_POINTS,
  points,
} )

export const addPoints = points => ( {
  type: ADD_POINTS,
  points,
} )

export const takePoints = points => ( {
  type: TAKE_POINTS,
  points,
} )
