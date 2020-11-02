//wall cases
let CROSS_RD = -1;//no wall
let LEFT_ONLY = 0;
let TOP_ONLY = 1;
let RIGHT_ONLY = 2;
let BOTTOM_ONLY = 3;

let LEFT_RIGHT = 4;
let LEFT_TOP = 5;
let LEFT_BOTTOM = 6;

let RIGHT_TOP = 7;
let RIGHT_BOTTOM = 8;
let TOP_BOTTOM = 9;

let BOTTOM_LEFT_TOP = 10;
let LEFT_TOP_RIGHT = 11;
let TOP_RIGHT_BOTTOM = 12;
let RIGHT_BOTTOM_LEFT = 13;

let EMPTY_GRID = 14;
let CLOSED_GRID = 15;

function Grid (xCord, yCord, gridType, beanType) {
	this.x = xCord;
	this.y = yCord;
	this.gridType = gridType===undefined? EMPTY_GRID : gridType;
	this.beanType = beanType;
}

Grid.prototype.getRow = function() {
	return getRowIndex(this.y);
};

Grid.prototype.getCol = function() {
	return getColIndex(this.x);
};

Grid.prototype.hasBean = true;

Grid.prototype.draw = function() {
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(this.x, this.y, GRID_WIDTH, GRID_HEIGHT);
	let gridType = this.gridType	;
	if(gridType === undefined || gridType === EMPTY_GRID){
		this.drawBean();
		return;
	}

	switch(gridType){

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

Grid.prototype.addLeftEdge = function() {
	ctx.fillStyle = BORDER_COLOR;
	ctx.fillRect(this.x, this.y, WALL_WIDTH, GRID_HEIGHT);
};

Grid.prototype.addRightEdge = function() {
	ctx.fillStyle = BORDER_COLOR;
	ctx.fillRect(this.x+GRID_WIDTH - WALL_WIDTH , this.y, WALL_WIDTH , GRID_HEIGHT);
};

Grid.prototype.addTopEdge = function() {
	ctx.fillStyle = BORDER_COLOR;
	ctx.fillRect(this.x, this.y, GRID_WIDTH, WALL_WIDTH);
};

Grid.prototype.addBottomEdge = function() {
	ctx.fillStyle = BORDER_COLOR;
	ctx.fillRect(this.x, this.y + GRID_HEIGHT - WALL_WIDTH, GRID_WIDTH, WALL_WIDTH);
};

Grid.prototype.makeCrossRoad = function() {
	ctx.fillStyle = BORDER_COLOR;
	ctx.fillRect(this.x, this.y, WALL_WIDTH, WALL_WIDTH);
	ctx.fillRect(this.x + GRID_WIDTH - WALL_WIDTH, this.y, WALL_WIDTH, WALL_WIDTH);
	ctx.fillRect(this.x, this.y + GRID_HEIGHT - WALL_WIDTH, WALL_WIDTH, WALL_WIDTH);
	ctx.fillRect(this.x + GRID_WIDTH - WALL_WIDTH, this.y + GRID_HEIGHT - WALL_WIDTH, WALL_WIDTH, WALL_WIDTH);
};


//draw a bean at the center of this grid
Grid.prototype.drawBean = function() {
	let beanType = this.beanType;
	let centerX = this.x + GRID_WIDTH/2;
	let centerY = this.y + GRID_HEIGHT/2;

	ctx.fillStyle = BEAN_COLOR;
	if(beanType === undefined){
		return;
	}

	if(beanType === NORMAL_BEAN){
		circle(ctx, centerX, centerY, NORMAL_BEAN_RADIUS);
	}
	else{
		return;
	}
};
