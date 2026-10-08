class Deck {
	#deck
	
	constructor(cards=[]) {
		this.#deck = cards;
		/*this.createDeck();
		this.shuffle();*/
	}

	createDeck() {
		/*Creates an array of 52 Card objects*/
		const suits = ['H', 'S', 'C', 'D'];
		// const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const faces = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 13; j++) {
				this.#deck.push(new Card(suits[i], faces[j]));
			}
		}
	}

	shuffle() {
		/*Randomly shuffles the deck*/
		for (let i = this.getSize() - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			var temp = this.#deck[i];
			this.#deck[i] = this.#deck[j];
			this.#deck[j] = temp;
		}
	}

	getSize() {
		/*Returns the number of elements in the deck*/
		return this.#deck.length;
	}

	isEmpty() {
		/*Returns a Boolean; True if the deck is currently empty*/
		return this.getSize() < 1;
	}

	draw(count=1) {
		/*Returns the countth amount of cards from the deck, or null if the deck is empty*/
		if (!this.isEmpty()) {
			return this.#deck.splice(-count);
		}
		else {
			return null;
		}
	}

	viewAll() {
		/*Returns all of the cards within the deck without removing it from the deck, or null if the deck is empty*/
		if (!this.isEmpty()) {
			return this.#deck;
		}
		else {
			return null;
		}
	}

	view(i=this.getSize()-1) {
		/*Returns card at index i within the deck without removing it from the deck, or null if the deck is empty*/
		if (!this.isEmpty()) {
			return this.#deck[i];
		}
		else {
			return null;
		}
	}

	swap(card, i) {
		/*Swaps at the given index and returns the original item at that index*/
		var output = this.#deck[i];
		this.#deck[i] = card;
		return output;
	}

	push(card) {
        /*Adds a card into the deck*/
        this.#deck.push(...card);
    }
}

class Pile extends Deck {
	constructor(cards=[]) {
		/*Initialises a new pile*/
		super(cards);
	}
}