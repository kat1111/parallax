// Get reference to Canvas
var canvas = document.getElementById('canvas');

// Get reference to Canvas Context
var context = canvas.getContext('2d');

// Get refence to loading screen
var loading_screen = document.getElementById('loading');

// Initialize loading variables
var loaded = false
var load_counter = 0;

// Initialize images for layers

var background = new Image(); 
var fish_1_1 = new Image(); 
var fish_1_2 = new Image();
var girl = new Image(); 
var fish_2_1 = new Image(); 
var fish_2_2 = new Image();
var shadow = new Image();
var mask = new Image();
var fish_3 = new Image();



// Create a list of layer objects
// Each object contains the following:
// image: a reference to the image created above
// src: the path to the actual image in your project
// z_index: how close the object should appear in 3d space (0 is neutral)
// position: a place to keep track of the layer's current position
// blend: what blend mode you'd like the layer to use—default is null
// opacity: how transparent you'd like the layer to appear (0 is completely transparent, 1 is completely opaque)
var layer_list = [
    {
        'image': background,
        'src': './img/20200324215002.png',
        'z_index': -3.55,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': fish_1_1,
        'src': './img/20200325110439.png',
        'z_index': -3,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': fish_1_2,
        'src': './img/20200325110412.png',
        'z_index': -2.75,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': girl,
        'src': './img/20200324215326.png',
        'z_index': -2,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': fish_2_1,
        'src': './img/20200325110431.png',
        'z_index': -1.75,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': fish_2_2,
        'src': './img/20200325110419.png',
        'z_index': -0.5,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': shadow,
        'src': './img/20200324215516.png',
        'z_index': -0.5,
        'position': {x: 0, y: 0},
        'blend': 'overlay',
        'opacity': 0.75
    },
    {
        'image': mask,
        'src': './img/20200324215532.png',
        'z_index': 0,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': fish_3,
        'src': './img/20200324215542.png',
        'z_index': 1.9,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    }
];


