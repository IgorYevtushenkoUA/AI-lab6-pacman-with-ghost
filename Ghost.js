function Ghost(xCord, yCord, gColor, direction, id) {
    this.x = xCord;
    this.y = yCord;
    this.color = gColor;
    this.id = id
    this.dir = direction;
    this.radius = GHOST_RADIUS;
    this.speed = speed;
    this.stepCounter = 0;

}

Ghost.prototype.setInStartPosition = function () {
    let x,
        y
    switch (this.id) {
        case 1:
            x = ghostHouse[0][1] * GRID_WIDTH + GRID_WIDTH / 2;
            y = ghostHouse[0][0] * GRID_WIDTH + GRID_WIDTH / 2;
            break
        case 2:
            x = ghostHouse[1][1] * GRID_WIDTH + GRID_WIDTH / 2;
            y = ghostHouse[1][0] * GRID_WIDTH + GRID_WIDTH / 2;
            break
        case 3:
            x = ghostHouse[2][1] * GRID_WIDTH + GRID_WIDTH / 2;
            y = ghostHouse[2][0] * GRID_WIDTH + GRID_WIDTH / 2;
            break
        case 4:
            x = ghostHouse[3][1] * GRID_WIDTH + GRID_WIDTH / 2;
            y = ghostHouse[3][0] * GRID_WIDTH + GRID_WIDTH / 2;
            break
    }
    this.x = x;
    this.y = y;
    this.dir = DOWN;
    this.stepCounter = 0;
}

Ghost.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
    ctx.moveTo(this.x - this.radius, this.y);
    ctx.fill();
};

Ghost.prototype.getRow = function () {
    return getRowIndex(this.y);
};

Ghost.prototype.getCol = function () {
    return getColIndex(this.x);
};

//move one step in the current direction if allowed
Ghost.prototype.moveOneStep = function () {
    let newX = 0;
    let newY = 0;
    if (!canMove(this.x, this.y, this.dir)) {
        return;
    }
    switch (this.dir) {

        case UP:
            newY = this.y - this.speed;
            if (newY - this.radius - WALL_WIDTH > 0) {
                this.y = newY;
            }
            break;

        case DOWN:
            newY = this.y + this.speed;
            if (newY + this.radius + WALL_WIDTH < CANVAS_HEIGHT) {
                this.y = newY;
            }
            break;


        case LEFT:
            newX = this.x - this.speed;
            if (newX - this.radius - WALL_WIDTH > 0) {
                this.x = newX;
            }
            break;

        case RIGHT:
            newX = this.x + this.speed;

            if (newX + this.radius + WALL_WIDTH < CANVAS_WIDTH) {
                this.x = newX;
            }
            break;

        default:
            break;
    }
};

//try to turn(if necessary) and move the ghost
Ghost.prototype.move = function () {

    if (this.stepCounter != 0 && this.stepCounter % 2 != 0) {
        this.speed = speed / 2;
        this.stepCounter = 0;
    } else {
        this.speed = speed;
    }
    // debugger
    if (onGridCenter(this.x, this.y) === false) {
        this.moveOneStep();
    } else {
        // on grid center
        //first check if dead end
        let currGrid = maze[getRowIndex(this.y)][getColIndex(this.x)];
        if (currGrid.gridType === LEFT_TOP_RIGHT) {
            this.dir = DOWN;
            this.moveOneStep();
        } else if (currGrid.gridType === TOP_RIGHT_BOTTOM) {
            this.dir = LEFT;
            this.moveOneStep();
        } else if (currGrid.gridType === RIGHT_BOTTOM_LEFT) {
            this.dir = UP;
            this.moveOneStep();
        } else if (currGrid.gridType === BOTTOM_LEFT_TOP) {
            this.dir = RIGHT;
            this.moveOneStep();
        } else {
            switch (this.id) {
                case 1:
                    this.randomGhostMoving();
                    break;
            }
        }
    }
};

//inky is unpredictable, makes random move
Ghost.prototype.randomGhostMoving = function () {
    this.randomMove();
};

//make random move at intersection
Ghost.prototype.randomMove = function () {
    var nextDir = parseInt(Math.random() * 4) + 1;
    while (true) {
        if (nextDir != oppositeDir(this.dir)
            && canMove(this.x, this.y, nextDir)) {
            break;
        }
        nextDir = parseInt(Math.random() * 4) + 1;
    }

    this.dir = nextDir;
    this.moveOneStep();
};
