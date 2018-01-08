var FileSystem = require("FuseJS/FileSystem")
var Lifecycle = require('FuseJS/Lifecycle')

import * as Items from "./Items"

var serializer = undefined
// will also be called in case of `enteringBackground` (confirmed iOS/Android)
Lifecycle.on("exitedInteractive", () => {
	if (serializer) {
		serializer.save()
	}
})


class ItemSet {
	constructor() {
		this.items = [ 
			new Items.StandardDie(Items.standardDice.d6), 
			new Items.DarkSoulsDie(Items.darkSoulsDice.black) 
		]
		this.editing = null
		this.addDiePanel = false
	}

	getSerialObject() {
		var items = []
		this.items.forEach( (item) => {
			items.push( item.getSerialObject() )
		})
		return {
			items: items,
		}
	}
	
	static loadObject(data) {
		var itemSet = new ItemSet()
		itemSet.items = []
		data.items.forEach( (item)=> {
			itemSet.items.push( Items.Item.loadObject(item) )
		})
		return itemSet
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
		serializer.save()
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
		serializer = this
		
		this.title = "Dice Stat Comparator"
		
		this.isLoading = true
		
		this.itemSets = [ new ItemSet(), new ItemSet() ] //initial default, loadData will overwrite 	if something there
		this.loadData()
		
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
	
	addNewSet() {
		this.itemSets.push( new ItemSet() )
	}

	deleteSet(args) {
		var ndx = this.itemSets.indexOf(args.data)
		this.itemSets.splice( ndx, 1 )
		this.save()
	}
	
	get savePath() {
		var saveDir = FileSystem.dataDirectory
		return saveDir + "/state"
	}
	
	loadData() {
		console.log( "Loading: " + this.savePath )
		FileSystem.readTextFromFile( this.savePath ).then( (contents) => {
			var data = JSON.parse(contents)
			if (!data.version || data.version < 1) {
				console.log( "Invalid format" )
				this.isLoading = false
				return
			}
			
			try {
				if (data.itemSets) {
					this.loadItemSets(data.itemSets)
				} 
			} catch(error) {
				//TODO: should not need this catch, but error was swallowed
				console.log(error)
			}
			
			this.isLoading = false
		}, (error) => {
			this.isLoading = false
			console.log( "Error: ")
			console.dir( error )
		})
	}
	
	save() {
		console.log( "Saving: " + this.savePath )
		FileSystem.writeTextToFile( this.savePath, JSON.stringify({
			version: 1.0,
			itemSets: this.saveItemSets(),
		}, null, "\t"))
	}
	
	saveItemSets() {
		var ser = []
		this.itemSets.forEach( (set) => {
			ser.push( set.getSerialObject() )
		})
		return ser
	}
	
	loadItemSets(data) {
		this.itemSets = []
		for (let i=0; i < data.length; ++i) {
			this.itemSets.push( ItemSet.loadObject(data[i]) )
		}
	}
}

function objectToList( obj ) {
	var list = []
	for (var m in obj) {
		list.push( obj[m] )
	}
	return list
}