// Go through the list of layer objects and load images from source
layer_list.forEach(function(layer, index) {
    layer.image.onload = function() {
        // Add 1 to the load counter
        load_counter += 1;
        // Checks if all the images are loaded
        if (load_counter >= layer_list.length) {
        // Hide loading screen
         hideLoading();
            // Start the render Loop!
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
});


function  hideLoading() {
          loading_screen.classList.add('hidden');
}

// Draw layers in Canvas
function drawCanvas() {        
    // Erase everything currently on the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // This is needed for the animation to snap back to center when you release mouse or touch
    TWEEN.update();





// Calculate how much the canvas should be rotated
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

// Actually rotate the canvas
    canvas.style.transform = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";



    // Loop through each layer in the list and draw it to the canvas
    layer_list.forEach(function(layer, index) {

    layer.position = getOffset(layer)
        
        // If the layer has a blend mode set, use that blend mode, otherwise use normal
        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        
        // Set the opacity of the layer
        context.globalAlpha = layer.opacity;
        
        // Draw the layer into the canvas context
        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    
    // Loop this function! requestAnimationFrame is a special built in function that can draw to the canvas at 60 frames per second
    // NOTE: do not call drawCanvas() without using requestAnimationFrame here—things will crash!
    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    

    // You can play with the touch_multiplier variable here. Depending on the size of your canvas you may want to turn it up or down.
    var touch_multiplier = 0.3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
    
    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;



    // Calculate the total offset for both X and Y
    // Total offset is a combination of touch and motion
    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
};

    // Return the calculated offset to whatever requested it.
    return offset;



}






//// TOUCH AND MOUSE CONTROLS ////

// Initialize variables for touch and mouse-based parallax

// This is a variable we're using to only move things when you're touching the screen or holding the mouse button down.
var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
    x: 0,
    y: 0
};
var pointer = {
    x: 0,
    y: 0
};

// This one listens for when you start touching the canvas element
canvas.addEventListener('touchstart', pointerStart);
// This one listens for when you start clicking on the canvas (when you press the mouse button down)
canvas.addEventListener('mousedown', pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
    // Ok, you touched the screen or clicked, now things can move until you stop doing that
    moving = true;
    

    // Check if this is a touch event
    if (event.type === 'touchstart') {
        // set initial touch position to the coordinates where you first touched the screen
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    // Check if this is a mouse click event
    } else if (event.type === 'mousedown') {
        // set initial mouse position to the coordinates where you first clicked
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }

}





// This runs whenever your finger moves anywhere in the browser window
window.addEventListener('mousemove', pointerMove);
// This runs whenever your mouse moves anywhere in the browser window
window.addEventListener('touchmove', pointerMove);

// Runs when touch or mouse is moved
function pointerMove(event) {
    // This is important to prevent scrolling the page instead of moving layers around
    event.preventDefault();
    // Only run this if touch or mouse click has started
    if (moving === true) {
        var current_x = 0;
        var current_y = 0;
        // Check if this is a touch event
        if (event.type === 'touchmove') {
            // Current position of touch
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        // Check if this is a mouse event
        } else if (event.type === 'mousemove') {
            // Current position of mouse cursor
            current_x = event.clientX;
            current_y = event.clientY;
        }
        // Set pointer position to the difference between current position and initial position
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y; 
    }
};

// Listen to any time you move your finger in the canvas element
canvas.addEventListener('touchmove', function(event) {
    // Don't scroll the screen
    event.preventDefault();
});

// Listen for when you release the mouse button anywhere on the screen
window.addEventListener('mouseup', function(event) {
    // Run the endGesture function (below)
    endGesture();


});
// Listen to any time you move your mouse in the canvas element
canvas.addEventListener('mousemove', function(event) {
    // Don't do whatever would normally happen when you click and drag
    event.preventDefault();
});

// Listen for when you stop touching the screen
window.addEventListener('touchend', function(event) {
    // Run the endGesture function (below)
    endGesture();
});
// Listen for when you release the mouse button anywhere on the screen
window.addEventListener('mouseup', function(event) {
    // Run the endGesture function (below)
    endGesture();
});







function endGesture() {
    // You aren't touching or clicking anymore, so set this back to false
    moving = false;
    
    // This starts the animation to reset the position of all layers when you stop moving them
    var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();    
}



//// MOTION CONTROLS ////

// Initialize variables for motion-based parallax
var motion_initial = {
    x: null,
    y: null
};
var motion = {
    x: 0,
    y: 0
};

// This is where we listen to the gyroscope position
window.addEventListener('deviceorientation', function(event) {
    // If this is the first run through here, set the initial position of the gyroscope
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }
    
    // Depending on what orientation the device is in, you need to adjust what each gyroscope axis means
    // This can be a bit tricky
    if (window.orientation === 0) {
        // The device is right-side up in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
        // The device is in landscape laying on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        // The device is in landscape laying on its right side
        motion.x = -event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    } else {
        // The device is upside-down in portrait orientation
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});


// Reset the position of motion controls when device changes between portrait and landscape, etc.
window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;

});


window.addEventListener('touchend', function() {
    enableMotion();    
});

function enableMotion() {
    if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission();
    }
}







/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */


var _Group = function () {
    this._tweens = {};
    this._tweensAddedDuringUpdate = {};
};

