class VertexInfo {
    /**
     *
     * @param {Vertex} parent
     * @param {Vertex} currentV
     * @param {number} f
     * @param {number} g
     * @param {number} h
     */
    constructor(parent, currentV, f, g, h) {
        this._parent = parent;
        this._currentV = currentV;
        this._f = f;
        this._g = g;
        this._h = h;
    }

    getParent() {
        return this._parent;
    }

    setParent(parent) {
        this._parent = parent;
    }

    getCurrentV() {
        return this._currentV;
    }

    setCurrentV(currentV) {
        this._currentV = currentV;
    }

    getF() {
        return this._f;
    }

    setF(f) {
        this._f = f;
    }

    getG() {
        return this._g;
    }

    setG(g) {
        return this._g = g
    }

    getH() {
        return this._h
    }

    setH() {
        return this._h
    }

    toString() {
        return "Parent :: " + this.getParent() + "\tCurrent :: " + this.getCurrentV() + "\tF :: " + this.getF() + "\tG :: " + this.getG() + "\tH :: " + this.getH() + "\n"
    }
}
