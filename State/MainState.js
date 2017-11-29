class StaticDie {
	constructor( name, sides, color ) {
		this.sides = sides
		this.name = name
		this.color = color
	}
	
	get numSides() {
		return this.sides.length
	}
	
	get expectedValue() {
		var sum = 0
		this.sides.forEach( (v)=> {
			sum += v
		})
		return sum / this.sides.length
	}
}

var allDice = {
	d6: new StaticDie( "D6", [1,2,3,4,5,6], [1,1,1] ),
	d8: new StaticDie( "D8", [1,2,3,4,5,6,7,8], [1,1,1] ),
	dsBlack: new StaticDie( "Dark Souls Black", [0, 1, 1, 1, 2, 2], [0,0,0] ),
	dsBlue: new StaticDie( "Dark Souls Blue", [1,1, 2,2,2, 3], [0,0,0.5] ),
	dsOrange: new StaticDie( "Dark Souls Orange", [1, 2,2, 3,3, 4], [0.7,0.5,0] ),
}

var DieId = 1
class Die {
	constructor( defn ) {
		this.id = DieId++
		this.defn = defn
	}
}

class DiceSet {
	constructor() {
		this.dice = [ new Die(allDice.d6), new Die(allDice.dsBlack) ]
		this.modifier = 0
		this.editing = null
	}
	
	get expectedValue() {
		var sum = 0
		this.dice.forEach( (d) => {
			sum += d.defn.expectedValue
		})
		sum += this.modifier
		return sum
	}
	
	editDie( args ) {
		this.editing = args.data
	}
	
	closeEdit() {
		this.editing = null
	}
	
	selectDie( args ) {
		this.editing.defn = args.data
		//TODO: Loses an update with this
		//this.editing = null
	}
	
	addDie() {
		var newDie = new Die(allDice.d6)
		this.dice.push( newDie )
		this.editing = newDie
	}
	
	removeDie() {
		var index = this.dice.indexOf( this.editing )
		this.dice.splice( index, 1 ) //remove an item
		this.editing = null
	}
}

export default class MainState {
	constructor() {
		this.title = "Dice Stat Comparator"
		
		this.diceSets = [ new DiceSet(), new DiceSet() ]
		//convert the dictionary of dice into an array
		this.allDice = []
		for (var m in allDice) {
			this.allDice.push( allDice[m] )
		}
	}
}
