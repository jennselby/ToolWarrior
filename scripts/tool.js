// namespace object
var tool = (function() {

    var scriptQueue = [];
    var numResourcesLoaded = 0;
    var numResources = 0;
    var executeRunning = false;

    function executeScriptQueue() {
        var next = scriptQueue[0];
        var first, script;
        // if the script is loaded, add it into the DOM, before
        // the first script tag
        if (next && next.loaded) {
            executeRunning = true;
            scriptQueue.shift();
            first = document.getElementsByTagName("script")[0];
            script = document.createElement("script");
            script.onload = function() {
                if (next.callback) {
                    next.callback();
                }
                // try to execute more scripts
                executeScriptQueue();
            };
            script.src = next.src;
            first.parentNode.insertBefore(script, first);
        }
        else {
            executeRunning = false;
        }
    }

    // ensures that scripts are loaded in order
    function load(src, callback) {
        var image, queueEntry;
        numResources++;

        queueEntry = {
            src: src,
            callback: callback,
            loaded: false
        };
        scriptQueue.push(queueEntry);

        image = new Image();
        // Since the JavaScript sources isn't actually an image, it should 
        // trigger an error, loading the file but not actuall executing it.
        // This may produce MIME type errors in the console.
        image.onload = image.onerror = function() {
            numResourcesLoaded++;
            queueEntry.loaded = true;
            if (!executeRunning) {
                executeScriptQueue();
            }
        };
        image.src = src;

    }

    function setup() {
        tool.showScreen("splash-screen");
    }

    // hide the active screen (if any) and show the screen
    // with the specified ide
    function showScreen(screenId) {
        var dom = tool.dom;
        var $ = dom.$;

        var activeScreen = $("#game .screen.active")[0];
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }

        var screen = $("#" + screenId)[0];
        dom.addClass(screen, "active");
    }

    // expose public methods
    return {
        load: load,
        setup: setup,
        showScreen: showScreen
    };

})();
