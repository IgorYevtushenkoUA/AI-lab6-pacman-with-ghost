export let canvasID = "myCanvas",
    CANVAS_WIDTH = document.getElementById("myCanvas").width,
    CANVAS_HEIGHT = document.getElementById("myCanvas").height,
    canvas = document.getElementById(canvasID),
    ctx = canvas.getContext("2d"),

    GRID_WIDTH = 20,
    GRID_HEIGHT = 20,
    WALL_WIDTH = 2,
    numRows = CANVAS_WIDTH / GRID_HEIGHT,
    numCols = CANVAS_HEIGHT / GRID_WIDTH,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
    // game parameters
    intervalId,
    restartTimer = 0,
    timerDelay = 80,
    score = 0,
    MAX_LIFE = 3,
    life = MAX_LIFE,
    MAX_BEANS = 136,
    beansLeft = MAX_BEANS,

    NORMAL_BEAN = 1,
    mrPacman,

    //game state and map
    gameOn = false,
    gamePaused = false,
    maze = new Array(CANVAS_HEIGHT / GRID_HEIGHT),
    mazeContent = [
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
    ],
    staticGrids = [],
    staticGridsIndex = 0,
    pacmanStartLoc = [14, 35],
    // [ [x1,x2,y1,y2] [....] ]
    /*
    x1y1..........x2
    ................
    ................
    ..............y2
     */
    noBeans = [
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

    ],
    noBean = [pacmanStartLoc],
    noBeanIndex = noBean.length,


    CROSS_RD = -1,//no wall
    LEFT_ONLY = 0,
    TOP_ONLY = 1,
    RIGHT_ONLY = 2,
    BOTTOM_ONLY = 3,

    LEFT_RIGHT = 4,
    LEFT_TOP = 5,
    LEFT_BOTTOM = 6,

    RIGHT_TOP = 7,
    RIGHT_BOTTOM = 8,
    TOP_BOTTOM = 9,

    BOTTOM_LEFT_TOP = 10,
    LEFT_TOP_RIGHT = 11,
    TOP_RIGHT_BOTTOM = 12,
    RIGHT_BOTTOM_LEFT = 13,

    EMPTY_GRID = 14,
    CLOSED_GRID = 15,


    NORMAL_BEAN_RADIUS = 2,
    PACMAN_RADIUS = 5,
    GHOST_RADIUS = 5,
    BEAN_COLOR = "white",
    BORDER_COLOR = "blue"