_Group.prototype = {
    getAll: function () {

        return Object.keys(this._tweens).map(function (tweenId) {
            return this._tweens[tweenId];
        }.bind(this));

    },

    removeAll: function () {

        this._tweens = {};

    },

    add: function (tween) {

        this._tweens[tween.getId()] = tween;
        this._tweensAddedDuringUpdate[tween.getId()] = tween;

    },

    remove: function (tween) {

        delete this._tweens[tween.getId()];
        delete this._tweensAddedDuringUpdate[tween.getId()];

    },

    update: function (time, preserve) {

        var tweenIds = Object.keys(this._tweens);

        if (tweenIds.length === 0) {
            return false;
        }

        time = time !== undefined ? time : TWEEN.now();

        // Tweens are updated in "batches". If you add a new tween during an update, then the
        // new tween will be updated in the next batch.
        // If you remove a tween during an update, it may or may not be updated. However,
        // if the removed tween was added during the current batch, then it will not be updated.
        while (tweenIds.length > 0) {
            this._tweensAddedDuringUpdate = {};

            for (var i = 0; i < tweenIds.length; i++) {

                var tween = this._tweens[tweenIds[i]];

                if (tween && tween.update(time) === false) {
                    tween._isPlaying = false;

                    if (!preserve) {
                        delete this._tweens[tweenIds[i]];
                    }
                }
            }

            tweenIds = Object.keys(this._tweensAddedDuringUpdate);
        }

        return true;

    }
};

var TWEEN = new _Group();

