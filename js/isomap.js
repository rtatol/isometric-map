IsoMap = (function() {

    /**
     * @desc constructor
     * @param object $params - initial parameters
     */
    function IsoMap(params) {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');

        // tiles color
        this.color = '#15B89A';

        // canvas area details
        this.screen = { 
            width: params.screen.width,
            height: params.screen.height
         };

        // size of isometric map
        this.map = {
            width: params.map.width,
            height: params.map.height
        };

        // size of single tile
        this.tile = {
            width: params.tile.width,
            height: params.tile.height
        }

        // initial position of isometric map
        this.position = {
            x: this.screen.width / 2,
            y: this.tile.height
        }
    }

    /**
     * @desc draw isometric map
     */
    IsoMap.prototype.create = function() {
        // set canvas size
        this.canvas.setAttribute('width', this.screen.width);
        this.canvas.setAttribute('height', this.screen.height);

        // tiles drawing loops
        for (i = 0; i < this.map.width; i++) {
            for (j = 0; j < this.map.height; j++) {
                // calculate coordinates
                var x = (i-j) * this.tile.width / 2 + this.position.x;
                var y = (i+j) * this.tile.height / 2 + this.position.y;
                // draw single tile
                this.drawTile(x, y);
            }
        }

        // add event listeners
        this.addListeners();
    };

    /**
     * @desc draw single tile
     * @param int $x - position x on canvas area
     * @param int $y - position y on canvas area
     */
    IsoMap.prototype.drawTile = function(x, y) {
        var tileWidth = this.tile.width;
        var tileHeight = this.tile.height;

        // begin
        this.context.beginPath();

        // move to start point
        this.context.moveTo(x - tileWidth / 2, y);

        /**
         * create four lines
         * --------------------------------------------
         *    step 1  |  step 2  |  step 3  |  step 4
         * --------------------------------------------
         *    /       |  /       |  /       |  /\  
         *            |  \       |  \/      |  \/
         * --------------------------------------------
         */
        this.context.lineTo(x - tileWidth, y + tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2, y + tileHeight);
        this.context.lineTo(x, y + tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2,  y);

        // draw path
        this.context.stroke();

        // fill tile
        this.context.fillStyle = this.color;
        this.context.fill();   
    }

    /**
     * @desc draw single shape - prism
     * @param object $isometricPosition - position on map { x: value, y: value }
     */
    IsoMap.prototype.drawPrism = function(isometricPosition) {
        var screenPosition = this.convertIsometricToScreen(isometricPosition.x, isometricPosition.y);
        var x = screenPosition.x;
        var y = screenPosition.y;
        var tileWidth = this.tile.width;
        var tileHeight = this.tile.height;

        // top
        this.context.beginPath();

        this.context.moveTo(x - tileWidth / 2, y - tileHeight);
        this.context.lineTo(x - tileWidth, y - tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2, y);
        this.context.lineTo(x, y - tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2,  y - tileHeight);

        this.context.fillStyle = '#555555';
        this.context.fill();

        // left
        this.context.beginPath();

        this.context.moveTo(x - tileWidth, y - tileHeight / 2);
        this.context.lineTo(x - tileWidth, y + tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2, y + tileHeight);
        this.context.lineTo(x - tileWidth / 2, y);
        this.context.lineTo(x - tileWidth, y - tileHeight / 2);

        this.context.fillStyle = '#444444';
        this.context.fill();

        // right
        this.context.beginPath();

        this.context.moveTo(x - tileWidth / 2, y);
        this.context.lineTo(x, y - tileHeight / 2);
        this.context.lineTo(x, y + tileHeight / 2);
        this.context.lineTo(x - tileWidth / 2, y + tileHeight);
        this.context.lineTo(x - tileWidth / 2, y);

        this.context.fillStyle = '#777777';
        this.context.fill();
    }

    /**
     * @desc init map listeners
     */
    IsoMap.prototype.addListeners = function() {
        var self = this;

        this.canvas.addEventListener('mousedown', function onMouseDown(event) {
            var mousePosition = getMousePosition(event);
            var isometricPosition = self.convertScreenToIsometric(mousePosition.x, mousePosition.y);

            if (isOnMap(isometricPosition, self.map)) {
                self.drawPrism(isometricPosition);
            }
        }, false);

    }

    IsoMap.prototype.convertScreenToIsometric = function(x, y) {
        x = (x - this.position.x) / this.tile.width;
        y = (y - this.position.y) / this.tile.height;

        var isoX = Math.floor(y + x) 
        var isoY = Math.floor(y - x) 

       return { x: isoX, y: isoY };
    };

    IsoMap.prototype.convertIsometricToScreen = function(x, y) {
        var screenX = ( (x-y) * this.tile.width / 2 ) + this.position.x;
        var screenY = ( (x+y) * this.tile.height / 2 ) + this.position.y;

        return { x: screenX, y: screenY};
    };

    function getMousePosition(event) {
        var canvas = event.target;
        var rect = canvas.getBoundingClientRect();

        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    };

    function isOnMap(position, map) {
        if (position.x >= 0 && position.x < map.width 
            && position.y >= 0 && position.y < map.height) {
                return true;
        } else {
            return false;
        }
    };

    return IsoMap;
})();