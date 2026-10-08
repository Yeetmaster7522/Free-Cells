class GameLoop {
    #deck
    #Hfoundation
    #Dfoundation
    #Sfoundation
    #Cfoundation
    #freeCells
    #piles
    #moves
    #source
    #resetting
    #shuffleEnabled

    constructor() {
        /*Sets up the entire game and renders all of the cards*/
        
        this.#resetting = false;
        this.#shuffleEnabled = true;

        this.#setBoard();
        for (let i=0; i<8; i++) {
            ui.renderPile(this, this.#piles[i], i);
        }
    }

    #setBoard() {
        /*Sets up the entire game and all of the piles*/

        // shuffled deck
        this.#deck = new Deck();
        this.#deck.createDeck();
        if (this.#shuffleEnabled) {
            this.#deck.shuffle();
        }

        // foundation piles
        this.#Hfoundation = new Pile();
        this.#Dfoundation = new Pile();
        this.#Sfoundation = new Pile();
        this.#Cfoundation = new Pile();

        // blank free cells
        this.#freeCells = new Pile([null, null, null, null]);

        // tableau columns
        this.#piles = [
            new Pile(this.#deck.draw(7)),
            new Pile(this.#deck.draw(7)),
            new Pile(this.#deck.draw(7)),
            new Pile(this.#deck.draw(7)),
            new Pile(this.#deck.draw(6)),
            new Pile(this.#deck.draw(6)),
            new Pile(this.#deck.draw(6)),
            new Pile(this.#deck.draw(6)),
        ];

        // moves player makes
        this.#moves = new Stack();

        /*Set up for drag and drop*/
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    debug() {
        /*prints out the state of the pile classes*/

        console.log("free cells", this.#freeCells.viewAll());
        
        for (let i=0; i<8; i++) {
            console.log(`pile${i}`, this.#piles[i].viewAll());
        }
        
        console.log("h foundation", this.#Hfoundation.viewAll());
        console.log("c foundation", this.#Cfoundation.viewAll());
        console.log("d foundation", this.#Dfoundation.viewAll());
        console.log("s foundation", this.#Sfoundation.viewAll());
        console.log("|=><=|===============|=><=|")
    }

    setShuffle(shuffle) {
        /*Enables/disables the shuffling of the deck when a new game is created*/

        this.#shuffleEnabled = shuffle;
    }

    elementToPile(el) {
        /*Returns the pile object that correlates to the given element.
        Gives a number representing the index of the free cell that
        the element is*/

        let output = null;

        if (el != null) {
            const id = el.id;
            const i = parseInt(id[id.length-1]);
            const id0 = id[0];
            
            switch(id0) {
                case "p": // tableau columns
                    output = this.#piles[i];
                    break;
                case "c": // free cells
                    output = i;
                    break;
                case "H": // hearts foundation
                    output = this.#Hfoundation;
                    break;
                case "C": // clubs foundation
                    output = this.#Cfoundation;
                    break;
                case "D": // diamonds foundation
                    output = this.#Dfoundation;
                    break;
                case "S": // spades foundation
                    output = this.#Sfoundation;
                    break;
                default:
            }
        }
        
        return output;
    }

    pileToElement(pile) {
        /*Returns the element that correlates to the given pile object.
        If given a number it returns the element that corresponds to that index free cell*/

        let output = null;
        
        if (pile != null) {
            if (typeof pile == "number") { // free cells
                output = ui.getElement(`c${pile}`);
            }
            else if (pile === this.#Cfoundation) { // clubs foundation
                output = ui.getElement("C");
            }
            else if (pile === this.#Dfoundation) { // diamonds foundation
                output = ui.getElement("D");
            }
            else if (pile === this.#Hfoundation) { // hearts foundation
                output = ui.getElement("H");
            }
            else if (pile === this.#Sfoundation) { // spades foundation
                output = ui.getElement("S");
            }
            else { // tableau columns
                output = ui.getElement(`p${this.#piles.indexOf(pile)}`); 
            }
        }
        return output;
    }

    isAdjacentCard(card1, card2) {
        /*Returns true if card2's value is 1 higher than card1*/
        return card2.getValue() - card1.getValue() == 1;
    }

    isAlternating(card1, card2) {
        /*Returns true if card1 and card2's colour is different*/
        return card1.getColor() != card2.getColor();
    }

    isValidSubPile(pile, start) {
        /*Returns true if the subpile's cards pass 
        adjacent and alternating checks*/
        let valid = true;

        // loops through the subpile
        for (let i=start; i<pile.length-1; i++) {
            let card1 = pile[i];
            let card2 = pile[i+1];

            // validating if card2 can be on card1
            if (!this.isAdjacentCard(card2, card1) || !this.isAlternating(card1, card2)) {
                valid = false;
            }
        }

        return valid;
    }

    isValidMove(card1, card2, id) {
        /*Returns true if card1 can go on top of card2*/
        let valid = false;
        const id0 = id[0];

        // will not allow the move if the source is the foundation piles
        if (!["H", "C", "D", "S"].includes(this.#source.id[0])) { 
            switch(id0) {
                case "p": // verify move to pile
                    if (card2 == null || this.isAdjacentCard(card1, card2) && this.isAlternating(card1, card2)) {
                        valid = true;
                    }
                    break; 
                case "c": // verify move to free cell
                    if (this.#freeCells.view(parseInt(id[id.length-1])) == null) {
                        valid = true;
                    }
                    break;
                case "H": // verify move to hearts foundation
                    if (card1.getSuit()=="H" && card1.getValue()==1 || !this.#Hfoundation.isEmpty() && card1.getSuit()=="H" && this.isAdjacentCard(this.#Hfoundation.view(), card1)) {
                        valid = true;
                    }
                    break;
                case "C": // verify move to clubs foundation
                    if (card1.getSuit()=="C" && card1.getValue()==1 || !this.#Cfoundation.isEmpty() && card1.getSuit()=="C" && this.isAdjacentCard(this.#Cfoundation.view(), card1)) {
                        valid = true;
                    }
                    break;
                case "D": // verify move to diamonds foundation
                    if (card1.getSuit()=="D" && card1.getValue()==1 || !this.#Dfoundation.isEmpty() && card1.getSuit()=="D" && this.isAdjacentCard(this.#Dfoundation.view(), card1)) {
                        valid = true;
                    }
                    break;
                case "S": // verify move to spades foundation
                    if (card1.getSuit()=="S" && card1.getValue()==1 || !this.#Sfoundation.isEmpty() && card1.getSuit()=="S" && this.isAdjacentCard(this.#Sfoundation.view(), card1)) {
                        valid = true;
                    }
                    break;
                default:
            }
        }
        
        return valid;
    }

    moveCards(target, i, start=null) {
        /*Moves amount i cards from .#source to target.
        Will output true if card was successfully moved*/
        
        // when undoing a move a starting pile will be given.
        let source = start;
        if (source == null) {
            source = this.elementToPile(this.#source);
        }

        const goal = this.elementToPile(target);
        const goalType = typeof goal;
        let cards = null;
        let moved = true;

        // Get cards from the source
        if (typeof source == "number") {
            cards = this.#freeCells.swap(null, source);
        }
        else {
            cards = source.draw(i);
        }
        // Pushes cards into target pile
        if (cards != null && goal != null) { // safety check
            // move to free cells
            if (start != null && goalType == "number" || 
                goalType == "number" && this.isValidMove(cards[0], this.#freeCells.view(goal), target.id)
            ) {
                this.#freeCells.swap(cards, goal);
            }

            // move to anything thats not a free cell
            else if (start != null && goalType != "number" || 
                goalType != "number" && this.isValidMove(cards[0], goal.view(), target.id)
            ) {
                goal.push(cards);
            }

            else { // If it did not pass the checks to go to to the target, it will put the cards back to its source
                moved = false;

                if (typeof source == "number") {
                    this.#freeCells.swap(cards, source);
                }
                else {
                    source.push(cards);
                }
            }
        }
        else {
            moved = false;
        }

        this.debug(); // Displaying internal game state in the console

        // will only add to the move list if a starting pile was not given, the start != goal and it moved successfully
        if (start == null && source != goal && moved) {
            // Pushing the source and index of the move to #moves for undo to work
            this.#moves.push({ 
                target: this.#source,
                source: goal,
                i: i
            });
        }

        return moved;
    }

    getMoveLimit() {
        /*Returns the max amount of cards the player can move at once*/

        let M = 0; //number of empty piles
        let N = 0; //number of empty cells

        // Counts amount of empty columns
        for (let i=0; i<8; i++) {
            if (this.#piles[i].isEmpty()) {
                M += 1;
            }
        }

        // Counts amount of empty free cells
        for (let i=0; i<4; i++) {
            if (this.#freeCells.view(i) == null) {
                N += 1;
            }
        }

        return 2**M * (N+1);
    }

    onDragStart(ev) {
        /*Gets #source,
        #activeCards, #offsets, and,
        sets #isMovingCard to true
        */
        
        /*Gets the container of the card that is clicked on
        and it's children elements*/
        const eventInfo = ui.getEventInfo(ev);
        if (!ui.isMovingCards()) {
            this.#source = eventInfo.parentNode;

            /*Pre test checks to make sure that user is not going to drag
            an invalid sub pile and refuse drag from foundation piles*/
            if (
                !Object.values(ui.getElement("foundations")).includes(this.#source) && this.getMoveLimit() >= eventInfo.amountMoving && typeof this.elementToPile(this.#source) == "number" ||
                !Object.values(ui.getElement("foundations")).includes(this.#source) && this.getMoveLimit() >= eventInfo.amountMoving && this.isValidSubPile(this.elementToPile(this.#source).viewAll(), eventInfo.index)
            ) {
                console.log(eventInfo)
                ui.pickupCards(eventInfo, eventInfo.clientX, eventInfo.clientY); // visually picks up the card

                // adds event listeners to the document to make drag and drop work
                document.addEventListener("pointermove", this.onDrag);
                document.addEventListener("pointerup", this.onDrop);
            }
            else {
                // if the player is not allowed to pick up the card it will do an error animation.
                ui.playError(ev.target);
            }
        }
    }

    onDrag(ev) {
        /*moves card to mouse position*/
    
        // visually moving the card
        ui.moveCards(ev);
    }

    onDrop(ev) {
        /*Removes mousemove and mouseup event listeners, 
        and moves cards to the pile the user dropped them in*/
        let touch = null
        try {
            touch = ev.changedTouches[0];
        }
        catch (err) {
            console.log(err);
            touch = null
        }
    
        // making sure player cannot move the card while it is being dropped
        document.removeEventListener("pointermove", this.onDrag);
        document.removeEventListener("pointerup", this.onDrop);
        
        let moved = null;

        // gets the element that the user is hovering upon
        let elTarget = null;
        if (touch) {
            elTarget = ui.checkWithinAll(touch.clientX, touch.clientY);
        }
        else {
            elTarget = ui.checkWithinAll(ev.clientX, ev.clientY);
        };
        const elPile = this.elementToPile(elTarget);
        const amountMoving = ui.getAmountMoving();

        // if pile was not selected it will not move
        if (elPile == null) {
            moved = false;
        }
        
        // refuses to allow player to put multiple cards inside a free cell
        else if (typeof elPile == "number" && amountMoving != 1) {
            moved = false;
        }
        
        // refuses to let player place a pile of cards that is half of the move limit into an empty tableau column
        else if (
            typeof elPile != "number" && !["H", "C", "D", "S"].includes(elTarget.id[0]) && 
            elPile.isEmpty() && amountMoving > this.getMoveLimit()/2
        ) {
            moved = false;
        }
        
        // refuses to allow player to put multiple cards inside a foundation pile
        else if (["H", "C", "D", "S"].includes(elTarget.id[0]) && amountMoving != 1) {
            moved = false;
        }
        
        // tries to move the card if the move didnt get flagged
        else {
            moved = this.moveCards(elTarget, amountMoving);
        }

        // if a move was unsuccessful it will override the element that the cards will go to as the source
        if (elTarget == null || !moved) {
            elTarget = this.#source;
        }

        // move cards to the target visually
        ui.moveCardsToTarget(elTarget);
    }


    async autoMoveCards() {
        /*Automatically moves cards if it is a valid move.
        Recursively calls itself until no more valid moves are left*/

        let moved = false;

        // tries to move cards from the tableau columns to the foundation piles
        for (let i=0; i<8; i++) {
            for (let j=0; j<4; j++) {
                // tries to move a card and if it is successful it will visually shove the card to its new pile
                let start = this.pileToElement(this.#piles[i]);
                this.#source = start;
                let end = ui.getElement("foundations")["CDHS"[j]];
                if (this.moveCards(end, 1)) {
                    if (await ui.shove(
                        start,
                        end,
                        1,
                        false,
                        true
                    )) {
                        moved = true;
                    }
                }
            }
        }

        // tries to move cards from the free cells to the foundation piles
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                // tries to move a card and if it is successful it will visually shove the card to its new pile
                let start = this.pileToElement(i);
                this.#source = start;
                let end = ui.getElement("foundations")["CDHS"[j]];
                if (this.moveCards(end, 1)) {
                    if (await ui.shove(
                        start,
                        end,
                        false,
                        true
                    )) {
                        moved = true;
                    }
                }
            }
        }

        // if a move was made it will call itself again.
        if (moved) {
            this.autoMoveCards();
        }
    }

    checkGameWon() {
        /*If all cards are within the foundation piles then 
        a winning cutscene will play*/

        if (
            this.#Cfoundation.getSize() == 13 && 
            this.#Dfoundation.getSize() == 13 && 
            this.#Hfoundation.getSize() == 13 && 
            this.#Sfoundation.getSize() == 13
        ) {
            // does the winning cutscene if all cards are within the foundation piles
            ui.displayWon(true);
            audio.play("win");
        }
    }

    checkGameLost() {
        /*Checks if there are no more legal moves left and a loss cutscene will play
        if no legal moves have been found*/

        // gets the top card of every tableau column and the top card of each foundation pile
        const pileTopCards = this.#piles.map(pile => pile.view());
        const foundationTopCards = [
            this.#Cfoundation.view(),
            this.#Dfoundation.view(),
            this.#Hfoundation.view(),
            this.#Sfoundation.view(),
        ];

        // if there are empty free cells or tableau columns it will skip all of the checks and say the game can still be won
        if (!this.#freeCells.viewAll().includes(null) && !pileTopCards.includes(null)) {
            let lost = true;

            // checks moves from tableau columns to foundation piles
            for (let i=0; i<8; i++) {
                for (let j=0; j<4; j++) {
                    // checks if a move is valid
                    if (this.isValidMove(pileTopCards[i], foundationTopCards[j], "CDHS"[j])) {
                        lost = false;
                        console.log(pileTopCards[i], foundationTopCards[j], "CDHS"[j]); // outputs whatever move is possible
                    }
                }
            }

            // checks moves from free cells to foundation piles
            for (let i=0; i<4; i++) { 
                for (let j=0; j<4; j++) {
                    // checks if a move is valid
                    if (this.isValidMove(this.#freeCells.view(i)[0], foundationTopCards[j], "CDHS"[j])) {
                        lost = false;
                        console.log(this.#freeCells.view(i)[0], foundationTopCards[j], "CDHS"[j]); // outputs whatever move is possible
                    }
                }
            }

            // checks moves from tableau columns to tableau columns
            for (let i=0; i<8; i++) { 
                for (let j=0; j<8; j++) {
                    // checks if a move is valid
                    if (this.isValidMove(pileTopCards[i], pileTopCards[j], `pile${j}`)) {
                        lost = false;
                        console.log(pileTopCards[i], pileTopCards[j], `pile${j}`); // outputs whatever move is possible
                    }
                }
            }

            // checks moves from free cells to tableau columns
            for (let i=0; i<4; i++) { 
                for (let j=0; j<8; j++) {
                    // checks if a move is valid
                    if (this.isValidMove(this.#freeCells.view(i)[0], pileTopCards[j], `pile${j}`)) {
                        lost = false;
                        console.log(this.#freeCells.view(i)[0], pileTopCards[j], `pile${j}`); // outputs whatever move is possible
                    }
                }
            }

            // does the losing cutscene if player lost
            if (lost) {
                ui.displayWon(false);
                audio.play("lose");
            }
        }
    }

    revert(all=false) {
        /*Undos all moves if all is true and 
        undos the latest move if all is false*/

        // will not undo anything if the player is currently moving any cards
        if (!ui.isMovingCards()) {
            let size = 0;
            
            // if undoing all moves it will set the amount of moves to undo to the amount of moves the player has done
            if (all) {
                size = this.#moves.getSize();
            }
            else {
                size = 1;
            }

            // undoes either 1 or all of the moves
            for (let i=0; i<size; i++) {
                let move = this.#moves.pop(); // gets a move
                this.moveCards(move["target"], move["i"], move["source"]); // internally moves the card
                // visually moves the card
                ui.shove(
                        this.pileToElement(move["source"]),
                        move["target"],
                        move["i"],
                        all,
                        true
                    );
            }
            this.debug(); // Displaying internal game state in the console
        }
    }

    reset() {
        /*resets the entire game*/

        // will not attempt a reset if in the process of resetting the game
        if (!this.#resetting) {
            this.#resetting = true;
            
            // destroys all cards on the board
            ui.destroyCards(); 

            // sets up the internal game state
            this.#setBoard();
            
            // sets up the visual game state
            for (let i=0; i<8; i++) {
                ui.renderPile(this, this.#piles[i], i);
            }

            this.#resetting = false;
        }
    }
}