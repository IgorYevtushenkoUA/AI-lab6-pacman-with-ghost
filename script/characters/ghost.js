class Ghost {
    'use strict'

    _id = 0
    _x = 0;
    _y = 0;
    _color = 0;
    _vertex = 0
    _radius = 0;
    _speed = 0;
    _stepCounter = 0;

    constructor(id,xCord, yCord, gColor, vertex, radius, speed) {
        this._id = id
        this._x = xCord;
        this._y = yCord;
        this._color = gColor;
        this._vertex = vertex;
        this._radius = radius;
        this._speed = speed;
        this._stepCounter = 0;
    }

    getGhostID()        {return this._id}
    getX()              {return this._x}
    getY()              {return this._y}
    gerColor()          {return this._color}
    getVertex()         {return this._vertex}
    getRadius()         {return this.radius}
    getSpeed()          {return this._speed}
    getStepCounter()    {return this._stepCounter}

    setX(x)                 {this._x = x}
    setY(y)                 {this._y = y}
    setColor(color)         {this._color = c}
    setVertex(v)            {this._vertex = v}
    setRadius(r)            {this._radius = r}
    setSpeed(s)             {this._speed = s}
    setStepCounter(counter) {this._stepCounter = counter}



    draw() {
        ctx.fillStyle = this._color;
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, Math.PI * 2, 0, false);
        ctx.moveTo(this._x - this._radius, this._y);
        ctx.fill();
    }


    // move in current Vertex (todo here duplicate code xz may it norm but can improve xz xz)
    doOneStep(side, x, y){
        let newX, newY
        switch (side) {
            case "TOP" :
                newX = x
                newY = y - this._speed
                break
            case "RIGHT" :
                newX = x + this._speed
                newY = y
                break
            case "BOTTOM" :
                newX = x
                newY = y + this._speed
                break
            case "LEFT" :
                newX = x -  this._speed
                newY = y
                break
        }
        this._x = newX
        this._y = newY
    }

}
