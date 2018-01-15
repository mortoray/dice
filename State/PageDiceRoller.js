import * as Items from "./Items"
import * as Util from "./Util"

class SelectedDie {
	constructor( defn ) {
		this.defn = defn
		this.result = defn.randomValue()
	}
}

export default class PageDiceRoller {
	constructor() {
		this.dice = Util.objectToList( Items.standardDice )
		this.selectedDice = []
	}
	
	selectDie(args) {
		this.selectedDice.push( new SelectedDie(args.data) )
	}
	
	clearDice() {
		this.selectedDice = []
	}
	
	get totalValue() {
		var total = 0
		for (const die of this.selectedDice) {
			total += die.result
		}
		return total
	}
}

