class UI_Manager {
    #pileEls
    #cellEls
    #foundationEls
    #endScreenEl
    #endScreenTxtEl
    #activeCards
    #offsets
    #vh
    #isMovingCard
    #lastPosition
    #goofy
    #darkMode
    #hueRotation
    #grayscale
    #sepia
    #autoMove
    
    constructor() {
        /*Sets up the UI manager*/

        // saving references to all of the elements that will be interacted with
        this.#pileEls = [
            document.getElementById("pile0"),
            document.getElementById("pile1"),
            document.getElementById("pile2"),
            document.getElementById("pile3"),
            document.getElementById("pile4"),
            document.getElementById("pile5"),
            document.getElementById("pile6"),
            document.getElementById("pile7"),
        ];
        this.#cellEls = [
            document.getElementById("cell0"),
            document.getElementById("cell1"),
            document.getElementById("cell2"),
            document.getElementById("cell3"),
        ];
        this.#foundationEls = {
            "H": document.getElementById("Hfoundation"),
            "C": document.getElementById("Cfoundation"),
            "D": document.getElementById("Dfoundation"),
            "S": document.getElementById("Sfoundation"),
        };

        this.#endScreenEl = document.getElementById("end-screen");
        this.#endScreenTxtEl = document.getElementById("text");

        // set up for moving the cards
        this.#activeCards = [];
        this.#offsets = [];

        this.#isMovingCard = false;
        this.#lastPosition = [0,0]; // last position of the mouse

        window.addEventListener("load", () => {
            this.#vh = window.innerHeight / 100;
        });

        // set up for settings
        this.#goofy = false;
        this.#darkMode = false;
        this.#hueRotation = 0;
        this.#grayscale = 0;
        this.#sepia = 0;
        this.#autoMove = false;
    }

    setBackgroundImg(filepath) {
        /*Changes the background of the body to a given filepath*/

        document.body.style.backgroundImage = `url(${filepath})`;
    }

    setColor(rgb) {
        /*Sets the colours of the cell-back and command elements to a given rgb value in an object format*/

        // gets the cell-back and command elements
        const cellbacks = document.getElementsByClassName("cell-back");
        const commands = document.getElementsByClassName("command");

        // sets the colour of the cell-backs
        for (let i=0; i<cellbacks.length; i++) {
            cellbacks[i].style.border = `0.4vw inset rgba(${rgb["r"]}, ${rgb["g"]}, ${rgb["b"]}, 0.537)`
        }
        // sets the colour of the commands
        for (let i=0; i<commands.length; i++) {
            commands[i].style.border = `0.2vw outset rgb(${rgb["r"]}, ${rgb["g"]}, ${rgb["b"]})`
        }
    }

    setFilters(hueRotation=0, grayscale=0, sepia=0) {
        /*Modifies dark mode given a hueRotation, grayscale, and sepia value.
        hueRotation is in degrees, grayscale is in percentage, sepia is in percentage*/

        // stores the information inside the class for future reference
        this.#hueRotation = hueRotation;
        this.#grayscale = grayscale;
        this.#sepia = sepia;

        // gets all inverted cards
        const darkCards = document.getElementsByClassName("invert");

        // modifies the filter of every inverted card
        for (let i=0; i<darkCards.length; i++) {
            darkCards[i].style.filter = `invert(75%) contrast(150%) hue-rotate(${hueRotation}deg) grayscale(${grayscale}%) sepia(${sepia}%)`;
        }
    }

    setDarkMode(enabled) {
        /*Enables and disables dark mode given a boolean.*/

        // gets all card elements
        const cards = document.getElementsByClassName("card");

        // stores information within the class for future reference
        this.#darkMode = enabled;
        
        // applies dark mode
        if (this.#darkMode) {
            // modifies the cards
            for (let i=0; i<cards.length; i++) {
                cards[i].classList.add("invert");
            }
            
            // modifies the foundation piles
            for (let i=0; i<"HCDS".length; i++) {
                this.#foundationEls["HCDS"[i]].classList.add("invert");
            }
        }

        // removes dark mode
        else {
            // modifies the cards
            for (let i=0; i<cards.length; i++) {
                cards[i].classList.remove("invert");
                cards[i].style.filter = "none";
            }
            
            // modifies the foundation piles
            for (let i=0; i<"HCDS".length; i++) {
                this.#foundationEls["HCDS"[i]].classList.remove("invert");
                this.#foundationEls["HCDS"[i]].style.filter = "none";
            }
        }
    }

    setGoofy(enabled) {
        /*Enables and disables a mode in which the player cannot see buried cards within tableau columns*/

        // gets all card objects
        const cards = document.getElementsByClassName("card");

        // stores information for future refernce
        this.#goofy = enabled;

        // enables goofy mode
        if (this.#goofy) {
            // applies the card back to every card
            for (let i=0; i<cards.length; i++) {
                cards[i].appendChild(ui.createCard("cards/cardBackRed.png", null, "hidden"));
            }
        }

        //disables goofy mode
        else {
            // removes the card back from every card
            for (let i=0; i<cards.length; i++) {
                cards[i].removeChild(cards[i].firstChild);
            }
        }
    }

    setAutoMove(enabled) {
        /*Enables/disables auto moves*/

        this.#autoMove = enabled;
    }

    createCard(src, onclick, cssClass="card") {
        /*Returns a interactable div element given a filesource and a function when clicked on*/

        // sets up the div
        const div = document.createElement("div");
        div.className = cssClass;
        div.style.backgroundImage = `url(${src})`

        // applies the interactive function
        if (onclick != null) {
            div.addEventListener("pointerdown", onclick);
        }

        return div;
    }

    renderPile(game, pile, i) {
        /*Renders all of the cards in a given pile in pile element at index i*/

        // gets all of the cards within the pile
        const cards = pile.viewAll();

        // for every card, depending on if goofy and/or dark mode is active or not, it will render the card with the specifications
        for (let j=0; j<cards.length; j++) {
            let card = null;

            // dark mode
            if (this.#darkMode) {
                card = this.createCard(cards[j].getImageRef(), game.onDragStart, "card invert");
            }
            else {
                card = this.createCard(cards[j].getImageRef(), game.onDragStart);
            }
            
            // goofy mode
            if (this.#goofy) {
                card.appendChild(this.createCard("cards/cardBackRed.png", null, "hidden"));
            }
            
            // appends the new card to the pile element
            this.#pileEls[i].appendChild(card);
        }

        // applies dark mode filters if dark mode is active
        if (this.#darkMode) {
            this.setFilters(this.#hueRotation, this.#grayscale, this.#sepia);
        }
    }

    destroyCards() {
        /*Destroys all card elements within the screen*/

        // removes all cards from the tableau columns
        for (let i=0; i<8; i++) {
            this.removeChildren(this.#pileEls[i]);
        }

        // removes all cards from the free cells
        for (let i=0; i<4; i++) {
            this.removeChildren(this.#cellEls[i]);
        }

        // removes all cards from the foundation piles
        ["H", "C", "D", "S"].forEach(suit => {
            this.removeChildren(this.#foundationEls[suit]);
        });
    }

    withinElement(el, x, y) {
        /*Returns true if x and y coords inside element*/

        const rect = el.getBoundingClientRect();
        return x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom;
    }

    checkWithinAll(x, y) {
        /*Finds the element that the given x and y coords are in*/
        let elOutput = null;

        // checks if it is in one of the tableau columns
        this.#pileEls.forEach(el => {
            if (this.withinElement(el, x, y)) {
                elOutput = el;
            }
        });

        // checks if it is in any of the free cells
        this.#cellEls.forEach(el => {
            if (this.withinElement(el, x, y)) {
                elOutput = el;
            }
        });

        // checks if it is in any of the foundation piles
        ["H", "C", "D", "S"].forEach(suit => {
            let el = this.#foundationEls[suit];
            if (this.withinElement(el, x, y)) {
                elOutput = el;
            }
        });

        return elOutput;
    }

    getElement(elName) {
        /*Returns an element given its codename*/

        let outputEl = null;

        switch (elName) {
            case "foundations":
                outputEl = this.#foundationEls;
                break;
            case "endScreen":
                outputEl = this.#endScreenEl;
                break;
            case "endScreenTxt":
                outputEl = this.#endScreenTxtEl;
                break;
            default:
                if (elName[0] == "c") { // free cells
                    outputEl = this.#cellEls[elName[1]];
                }
                else if (elName[0] == "p") { // tableau columns
                    outputEl = this.#pileEls[elName[1]];
                }
                else { // foundation piles
                    outputEl = this.#foundationEls[elName];
                }
        }

        return outputEl;
    }

    removeChildren(el) {
        /*Removes the children elements of a given container element*/

        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }
    }

    displayWon(won) {
        /*Displays the winning/losing cutscene given a boolean*/

        // gets all card elements
        const cardsEl = document.getElementsByClassName("card");

        // makes the end screen interactable which means the player cant do anything from this point forward
        this.#endScreenEl.style.display = "flex";

        // winning cutscene
        if (won) {
            // styling the end screen
            this.#endScreenEl.style.backgroundImage = "url('backgrounds/win.png')";
            this.#endScreenTxtEl.style.color = "white";
            this.#endScreenTxtEl.textContent = "GAME WON";
            
            // playing the animation
            setTimeout(() => {
                for (let i=0; i<cardsEl.length; i++) {
                    cardsEl[i].classList.add("win-anim");
                }
            }, 100);
        }
        // losing cutscene
        else {
            // styling the end screen
            this.#endScreenEl.style.backgroundImage = "url('backgrounds/gameOver.png')";
            this.#endScreenTxtEl.style.color = "red";
            this.#endScreenTxtEl.textContent = "GAME LOST";

            // playing the animation
            setTimeout(() => {
                for (let i=0; i<cardsEl.length; i++) {
                    cardsEl[i].classList.add("lose-anim");
                }
            }, 100);
        }

        // makes the end screen appear
        setTimeout(() => {
            this.#endScreenEl.style.opacity = 1;
        }, 2000);

        // makes the end screen disappear
        setTimeout(() => {
            this.#endScreenEl.style.opacity = 0;
        }, 5000);

        setTimeout(() => {
            // makes the end screen non-interactable
            this.#endScreenEl.style.display = "none";

            // removes the animation class from all of the cards so the animation can be played again
            for (let i=0; i<cardsEl.length; i++) {
                cardsEl[i].classList.remove("win-anim");
                cardsEl[i].classList.remove("lose-anim");
            }
        }, 5500);
    }

    getEventInfo(ev) {
        /*Creates a class which retrieves the important data from the event in a class output.*/
        const source = ev.target.parentNode;
        const children = Array.from(source.children);
        const childIndex = children.indexOf(ev.target);
        
        let eventInfo = null;

        try {
            const touch = ev.touches[0];
            eventInfo = new EventInfo(
                source,
                children,
                childIndex,
                children.length - childIndex,
                touch.clientX,
                touch.clientY
            )
        }
        catch (err) {
            console.log(err);
            eventInfo = new EventInfo(
                source,
                children,
                childIndex,
                children.length - childIndex,
                ev.clientX,
                ev.clientY
            )
        }

        return eventInfo;
    }

    pickupCards(evInfo, clientX, clientY) {
        /*Visually picks up a card*/

        this.#isMovingCard = true;

        /*gets the cards being dragged and their offsets from the mouse*/
        for (let i=evInfo.index; i<evInfo.length; i++) {
            const child = evInfo.children[i];
            const rect = child.getBoundingClientRect();

            this.#activeCards.push(child);
            this.#offsets.push([evInfo.clientX-rect.left, evInfo.clientY - rect.top + 15]);
        }

        /* picks up the cards by:
        moves all cards to the document body, 
        sets their position to absolute
        and moves them to the mouse
        
        also changes the shadow to look bigger*/
        for (let i=0; i<this.#activeCards.length; i++) {
            document.body.appendChild(this.#activeCards[i]);
            this.#activeCards[i].style.position = "absolute";
            this.#activeCards[i].style.transform = `translate(${evInfo.clientX-this.#offsets[i][0]}px, ${evInfo.clientY-this.#offsets[i][1]}px)`;
            this.#activeCards[i].style.boxShadow = "0 0 0.4vh 1vh rgba(0, 0, 0, 0.2)";
        }

        // updates the last position of the mouse
        this.#lastPosition = [clientX, clientY];
    }

    moveCards(ev) {
        /*moves card to mouse position via a transform. Requests an animation frame to reduce lag*/

        let touch = null;
        try {
            touch = ev.touches[0];
        }
        catch (err) {
            console.log(err);
        }

        // finds the change in x and y mouse coordinates
        let dx = 0;
        let dy = 0;
        if (!touch) {
            dx = this.#lastPosition[0] - ev.clientX;
            dy = this.#lastPosition[1] - ev.clientY;
        }
        else {
            dx = this.#lastPosition[0] - touch.clientX;
            dy = this.#lastPosition[1] - touch.clientY;
        };

        // requests an animation frame to move the cards
        requestAnimationFrame(() => {
            for (let i=0; i<this.#activeCards.length; i++) {
                // moving the card
                if (!touch) {
                    this.#activeCards[i].style.transform = `translate(${ev.clientX - this.#offsets[i][0]}px, ${ev.clientY - this.#offsets[i][1]}px)`;
                }
                else {
                    this.#activeCards[i].style.transform = `translate(${touch.clientX - this.#offsets[i][0]}px, ${touch.clientY - this.#offsets[i][1]}px)`;
                };
                
                // moving the shadow offset
                this.#activeCards[i].style.boxShadow = `${dx}px ${dy}px 0.4vh 1vh rgba(0, 0, 0, 0.2)`;
            } 
        });

        // updates the last position of the mouse
        if (!touch) {
            this.#lastPosition = [ev.clientX, ev.clientY];
        }
        else {
            this.#lastPosition = [touch.clientX, touch.clientY];
        }
    }

    isMovingCards() {
        /*Returns true if currently moving any cards*/

        return this.#isMovingCard;
    }
    
    getAmountMoving() {
        /*Returns the amount of cards that the player is currently moving*/

        return this.#activeCards.length;
    }

    moveCardsToTarget(target) {
        /*Moves all cards currently being moved to a target element given its rect as well*/

        const targetRect = target.getBoundingClientRect();

        // gets the rect of the bottom card (the one the player is actually touching)
        const cardRect = this.#activeCards[0].getBoundingClientRect();

        // calculates the x and y values needed to transform the card to the target
        const x = (targetRect.left+targetRect.right)/2 - (cardRect.width)/2;
        const y = targetRect.top;

        // requests an animation frame to move every card
        requestAnimationFrame(() => {
            for (let i=0; i<this.#activeCards.length; i++) {
                // sets the duration of the transition to be longer
                this.#activeCards[i].style.transition = "transform 0.1s ease-out";

                // moves the cards to a tableau column and accounts for the amount of cards within it
                if ("p" == target.id[0]) {
                    this.#activeCards[i].style.transform = `translate(${x}px, ${y + (3.8 * this.#vh) * (target.childElementCount+1)}px)`;
                }

                // moves the cards to a foundation pile or free cell
                else {
                    this.#activeCards[i].style.transform = `translate(${x}px, ${y}px)`;
                }
            }
        });

        // appends cards to proper spot
        const moveToSpot = () => this.moveToEl(target, this.#activeCards);
        document.addEventListener("transitionend", moveToSpot, { once: true });
    }

    moveToEl(target, cards, childIndex=cards.length, override=false) {
        /*appends cards to target as children and resets its styling
        as well as doing win/loss checks and doing things regarding to
        dropping a card*/

        // requests an animation frame to append cards and reset styling
        requestAnimationFrame(() => {
            // appends cards to target and resets their style
            const length = cards.length;
            const startIndex = length-childIndex;
            for (let i=startIndex; i<length; i++) {
                target.appendChild(cards[i]);
                this.resetStyle(cards[i]);
            }

            // by default will reset some information, play audio, and try to move some cards
            if (!override) {
                // resets information
                this.#activeCards = [];
                this.#offsets = [];
                this.#isMovingCard = false;
                
                audio.play("place");
                if (this.#autoMove) {
                    game.autoMoveCards();
                }
            }

            // checks if the game has been won or lost
            game.checkGameWon();
            game.checkGameLost();
        });
    }

    resetStyle(card) {
        /*Resets the styling of a card element*/

        card.style.transition = "transform 0.05s ease-out, box-shadow 0.1s ease-out";
        card.style.position = "relative";
        card.style.transform = "translate(0px, 0px)";
        card.style.boxShadow = "0 0 0.4vh 0.3vh rgba(0, 0, 0, 0.2)";
    }

    shove(source, target, childIndex, skipAnimation=false, override=false) {
        /*Visually picks up the top card from the source element, 
        moves it to the target element, and drops it.
        Will play an animation by default*/

        const children = Array.from(source.children);

        // moving cards with animation
        if (!skipAnimation) {
            // once the animation has finished it will return true
            return new Promise(resolve => {
                let resolved = false;

                // gets rects of the card, source, and target elements
                const cardRect = children[0].getBoundingClientRect();
                const sourceRect = source.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();

                // calculates the current position of the card
                let x = (sourceRect.left+sourceRect.right)/2 - cardRect.width / 2;
                let y = sourceRect.top;

                // picks cards up
                for (let i=children.length-childIndex; i<children.length; i++) {
                    children[i].style.position = "absolute";
                    children[i].style.transform = `translate(${x}px, ${y+(15*ui.#vh)*childIndex}px)`;
                    children[i].style.boxShadow = "0 0 0.4vh 1vh rgba(0, 0, 0, 0.2)";
                    document.body.appendChild(children[i]);
                }

                // calculates the x any y translation required to move the card to the middle of the target element
                x = (targetRect.left+targetRect.right)/2 - (cardRect.width)/2;
                y = targetRect.top;

                // requests an animation frame to move the cards
                requestAnimationFrame(() => {
                    for (let i=children.length-childIndex; i<children.length; i++) {
                        // makes transition longer
                        children[i].style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";

                        // moves cards to the target
                        if (this.#pileEls.includes(target)) {
                            children[i].style.transform = `translate(${x}px, ${y + (3.8 * this.#vh) * (target.childElementCount+1)}px)`;
                        }
                        else {
                            children[i].style.transform = `translate(${x}px, ${y-(2*this.#vh)}px)`;
                        }
                    }

                    // will execute this mini function when the card reached its destination
                    const finish = () => {
                        if (!resolved) {
                            resolved = true;
                            this.moveToEl(target, children, childIndex, override);
                            resolve(true);
                        }
                    };
                    
                    // waits for a maximum of 200 milliseconds for the card to move to its target to execute the mini function
                    children[0].addEventListener("transitionend", finish, { once: true });
                    setTimeout(finish, 100);
                });
            });
        }
        else {
            // if no animation is wanted it will just add the cards to the target element
            for (let i=children.length-childIndex; i<children.length; i++) {
                target.append(children[i])
                this.resetStyle(children[i])
            }
        }
        
    }

    playError(el) {
        /*A visual shaking animation that is applied on an element*/

        el.animate(
            [
                { transform: "translateX(0vh)"},
                { transform: "translateX(-1vh)"},
                { transform: "translateX(1vh)"},
                { transform: "translateX(-1vh)"},
                { transform: "translateX(0vh)"}
            ], {
                duration: 300
            }
        );
    }
}

class EventInfo {
    /*His whole life purpose is to be an extravagant {}*/
    constructor(source, children, childIndex, amountMoving, clientX, clientY) {
        this.parentNode = source;
        this.children = children;
        this.index = childIndex;
        this.amountMoving = amountMoving;
        this.length = this.children.length;
        this.clientX = clientX;
        this.clientY = clientY;
    }
}