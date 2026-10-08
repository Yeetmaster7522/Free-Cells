class Stack {
    #stack

    constructor() {
        this.#stack = [];
    }

    push(obj) {
        this.#stack.push(obj);
    }

    pop() {
        if (this.getSize() >= 1) {
            return this.#stack.pop();
        }
        else {
            return null;
        }
    }

    getSize() {
        return this.#stack.length;
    }
}