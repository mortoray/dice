import * as Items from "./Items"

class ItemSet {
	constructor() {
		this.items = [ 
			new Items.StandardDie(Items.standardDice.d6), 
			new Items.DarkSoulsDie(Items.darkSoulsDice.black) 
		]
		this.editing = null
		this.addDiePanel = false
	}
	
	get expectedValue() {
		var sum = 0
		this.items.forEach( (d) => {
			sum += d.expectedValue
		})
		return sum
	}
	
	editItemAction( args ) {
		this.editItem(args.data)
	}
	
	editItem( item ) {
		this.addDiePanel = false
		if (this.editing == item) {
			this.closeEdit()
			return
		} 
		
		this.editing = item
	}
	
	closeEdit() {
		this.editing = null
	}
	
	openDiePanel() {
		this.closeEdit()
		this.addDiePanel = true
	}
	
	addItem( args ) {
		var type = args.data.type
		var newItem = null
		switch (type) {
			case 'standard':
				newItem = new Items.StandardDie(Items.standardDice.d6)
				break
				
			case 'dark_souls':
				newItem = new Items.DarkSoulsDie(Items.darkSoulsDice.black)
				break
				
			case 'modifier':
				newItem = new Items.ModifierItem()
				break
		}
		
		if (newItem == null) {
		}
		
		this.items.push( newItem )
		this.editItem( newItem )
	}
	
	removeItem() {
		var index = this.items.indexOf( this.editing )
		this.items.splice( index, 1 ) //remove an item
		this.editing = null
	}
}

export default class MainState {
	constructor() {
		this.title = "Dice Stat Comparator"
		
		this.itemSets = [ new ItemSet(), new ItemSet() ]
		//convert the dictionary of dice into an array
		this.standardDice = objectToList( Items.standardDice )
		this.darkSoulsDice = objectToList( Items.darkSoulsDice )
		
		this.itemTypes = [{
			name: "Standard",
			type: "standard",
		}, {
			name: "Dark Souls",
			type: "dark_souls",
		}, {
			name: "Modifier",
			type: "modifier",
		}]
	}
}

function objectToList( obj ) {
	var list = []
	for (var m in obj) {
		list.push( obj[m] )
	}
	return list
}
