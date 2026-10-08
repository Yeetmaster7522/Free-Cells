class AudioPlayer {
    #cardPlaceSFX
    #winSFX
    #loseSFX
    
    constructor() {
        /*Loads up all the sounds that can be played*/

        this.#cardPlaceSFX = new Audio("sounds/placeCard.mp3");
        this.#cardPlaceSFX.volume = 0.4;
        this.#winSFX = new Audio("sounds/win.wav");
        this.#loseSFX = new Audio("sounds/lose.wav");
    }

    play(audio) {
        /*Plays the audio file from the corresponding audio name*/
        switch(audio) {
            case "place":
                this.#cardPlaceSFX.play();
                break;
            case "win":
                this.#winSFX.play();
                break;
            case "lose":
                this.#loseSFX.play()
                break;
            default:
        }
    }

    setVolume(volMultiplier) {
        /*Multiplies the volume of each sound with the given multiplier*/

        this.#cardPlaceSFX.volume = this.#cardPlaceSFX.volume*volMultiplier;
        this.#winSFX.volume = volMultiplier;
        this.#loseSFX.volume = volMultiplier;
    }
}