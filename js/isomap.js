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

        // initial position of isometric map
        this.position = {
            x: this.screen.width / 2,
            y: 0
        }

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
                var y = (i+j) * this.tile.height / 2;
                // draw single tile
                this.drawTile(x, y);
            }
        }
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

    return IsoMap;
})();