import {
    BOTTOM_LEFT_TOP,
    BOTTOM_ONLY, CLOSED_GRID, CROSS_RD,
    ctx,
    EMPTY_GRID,
    GRID_HEIGHT,
    GRID_WIDTH, LEFT_BOTTOM,
    LEFT_ONLY,
    LEFT_RIGHT, LEFT_TOP, LEFT_TOP_RIGHT, RIGHT_BOTTOM, RIGHT_BOTTOM_LEFT,
    RIGHT_ONLY, RIGHT_TOP, TOP_BOTTOM,
    TOP_ONLY, TOP_RIGHT_BOTTOM,
    BEAN_COLOR, BORDER_COLOR, NORMAL_BEAN, NORMAL_BEAN_RADIUS, WALL_WIDTH
} from "./constants.js";

'use strict'

function Grid(xCord, yCord, gridType, beanType) {
    this.x = xCord;
    this.y = yCord;
    this.gridType = gridType === undefined ? EMPTY_GRID : gridType;
    this.beanType = beanType;
}

Grid.prototype.draw = function () {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(this.x, this.y, GRID_WIDTH, GRID_HEIGHT);
    let gridType = this.gridType;
    if (gridType === undefined || gridType === EMPTY_GRID) {
        this.drawBean();
        return;
    }

    switch (gridType) {

        case LEFT_ONLY:
            this.addLeftEdge();
            break;

        case RIGHT_ONLY:
            this.addRightEdge();
            break;

        case TOP_ONLY:
            this.addTopEdge();
            break;

        case BOTTOM_ONLY:
            this.addBottomEdge();
            break;

        case LEFT_RIGHT:
            this.addLeftEdge();
            this.addRightEdge();
            break;

        case LEFT_TOP:
            this.addLeftEdge();
            this.addTopEdge();
            break;

        case LEFT_BOTTOM:
            this.addLeftEdge();
            this.addBottomEdge();
            break;

        case RIGHT_TOP:
            this.addRightEdge();
            this.addTopEdge();
            break;

        case RIGHT_BOTTOM:
            this.addRightEdge();
            this.addBottomEdge();
            break;

        case TOP_BOTTOM:
            this.addTopEdge();
            this.addBottomEdge();
            break;

        case CROSS_RD:
            this.makeCrossRoad();
            break;

        case LEFT_TOP_RIGHT:
            this.addLeftEdge();
            this.addTopEdge();
            this.addRightEdge();
            break;

        case TOP_RIGHT_BOTTOM:
            this.addTopEdge();
            this.addRightEdge();
            this.addBottomEdge();
            break;

        case RIGHT_BOTTOM_LEFT:
            this.addRightEdge();
            this.addBottomEdge();
            this.addLeftEdge();
            break;

        case BOTTOM_LEFT_TOP:
            this.addBottomEdge();
            this.addLeftEdge();
            this.addTopEdge();
            break;

        case CLOSED_GRID:
            this.addLeftEdge();
            this.addTopEdge();
            this.addBottomEdge();
            this.addRightEdge();
            break;

        default:
            break;
    }
    this.drawBean();
};

Grid.prototype.addLeftEdge = function () {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(this.x, this.y, WALL_WIDTH, GRID_HEIGHT);
};

Grid.prototype.addRightEdge = function () {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(this.x + GRID_WIDTH - WALL_WIDTH, this.y, WALL_WIDTH, GRID_HEIGHT);
};

Grid.prototype.addTopEdge = function () {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(this.x, this.y, GRID_WIDTH, WALL_WIDTH);
};

Grid.prototype.addBottomEdge = function () {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(this.x, this.y + GRID_HEIGHT - WALL_WIDTH, GRID_WIDTH, WALL_WIDTH);
};

Grid.prototype.makeCrossRoad = function () {
    ctx.fillStyle = BORDER_COLOR;
    ctx.fillRect(this.x, this.y, WALL_WIDTH, WALL_WIDTH);
    ctx.fillRect(this.x + GRID_WIDTH - WALL_WIDTH, this.y, WALL_WIDTH, WALL_WIDTH);
    ctx.fillRect(this.x, this.y + GRID_HEIGHT - WALL_WIDTH, WALL_WIDTH, WALL_WIDTH);
    ctx.fillRect(this.x + GRID_WIDTH - WALL_WIDTH, this.y + GRID_HEIGHT - WALL_WIDTH, WALL_WIDTH, WALL_WIDTH);
};


//draw a bean at the center of this grid
Grid.prototype.drawBean = function () {
    let beanType = this.beanType;
    let centerX = this.x + GRID_WIDTH / 2;
    let centerY = this.y + GRID_HEIGHT / 2;

    ctx.fillStyle = BEAN_COLOR;
    if (beanType === undefined) {
        return;
    }

    if (beanType === NORMAL_BEAN) {
        circle(ctx, centerX, centerY, NORMAL_BEAN_RADIUS);
    } else {
        return;
    }
};


function circle(ctx, cx, cy, radius) {

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI, true);
    ctx.fill();

}