TWEEN.Group = _Group;
TWEEN._nextId = 0;
TWEEN.nextId = function () {
    return TWEEN._nextId++;
};


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
    TWEEN.now = function () {
        var time = process.hrtime();

        // Convert [seconds, nanoseconds] to milliseconds.
        return time[0] * 1000 + time[1] / 1000000;
    };
}
// In a browser, use self.performance.now if it is available.
else if (typeof (self) !== 'undefined' &&
         self.performance !== undefined &&
         self.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    TWEEN.now = self.performance.now.bind(self.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
    TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
    TWEEN.now = function () {
        return new Date().getTime();
    };
}


TWEEN.Tween = function (object, group) {
    this._object = object;
    this._valuesStart = {};
    this._valuesEnd = {};
    this._valuesStartRepeat = {};
    this._duration = 1000;
    this._repeat = 0;
    this._repeatDelayTime = undefined;
    this._yoyo = false;
    this._isPlaying = false;
    this._reversed = false;
    this._delayTime = 0;
    this._startTime = null;
    this._easingFunction = TWEEN.Easing.Linear.None;
    this._interpolationFunction = TWEEN.Interpolation.Linear;
    this._chainedTweens = [];
    this._onStartCallback = null;
    this._onStartCallbackFired = false;
    this._onUpdateCallback = null;
    this._onCompleteCallback = null;
    this._onStopCallback = null;
    this._group = group || TWEEN;
    this._id = TWEEN.nextId();

};

TWEEN.Tween.prototype = {
    getId: function getId() {
        return this._id;
    },

    isPlaying: function isPlaying() {
        return this._isPlaying;
    },

    to: function to(properties, duration) {

        this._valuesEnd = properties;

        if (duration !== undefined) {
            this._duration = duration;
        }

        return this;

    },

    start: function start(time) {

        this._group.add(this);

        this._isPlaying = true;

        this._onStartCallbackFired = false;

        this._startTime = time !== undefined ? typeof time === 'string' ? TWEEN.now() + parseFloat(time) : time : TWEEN.now();
        this._startTime += this._delayTime;

        for (var property in this._valuesEnd) {

            // Check if an Array was provided as property value
            if (this._valuesEnd[property] instanceof Array) {

                if (this._valuesEnd[property].length === 0) {
                    continue;
                }

                // Create a local copy of the Array with the start value at the front
                this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

            }

            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if (this._object[property] === undefined) {
                continue;
            }

            // Save the starting value.
            this._valuesStart[property] = this._object[property];

            if ((this._valuesStart[property] instanceof Array) === false) {
                this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

        }

        return this;

    },

    stop: function stop() {

        if (!this._isPlaying) {
            return this;
        }

        this._group.remove(this);
        this._isPlaying = false;

        if (this._onStopCallback !== null) {
            this._onStopCallback(this._object);
        }

        this.stopChainedTweens();
        return this;

    },

    end: function end() {

        this.update(this._startTime + this._duration);
        return this;

    },

    stopChainedTweens: function stopChainedTweens() {

        for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].stop();
        }

    },

    group: function group(group) {
        this._group = group;
        return this;
    },

    delay: function delay(amount) {

        this._delayTime = amount;
        return this;

    },

    repeat: function repeat(times) {

        this._repeat = times;
        return this;

    },

    repeatDelay: function repeatDelay(amount) {

        this._repeatDelayTime = amount;
        return this;

    },

    yoyo: function yoyo(yy) {

        this._yoyo = yy;
        return this;

    },

    easing: function easing(eas) {

        this._easingFunction = eas;
        return this;

    },

    interpolation: function interpolation(inter) {

        this._interpolationFunction = inter;
        return this;

    },

    chain: function chain() {

        this._chainedTweens = arguments;
        return this;

    },

    onStart: function onStart(callback) {

        this._onStartCallback = callback;
        return this;

    },

    onUpdate: function onUpdate(callback) {

        this._onUpdateCallback = callback;
        return this;

    },

    onComplete: function onComplete(callback) {

        this._onCompleteCallback = callback;
        return this;

    },

    onStop: function onStop(callback) {

        this._onStopCallback = callback;
        return this;

    },

    update: function update(time) {

        var property;
        var elapsed;
        var value;

        if (time < this._startTime) {
            return true;
        }

        if (this._onStartCallbackFired === false) {

            if (this._onStartCallback !== null) {
                this._onStartCallback(this._object);
            }

            this._onStartCallbackFired = true;
        }

        elapsed = (time - this._startTime) / this._duration;
        elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

        value = this._easingFunction(elapsed);

        for (property in this._valuesEnd) {

            // Don't update properties that do not exist in the source object
            if (this._valuesStart[property] === undefined) {
                continue;
            }

            var start = this._valuesStart[property] || 0;
            var end = this._valuesEnd[property];

            if (end instanceof Array) {

                this._object[property] = this._interpolationFunction(end, value);

            } else {

                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof (end) === 'string') {

                    if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                        end = start + parseFloat(end);
                    } else {
                        end = parseFloat(end);
                    }
                }

                // Protect against non numeric properties.
                if (typeof (end) === 'number') {
                    this._object[property] = start + (end - start) * value;
                }

            }

        }

        if (this._onUpdateCallback !== null) {
            this._onUpdateCallback(this._object);
        }

        if (elapsed === 1) {

            if (this._repeat > 0) {

                if (isFinite(this._repeat)) {
                    this._repeat--;
                }

                // Reassign starting values, restart by making startTime = now
                for (property in this._valuesStartRepeat) {

                    if (typeof (this._valuesEnd[property]) === 'string') {
                        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
                    }

                    if (this._yoyo) {
                        var tmp = this._valuesStartRepeat[property];

                        this._valuesStartRepeat[property] = this._valuesEnd[property];
                        this._valuesEnd[property] = tmp;
                    }

                    this._valuesStart[property] = this._valuesStartRepeat[property];

                }

                if (this._yoyo) {
                    this._reversed = !this._reversed;
                }

                if (this._repeatDelayTime !== undefined) {
                    this._startTime = time + this._repeatDelayTime;
                } else {
                    this._startTime = time + this._delayTime;
                }

                return true;

            } else {

                if (this._onCompleteCallback !== null) {

                    this._onCompleteCallback(this._object);
                }

                for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    this._chainedTweens[i].start(this._startTime + this._duration);
                }

                return false;

            }

        }

        return true;

    }
};


