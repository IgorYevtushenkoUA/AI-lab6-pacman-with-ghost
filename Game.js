let ghostNum = document.getElementById("ghost_num").value
let ghostsSpeed = document.getElementById("ghost_speed").value
let pacmanSpeed = document.getElementById("pacman_speed").value

let btnStart = document.getElementById("btn_start").addEventListener("click", function () {})
let btnRestore = document.getElementById("btn_restore").addEventListener("click", function () {})
let btnStop = document.getElementById("btn_stop").addEventListener("click", function () {})
alert()

let canvasID = "myCanvas";
let CANVAS_WIDTH = document.getElementById("myCanvas").width;
let CANVAS_HEIGHT = document.getElementById("myCanvas").height;
let canvas = document.getElementById(canvasID);
let ctx = canvas.getContext("2d");

// game grid
let GRID_WIDTH = 20;
let GRID_HEIGHT = 20;
let WALL_WIDTH = 2;
let numRows = CANVAS_WIDTH / GRID_HEIGHT;
let numCols = CANVAS_HEIGHT / GRID_WIDTH;

let BG_COLOR = "black";
let BORDER_COLOR = "blue";
let BEAN_COLOR = "white";
let PACMAN_COLOR = "yellow";

// colors for ghost
let RED = "red";
let PINK = "#ff9cce";
let CYAN = "#00ffde";
let ORANGE = "#ffb847";
let WEAK_COLOR = "#0031ff";

// size of sprites
let NORMAL_BEAN_RADIUS = 2;
let PACMAN_RADIUS = 5;
let GHOST_RADIUS = 5;

// directions
let UP = 1;
let DOWN = 2;
let LEFT = 3;
let RIGHT = 4;


// game parameters
let intervalId;
let restartTimer = 0;
let timerDelay = 80;
let speed = 5;
let score = 0;
let lives = [];
let MAX_LIFE = 3;
let life = MAX_LIFE;
let weakBonus = 200;
let MAX_BEANS = 136;
let beansLeft = MAX_BEANS;
let weakCounter;
let WEAK_DURATION = 10000 / timerDelay;


//bean cases
let NORMAL_BEAN = 1

let ghost1;
let ghosts;

//game state and map
let gameOn = false;
let gamePaused = false;
let maze = new Array(CANVAS_HEIGHT / GRID_HEIGHT);
let mazeContent = [
    // ROW1 +
    //    1           2           3          4          5          6          7          8           9           10           11           12         13         14         15         16          17          18          19          20          21          22         23         24           25           26           27         28          29          30         31         32          33          34         35          36          37          38          39          40          41         42         43         44         45          46          47          48         49          50        51         52          53          54          55          56
    [LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_TOP],

    // ROW2 +
    //    1          2        3          4           5          6        7         8         9         10        11       12        13        14          15         16         17        18        19        20        21        22        23        24        25        26        27       28        29        30          31          32       33        34         35       36          37        38       39          40        41         42         43         44         45        46        47        48         49         50        51         52        53          54        55      56
    [LEFT_RIGHT, LEFT_TOP, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT],

    // ROW3 +
    //    1           2           3             4            5          6            7           8           9           10         11         12          13           14           15          16          17          18            19          20          21            22           23            24           25           26           27           28          29          30           31           32            33          34           35          36           37           38           39           40           41           42            43            44         45           46          47          48           49            50            51          52          53             54              55          56
    [LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT],


    // ROW4 +
    //    1           2           3             4            5          6            7          8           9             10           11           12         13             14            15         16          17          18          19          20          21          22         23         24           25           26           27         28          29          30         31         32          33           34          35          36          37          38          39          40          41         42          43          44          45          46          47          48         49           50          51           52          53          54          55          56
    [LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, EMPTY_GRID, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM],


    // ROW5+
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_TOP, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, RIGHT_TOP],

    // ROW6+
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY],

    // ROW7+
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_TOP, TOP_ONLY, RIGHT_TOP, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_TOP, TOP_ONLY, RIGHT_TOP, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY],

    // ROW8
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, RIGHT_BOTTOM_LEFT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY],

    // ROW9
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_BOTTOM, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_BOTTOM, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, BOTTOM_LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY],

    // ROW10
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, TOP_ONLY, TOP_ONLY, TOP_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, TOP_ONLY, TOP_ONLY, TOP_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_ONLY, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY],

    // ROW11
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM],

    // ROW12
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, EMPTY_GRID, EMPTY_GRID, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_TOP],

    // ROW13
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, RIGHT_TOP, LEFT_ONLY, RIGHT_ONLY, LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP, TOP_ONLY, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT],
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // ROW14
    //    1           2           3              4          5             6          7            8           9           10        11          12        13           14          15        16       17       18        19         20       21       22        23         24        25          26        27        28        29        30        31        32       33          34        35         36         37      38        39        40       41         42          43           44         45          46          47       48         49        50        51       52        53         54          55        56
    [LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, RIGHT_ONLY, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_TOP, RIGHT_TOP, LEFT_RIGHT, LEFT_BOTTOM, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_TOP, RIGHT_TOP, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_RIGHT],

    // ROW15
    //     1           2           3           4          5           6          7            8           9           10        11          12          13           14          15           16         17         18            19         20          21           22          23         24         25          26           27        28             29         30          31          32          33          34         35         36            37          38           39        40           41         42          43           44         45          46          47          48           49          50           51           52        53           54            55        56
    [LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, RIGHT_BOTTOM, LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM]
]


