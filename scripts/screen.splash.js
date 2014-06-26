tool.screens["splash-screen"] = (function() {
    var firstRun = true;

    function setup() {
        tool.dom.bind("#splash-screen", "click", function() {
            tool.showScreen("main-menu");
        });
    }

    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }

    return {
        run: run
    }
})();
