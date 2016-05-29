/* export default buildUpgrade = ({key, type, name, description, short, tier, price}) => ({
  key,
  type,
  name,
  description,
  price,
  unlocked
}) */

import MonkeyUpgrades from "./monkey"
import KeyboardUpgrades from "./keyboard"

export default MonkeyUpgrades.concat( KeyboardUpgrades )