// grids that don't redraw
let staticGrids = [];
let staticGridsIndex = 0;


// start location of pacman
let pacmanStartLoc = [14, 35];

// grids with no beans

// [ [x1,x2,y1,y2] [....] ]
/*
x1y1..........x2
................
................
..............y2
 */
let noBeans = [
    [1, 3, 1, 2],
    [0, 3, 4, 10],
    [1, 4, 12, 13],
    [5, 13, 1, 3],
    [5, 7, 4, 10],
    [8, 13, 8, 10],
    [9, 11, 5, 6],
    [12, 13, 5, 7],
    [6, 15, 12, 13],
    [15, 29, 1, 2],
    [15, 21, 4, 10],
    [23, 29, 4, 10],
    [17, 18, 12, 15],
    [20, 29, 12, 13],
    [31, 38, 1, 2],
    [31, 34, 4, 8],
    [34, 38, 8, 8],
    [35, 38, 4, 7],
    [40, 42, 1, 10],
    [44, 49, 1, 2],
    [50, 54, 1, 2],
    [31, 38, 10, 11],
    [34, 35, 12, 13],
    [31, 32, 13, 14],
    [37, 38, 13, 14],
    [40, 48, 12, 13],
    [50, 54, 12, 13],
    [44, 46, 4, 10],
    [46, 50, 4, 7],
    [46, 50, 9, 10],
    [52, 55, 4, 10],
    [],

]

let noBean = [pacmanStartLoc];
let noBeanIndex = noBean.length;

// ghost house
let ghostHouse = [];
let ghostHouseIndex = 0;


function fillWithoutBeans() {
    for (let i = 0; i < noBeans.length; i++) {
        let x1 = noBeans[i][0]
        let x2 = noBeans[i][1]
        let y1 = noBeans[i][2]
        let y2 = noBeans[i][3]

        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                noBean[noBeanIndex++] = [y, x]
            }
        }
    }
}


