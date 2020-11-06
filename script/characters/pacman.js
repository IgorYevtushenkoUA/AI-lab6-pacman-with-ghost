export class Pacman {
    'use strict'
    _posX = 0
    _posY = 0
    _life = 0
    _eatenBeans = 0
    _speed = 0
    _radius = 0
    _vertex = undefined // i`m not sure that i need this

    constructor(x, y, life, beans, speed, radius, vertex) {
        this._posX = x
        this._posY = y
        this._life = life
        this._eatenBeans = beans
        this._speed = speed
        this._radius = radius
        this._vertex = vertex
    }

    getX()          {return this._posX}
    getY()          {return this._posY}
    getLife()       {return this._life}
    getSpeed()      {return this._speed}
    getVertex()     {return this._vertex}
    getEatenBean()  {return this._eatenBeans}

    setX(x)         {this._posX = x}
    setY(y)         {this._posY = y}
    setLife(life)   {this._life = life}
    setSpeed(s)     {this._speed = s}
    setVertex(v)    {this._vertex = v}
    setEatenBean(b) {this._eatenBeans = b}

    draw() {
        let pacman_color = "yellow"
        ctx.fillStyle = pacman_color
        ctx.beginPath()
        ctx.arc(this._posX, this._posY, this._radius, 0, Math.PI * 2, true);
        ctx.lineTo(this._posX, this._posY)
        ctx.fill()
    }

    // move in current Vertex
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
        this._posX = newX
        this._posY = newY
    }

    pacmanMove(){

    }





}
