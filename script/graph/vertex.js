class Vertex {
    constructor(name, x, y, id) {
        this._name = name
        this._x = x
        this._y = y
        this._id = id
    }

    getName() {
        return this._name
    }

    getX() {
        return this._x
    }

    getY() {
        return this._y
    }

    getID() {
        return this._id
    }

    toString() {
        return `Name ~ ${this.getName()}\tX ~ ${this.getX()}\tY ~ ${this.getY()}\tID ~ ${this.getID()} `
    }
}