function initCanvas(width, height) {
    if (width === undefined || !(width instanceof Number)) {
        width = CANVAS_WIDTH;
    }
    if (height === undefined || !(height instanceof Number)) {
        height = CANVAS_HEIGHT;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// draw maze, print instruction on lower-left corner, show lives on top-right corner
function initMaze() {
    for (let i = 0; i < maze.length; i++) {
        let oneRow = new Array(CANVAS_WIDTH / GRID_WIDTH);
        maze[i] = oneRow;
    }

    // draw maze with full beans
    for (let row = 0; row < CANVAS_HEIGHT / GRID_HEIGHT; row++) {
        for (let col = 0; col < CANVAS_WIDTH / GRID_WIDTH; col++) {
            let beanType = NORMAL_BEAN;
            if (row > 14) debugger
            var newGrid
            try {
                newGrid = new Grid(col * GRID_WIDTH, row * GRID_HEIGHT, mazeContent[row][col], beanType);
            } catch (e) {
                console.log('mistake')
            }

            maze[row][col] = newGrid;
            newGrid.draw();
        }
    }

    // overwrite beans that shouldn't exist
    for (let i = 0; i < noBean.length - 2; i++) {
        let x = noBean[i][0];
        let y = noBean[i][1];

        try {
            maze[x][y].beanType = undefined;
            maze[x][y].draw();
        } catch (e) {

        }

    }


}

function initFields() {
    let tempGhostNum = 1
    for (let i = 0; i < tempGhostNum; i++) ghostHouse[i] = [4 + i, 35]
    fillWithoutBeans()

}

function circle(ctx, cx, cy, radius) {

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI, true);
    ctx.fill();

}

//get opposite direction
function oppositeDir(dir) {
    switch (dir) {
        case UP:
            return DOWN;
            break;

        case DOWN:
            return UP;
            break;

        case LEFT:
            return RIGHT;
            break;

        case RIGHT:
            return LEFT;
            break;

        default:
            return -1;//err
    }
}

function getRowIndex(yCord) {
    if (yCord === undefined) {
        return -1;//err
    }
    return parseInt(yCord / GRID_HEIGHT);
}

function getColIndex(xCord) {
    if (xCord === undefined) {
        return -1;//err
    }
    return parseInt(xCord / GRID_WIDTH);
}

function fixGrids(x, y) {
    let row = getRowIndex(y);
    let col = getColIndex(x);

    if (xOnGridCenter(y)) {
        maze[row][col].draw();
        if (col + 1 < maze.length && !staticArrayContains([row, col + 1])) {
            maze[row][col + 1].draw();
        }
        if (col - 1 >= 0 && !staticArrayContains([row, col - 1])) {
            maze[row][col - 1].draw();
        }
    } else if (yOnGridCenter(x)) {
        maze[row][col].draw();
        if (row + 1 < maze.length && !staticArrayContains([row + 1, col])) {
            maze[row + 1][col].draw();
        }
        if (row - 1 >= 0 && !staticArrayContains([row - 1, col])) {
            maze[row - 1][col].draw();
        }
    }
}

function staticArrayContains(cord) {
    let x = cord[0];
    let y = cord[1];
    for (let i = 0; i < staticGrids.length; i++) {
        if (x === staticGrids[i][0] &&
            y === staticGrids[i][1]) {
            return true;
        }
    }
    return false;
}

function onGridCenter(x, y) {
    return xOnGridCenter(y) && yOnGridCenter(x);
}

function xOnGridCenter(y) {
    return ((y - GRID_WIDTH / 2) % GRID_WIDTH) === 0;
}

function yOnGridCenter(x) {
    return ((x - GRID_HEIGHT / 2) % GRID_HEIGHT) === 0;
}

//see if sprite can move one more step at the given (x,y) facing the given direction
function canMove(x, y, dir) {
    if (!onGridCenter(x, y)) {
        return true;
    }
    let canMove = false;
    let currGrid = maze[getRowIndex(y)][getColIndex(x)];
    let gridType = currGrid.gridType;
    switch (dir) {
        case UP:
            if (gridType != LEFT_TOP && gridType != RIGHT_TOP && gridType != TOP_BOTTOM
                && gridType != TOP_ONLY && gridType != LEFT_TOP_RIGHT
                && gridType != TOP_RIGHT_BOTTOM && gridType != BOTTOM_LEFT_TOP) {
                canMove = true;
            }
            break;

        case DOWN:
            if (gridType != LEFT_BOTTOM && gridType != TOP_BOTTOM && gridType != RIGHT_BOTTOM
                && gridType != BOTTOM_ONLY && gridType != RIGHT_BOTTOM_LEFT
                && gridType != BOTTOM_LEFT_TOP && gridType != TOP_RIGHT_BOTTOM) {
                canMove = true;
            }
            break;

        case LEFT:
            if (gridType != LEFT_BOTTOM && gridType != LEFT_TOP && gridType != LEFT_ONLY
                && gridType != LEFT_RIGHT && gridType != LEFT_TOP_RIGHT
                && gridType != BOTTOM_LEFT_TOP && gridType != RIGHT_BOTTOM_LEFT) {
                canMove = true;
            }
            break;

        case RIGHT:
            if (gridType != RIGHT_BOTTOM && gridType != RIGHT_TOP && gridType != RIGHT_ONLY
                && gridType != LEFT_RIGHT && gridType != RIGHT_BOTTOM_LEFT
                && gridType != TOP_RIGHT_BOTTOM && gridType != LEFT_TOP_RIGHT) {
                canMove = true;
            }
            break;
        default:
            break;


    }
    return canMove;
}

//show welcome screen
function welcomeScreen() {

    gameOn = false;
    gamePaused = false;
    ctx.fillStyle = "white";
    ctx.font = "80px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PACMAN", CANVAS_WIDTH / 2, 170);
    ctx.font = "20px monospace";
    ctx.fillText("Press s to start", CANVAS_WIDTH / 2, 220);

}

