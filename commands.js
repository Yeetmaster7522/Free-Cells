class Commands {
    #settingsButton
    #settingsPage
    #undoButton
    #resetButton
    #newButton

    constructor() {
        /*Gets the button elements*/

        this.#settingsButton = document.getElementById("settings-button");
        this.#settingsPage = document.getElementById("settings");
        this.#undoButton = document.getElementById("undo-button");
        this.#resetButton = document.getElementById("reset-button");
        this.#newButton = document.getElementById("new-button");

        // event listeners
        this.#settingsButton.addEventListener("click", () => {
            this.#settingsPage.style.display = "flex";
        });

        this.#undoButton.addEventListener("click", () => {
            game.revert();
        });
        
        this.#resetButton.addEventListener("click", () => {
            game.revert(true);
        });
        
        this.#newButton.addEventListener("click", () => {
            game.reset();
        });
    }
}