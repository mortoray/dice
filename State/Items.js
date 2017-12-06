class StaticDie {
	constructor( name, sides ) {
		this.sides = sides
		this.name = name
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

class StaticDarkSoulsDie extends StaticDie {
	constructor( name, sides, color ) {
		super( name, sides )
		this.color = color
	}
}

export var standardDice = {
	d4: new StaticDie( "D4", [1,2,3,4] ),
	d6: new StaticDie( "D6", [1,2,3,4,5,6] ),
	d8: new StaticDie( "D8", [1,2,3,4,5,6,7,8] ),
	d10: new StaticDie( "D10", [1,2,3,4,5,6,7,8,9,10] ),
	d12: new StaticDie( "D12", [1,2,3,4,5,6,7,8,9,10,11,12] ),
	d20: new StaticDie( "D20", [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] ),
}

export var darkSoulsDice = {
	black: new StaticDarkSoulsDie( "Black", [0, 1, 1, 1, 2, 2], "#202d35" ),
	blue: new StaticDarkSoulsDie( "Blue", [1,1, 2,2,2, 3], "#145bdb" ),
	orange: new StaticDarkSoulsDie( "Orange", [1, 2,2, 3,3, 4], "#ea6a43" ),
	green: new StaticDarkSoulsDie( "Green", [1,1,1,0,0,0], "#097575" ),
}

var ItemId = 1
export class Item {
	constructor( ) {
		this.id = ItemId++
	}
}

export class Die extends Item {
	constructor( defn ) {
		super()
		this.defn = defn
	}
	
	get expectedValue() {
		return this.defn.expectedValue
	}
}

export class StandardDie extends Die {
	constructor( defn ) {
		super( defn )
		this.type = "standard"
	}
	
	get name() {
		return "Standard Die"
	}
}

export class DarkSoulsDie extends Die {
	constructor( defn ) {
		super( defn )
		this.type = "dark_souls"
	}
	
	get name() {
		return "Dark Souls Die"
	}
}

export class ModifierItem extends Item {
	constructor() {
		super()
		this.type = "modifier"
		this.modifier = 0
	}
	
	get expectedValue() {
		return this.modifier
	}
	
	get name() {
		return 'Modifier'
	}
}