//update canvas for each frame.
function updateCanvas() {
    restartTimer++;


    eatBean();
    mrPacman.move();

    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].move();
    }

    fixGrids(mrPacman.x, mrPacman.y);
    for (let i = 0; i < ghosts.length; i++) {
        fixGrids(ghosts[i].x, ghosts[i].y);
    }

    mrPacman.draw();
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }

}

//try to eat a bean
function eatBean() {
    if (onGridCenter(mrPacman.x, mrPacman.y)) {
        if (maze[mrPacman.getRow()][mrPacman.getCol()].beanType === NORMAL_BEAN) {
            score += parseInt(10);
            // showScore();
            beansLeft--;
        }
        maze[mrPacman.getRow()][mrPacman.getCol()].beanType = undefined;
        maze[mrPacman.getRow()][mrPacman.getCol()].draw();
    }
}


//Show a count down each time the game starts
function countDown() {
    setTimeout(function () {
        intervalId = setInterval(updateCanvas, timerDelay);
    }, 1000)
}

/*==================END UI Update Methods================*/


/*==================Game Control Methods===================*/

//listen to keyDown event
function onKeyDown(event) {
    let keycode = event.keyCode;
    let pauseCode = 81; //q to pause
    let continueCode = 69; //e to resume
    let restartCode = 82; //r to restart
    let godModeCode = 71; //g to enter god mode

    // wasd
    let wCode = 87;
    let aCode = 65;
    let sCode = 83;
    let dCode = 68;
    //arrow keys
    let leftCode = 37;
    let upCode = 38;
    let rightCode = 39;
    let downCode = 40;

    //start game
    if (!gameOn) {
        if (keycode === sCode) {
            clearInterval(intervalId);
            gameOn = true;
            gamePaused = false;
            initMaze();
            run();
            return;
        } else if (keycode === godModeCode) {
            clearInterval(intervalId);
            ghosts = [];
            gameOn = true;
            gamePaused = false;
            initMaze();
            run(true);
            return;
        }
    } else {

        //pause game
        if (keycode === pauseCode && !gamePaused) {
            clearInterval(intervalId);
            gamePaused = true;
            return;
        }

        //resume game
        if (keycode === continueCode && gamePaused) {
            intervalId = setInterval(updateCanvas, timerDelay);
            gamePaused = false;
            return;
        }

        //restart game
        if (keycode === restartCode && restartTimer > 0) {
            //can't restart game if a game was just refreshed.
            restartTimer = 0;
            clearInterval(intervalId);
            gameOn = true;
            gamePaused = false;
            score = 0;
            life = MAX_LIFE;
            beansLeft = MAX_BEANS;
            initMaze();
            run();
        }

        //4-way controls
        switch (keycode) {
            case upCode:
            case wCode:
                mrPacman.nextDir = mrPacman.dir === UP ? undefined : UP;
                break;

            case rightCode:
            case dCode:
                mrPacman.nextDir = mrPacman.dir === RIGHT ? undefined : RIGHT;
                break;

            case leftCode:
            case aCode:
                mrPacman.nextDir = mrPacman.dir === LEFT ? undefined : LEFT;
                break;

            case downCode:
            case sCode:
                mrPacman.nextDir = mrPacman.dir === DOWN ? undefined : DOWN;
                break;

            default:
                break;

        }
    }
}

//run the game. Create mrPacman and 4 ghosts. Reset their positions.
function run(isGodMode) {
    // showScore();

    mrPacman = new Pacman(pacmanStartLoc[1] * GRID_WIDTH + GRID_WIDTH / 2, pacmanStartLoc[0] * GRID_HEIGHT + GRID_HEIGHT / 2, RIGHT);
    if (isGodMode === undefined || !isGodMode) {
        ghost1 = new Ghost(0, 0, RED, DOWN, 1);
        ghost1.setInStartPosition();
        ghosts = [ghost1];

        ghost1.draw();
        ghost1.move()

    } else {
        ghosts = [];
    }
    mrPacman.draw();
    countDown();
}

initFields();
initCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
canvas.addEventListener('keydown', onKeyDown, false);
canvas.setAttribute('tabindex', '0');
canvas.focus();
welcomeScreen();