TWEEN.Easing = {

    Linear: {

        None: function (k) {

            return k;

        }

    },

    Quadratic: {

        In: function (k) {

            return k * k;

        },

        Out: function (k) {

            return k * (2 - k);

        },

        InOut: function (k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }

            return - 0.5 * (--k * (k - 2) - 1);

        }

    },

    Cubic: {

        In: function (k) {

            return k * k * k;

        },

        Out: function (k) {

            return --k * k * k + 1;

        },

        InOut: function (k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }

            return 0.5 * ((k -= 2) * k * k + 2);

        }

    },

    Quartic: {

        In: function (k) {

            return k * k * k * k;

        },

        Out: function (k) {

            return 1 - (--k * k * k * k);

        },

        InOut: function (k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }

            return - 0.5 * ((k -= 2) * k * k * k - 2);

        }

    },

    Quintic: {

        In: function (k) {

            return k * k * k * k * k;

        },

        Out: function (k) {

            return --k * k * k * k * k + 1;

        },

        InOut: function (k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }

            return 0.5 * ((k -= 2) * k * k * k * k + 2);

        }

    },

    Sinusoidal: {

        In: function (k) {

            return 1 - Math.cos(k * Math.PI / 2);

        },

        Out: function (k) {

            return Math.sin(k * Math.PI / 2);

        },

        InOut: function (k) {

            return 0.5 * (1 - Math.cos(Math.PI * k));

        }

    },

    Exponential: {

        In: function (k) {

            return k === 0 ? 0 : Math.pow(1024, k - 1);

        },

        Out: function (k) {

            return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

        },

        InOut: function (k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }

            return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

        }

    },

    Circular: {

        In: function (k) {

            return 1 - Math.sqrt(1 - k * k);

        },

        Out: function (k) {

            return Math.sqrt(1 - (--k * k));

        },

        InOut: function (k) {

            if ((k *= 2) < 1) {
                return - 0.5 * (Math.sqrt(1 - k * k) - 1);
            }

            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

        }

    },

    Elastic: {

        In: function (k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

        },

        Out: function (k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

        },

        InOut: function (k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            k *= 2;

            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }

            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

        }

    },

    Back: {

        In: function (k) {

            var s = 1.70158;

            return k * k * ((s + 1) * k - s);

        },

        Out: function (k) {

            var s = 1.70158;

            return --k * k * ((s + 1) * k + s) + 1;

        },

        InOut: function (k) {

            var s = 1.70158 * 1.525;

            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }

            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

        }

    },

    Bounce: {

        In: function (k) {

            return 1 - TWEEN.Easing.Bounce.Out(1 - k);

        },

        Out: function (k) {

            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }

        },

        InOut: function (k) {

            if (k < 0.5) {
                return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
            }

            return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

        }

    }

};

TWEEN.Interpolation = {

    Linear: function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.Linear;

        if (k < 0) {
            return fn(v[0], v[1], f);
        }

        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }

        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

    },

    Bezier: function (v, k) {

        var b = 0;
        var n = v.length - 1;
        var pw = Math.pow;
        var bn = TWEEN.Interpolation.Utils.Bernstein;

        for (var i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }

        return b;

    },

    CatmullRom: function (v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {

            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }

            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

        } else {

            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

        }

    },

    Utils: {

        Linear: function (p0, p1, t) {

            return (p1 - p0) * t + p0;

        },

        Bernstein: function (n, i) {

            var fc = TWEEN.Interpolation.Utils.Factorial;

            return fc(n) / fc(i) / fc(n - i);

        },

        Factorial: (function () {

            var a = [1];

            return function (n) {

                var s = 1;

                if (a[n]) {
                    return a[n];
                }

                for (var i = n; i > 1; i--) {
                    s *= i;
                }

                a[n] = s;
                return s;

            };

        })(),

        CatmullRom: function (p0, p1, p2, p3, t) {

            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

        }

    }

};

// UMD (Universal Module Definition)
(function (root) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define([], function () {
            return TWEEN;
        });

    } else if (typeof module !== 'undefined' && typeof exports === 'object') {

        // Node.js
        module.exports = TWEEN;

    } else if (root !== undefined) {

        // Global variable
        root.TWEEN = TWEEN;

    }

})(this);


