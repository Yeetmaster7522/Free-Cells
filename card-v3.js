class Card {
	#suit
	#rank
	#value
	#color
	
	constructor(suit, rank) {
		/*Create an object of class Card; provide suit, rank, [visible]*/
		this.#suit = suit;
		this.#rank = rank;
		this.#setColor(); 
		
		switch(this.#rank) {
			case 'J':
				this.#value = 11;
				break;
			case 'Q':
				this.#value = 12;
				break;
			case 'K':
				this.#value = 13;
				break;
			case 'A':
				this.#value = 1;
				break;
			default:
				this.#value = parseInt(this.#rank);
		}
	}

	#setColor() {
		if (this.#suit[0] == "H" || this.#suit[0] == "D") {
			this.#color = "red";
		}
		else {
			this.#color = "black";
		}
	}

	getValue() {
		/*Returns the card's equivalent integer value; Ace is 1*/
		return this.#value;
	}

	getRank() {
		/*Returns the card's rank*/
		return this.#rank;
	}
	
	getSuit() {
		/*Returns the card's suit*/
		return this.#suit;
	}

	getColor() {
		/*Returns the card's color*/
		return this.#color;
	}

	getImageRef() {
		/*Returns a string containing a local filename for the card*/
		return `cards/${this.#rank + this.#suit}.png`;
	}
}