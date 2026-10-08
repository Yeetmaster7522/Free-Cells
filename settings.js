class Settings {
    #settingsPage
    #theme
    #backgroundFileCustom
    #volume
    #goofy
    #shuffle
    #closeButton
    #darkMode
    #autoMove

    constructor() {
        // elements
        this.#goofy = document.getElementById("goofy");
        this.#settingsPage = document.getElementById("settings");
        this.#theme = document.getElementById("theme");
        this.#backgroundFileCustom = document.getElementById("background-file-custom");
        this.#volume = document.getElementById("volume");
        this.#shuffle = document.getElementById("shuffle");
        this.#darkMode = document.getElementById("dark-mode");
        this.#closeButton = document.getElementById("escape-button");
        this.#autoMove = document.getElementById("automove");

        // event listeners
        this.#closeButton.addEventListener("click", () => {
            // communicating to the rest of the program what needs to be set
            this.#settingsPage.style.display = "none";

            audio.setVolume(this.#volume.value);

            ui.setAutoMove(this.#autoMove.checked);
            
            if (!this.#backgroundFileCustom.value) {
                ui.setBackgroundImg(`backgrounds/${this.#theme.value}Background.png`);
            }
            else {
                ui.setBackgroundImg(`${URL.createObjectURL(this.#backgroundFileCustom.files[0])}`);
            }

            let rgb = {
                "r": 0,
                "g": 0,
                "b": 0
            };
            let hueRotation = 0;
            let grayscale = 0;
            let sepia = 0;

            switch(this.#theme.value) {
                case "dessert":
                    rgb = {
                        "r": 235,
                        "g": 231,
                        "b": 42
                    };
                    hueRotation = 220;
                    break;
                case "galaxy":
                    rgb = {
                        "r": 255,
                        "g": 0,
                        "b": 255
                    };
                    hueRotation = 90;
                    break;
                case "hellish":
                    rgb = {
                        "r": 100,
                        "g": 0,
                        "b": 0
                    };
                    hueRotation = 185;
                    break;
                case "icy":
                    rgb = {
                        "r": 0,
                        "g": 255,
                        "b": 255
                    };
                    break;
                case "nature":
                    rgb = {
                        "r": 0,
                        "g": 255,
                        "b": 0
                    };
                    hueRotation = 315;
                    break;
                case "starry":
                    rgb = {
                        "r": 255,
                        "g": 255,
                        "b": 255
                    };
                    grayscale = 75;
                    break;
                default:
                    rgb = {
                        "r": 0,
                        "g": 0,
                        "b": 0
                    };
                    hueRotation = 185;
                    sepia = 60;
            }
            
            ui.setColor(rgb);

            ui.setDarkMode(this.#darkMode.checked);
            ui.setFilters(hueRotation, grayscale, sepia);

            game.setShuffle(this.#shuffle.checked);

            ui.setGoofy(this.#goofy.checked);
        });
    }
}