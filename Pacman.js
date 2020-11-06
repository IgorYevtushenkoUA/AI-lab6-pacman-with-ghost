function Pacman(xCord, yCord, direction){
	this.x = xCord;
	this.y = yCord;
	this.dir = direction;
	this.nextDir = undefined; //the direction to turn at next available turning point
	this.radius = PACMAN_RADIUS;
	this.mouthOpen = true;
}


Pacman.prototype.draw = function(color) {
	if (color == undefined){
		ctx.fillStyle = PACMAN_COLOR;
	}
	else{
		ctx.fillStyle = color;
	}
	ctx.beginPath();

	ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);

	ctx.lineTo(this.x, this.y);
	ctx.fill();
};

//get the row index of current location
Pacman.prototype.getRow = function() {
	return getRowIndex(this.y);
};

//get the col index of current location
Pacman.prototype.getCol = function() {
	return getColIndex(this.x);
};

//return if pacman can move with current direction & tile
Pacman.prototype.canMove = function(dir) {
	return canMove(this.x, this.y, dir);
};

//try to turn(if necessary) and move the pacman.
Pacman.prototype.move = function() {
	if(onGridCenter(this.x, this.y) === false){
		//not on a grid center
		if(this.nextDir != undefined &&  (
			(this.dir === UP && this.nextDir === DOWN )||
			(this.dir === DOWN && this.nextDir === UP) ||
			(this.dir === LEFT && this.nextDir === RIGHT) ||
 			(this.dir === RIGHT && this.nextDir ===LEFT)
			))
		{
			this.dir = this.nextDir;
			this.nextDir = undefined;
		}

		this.moveOneStep();

		return;
	}
	else{
		//on grid center. change direction if needed

		if(this.nextDir != undefined && this.canMove(this.nextDir)){
			this.dir = this.nextDir;
			this.nextDir = undefined;
			this.moveOneStep();
		}
		else{
			//check if pacman can keep moving
			if(this.canMove(this.dir)){
				this.moveOneStep();
			}
		}
	}
};

//move one step in the current direction if allowed
Pacman.prototype.moveOneStep = function() {
	var newX =0;
	var newY =0;
	if(!canMove(this.x, this.y, this.dir)){
		return;
	}
	switch(this.dir){

		case UP:
		newY = this.y  - speed;
		if(newY - this.radius - WALL_WIDTH > 0){
			this.y = newY;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;

		case DOWN:
		newY = this.y + speed;
		if(newY + this.radius + WALL_WIDTH < CANVAS_HEIGHT) {
			this.y = newY;
			this.mouthOpen = ! this.mouthOpen;

		}
		break;


		case LEFT:
		newX = this.x - speed;
		if(newX - this.radius - WALL_WIDTH > 0 ){
			this.x = newX;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;

		case RIGHT:
		newX = this.x + speed;

		if(newX + this.radius + WALL_WIDTH < CANVAS_WIDTH){
			this.x = newX;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;

		default:
		break;
	}
};





