/**
 * Include this file so you can work on CBKit itself without having to rebuild
 * it or have it watch your files, for example, if you don't have node.js.
 */
(function (window, document) {

    var totalLineCount = 0;
    var files = [];

    function between(x, min, max) {
        return x >= min && x <= max;
    }

    function injectDebugScript(source) {
        var header = "data:text/javascript;charset=utf-8,";
        var src = header + source;
        var scriptElement = document.createElement("script");

        scriptElement.type = "text/javascript";//"text/x-javascript-debug";
        scriptElement.text = source;
        //scriptElement.src = src;

        var headElement = document.getElementsByTagName("head")[0];
        
        headElement && headElement.appendChild(scriptElement);

        return src;
    }

    function CBImport(filePath) {
        var pathname = window.location.pathname;
        var currentPath = CBImport.currentPath || location.origin + pathname.substring(0, pathname.lastIndexOf('/')) + "/";
        var fullPath = currentPath + filePath;

        if (CBImport[fullPath]) {
            return '';
        }

        // @TODO add support for stupid IE...
        var request = new XMLHttpRequest();

        request.open("GET", fullPath, false);   
        request.send(null);  

        // Check for 200 status for HTTP, but also catch if responseText
        // contains anything for local file:// access that return zero status
        if (request.status !== 200 && !request.responseText) {  
           throw new Error("Importing file failed: " + filePath + " with status code: " + request.status);
        }

        //totalLineCount;

        var sourceCode = request.responseText;

        var lineCount = sourceCode.match(/(\r\n|\n|\r)/gm).length + 1;
        var startLineNumber = totalLineCount;
        totalLineCount += lineCount;

        files.push({
            path: filePath,
            lines: lineCount,
            start: startLineNumber,
            end: totalLineCount
        });

        var oldPath = CBImport.currentPath;
        CBImport.currentPath = fullPath.split("/").slice(0, -1).join("/") + "/";

        var exp = /.*CBImport\s*\(\s*['|"]([a-zA-Z0-9_\.\-\/]*)['|"]\s*\)\s*;?/g;

        var preprocessedCode = sourceCode.replace(exp, function (match, filePath) {
            if ( !match.match(/\s*\/\//) ) {
                return CBImport(filePath);
            }
            
            return match;
        });

        CBImport.currentPath = oldPath;

        CBImport[fullPath] = true;

        return preprocessedCode;
    }

    function shimError(msg, lineNumber) {
        console.log(totalLineCount, lineNumber);
        var file;

        for (var i = 0, l = files.length; i < l; i++) {
            file = files[i];

            if ( between(lineNumber, file.start, file.end) ) {
                console.log(file.path, lineNumber-file.start, file.start, file.lines);
                break;
            }
        }

        var err = TypeError(msg);
        console.log('adsf', err, err.stack);

        err.sourceURL = "file:///Users/jayphelps/Projects/cowbell/src/" + file.path;
        err.fileName = "http://localhost/test/todos/" + file.path;
        err.lineNumber = 346;
        err.line = 346;
        err.column = 10;

        throw err;

        //throw Error("ADSF");
    }

    function CBLoadApplication(filePath) {
        var pathname = window.location.pathname;
        var currentPath = CBImport.currentPath || location.origin + pathname.substring(0, pathname.lastIndexOf('/')) + "/";
        var fullPath = currentPath + filePath;

        fucker = fullPath;

        var preprocessedCode = CBImport(filePath);

        // We inject a script tag with a bogus type so we can reference the
        // correct line if an exception is thrown during eval. A neat trick
        // I figured out playing around. Likely only works in WebKit though.
        //var debugSrc = injectDebugScript(preprocessedCode);

        //console.log(preprocessedCode + "\n//@ sourceURL=" + "fuck.js")
        
        //console.log(files.length, files);

        window.onerror = function (msg, path, lineNumber) {
            window.onerror = null;

            setTimeout(function () {
                shimError(msg, lineNumber);
            }, 0);

            return true;
        };

        try {
            // So we eval in the global context
            //document.write(preprocessedCode);
            eval(preprocessedCode + "//@ sourceURL=" + fullPath);
            //eval("(function () { function foo() { bar } bar()})();");
        } catch (e) {
            // In some browsers (WebKit at least) syntax errors show this file
            // and the actual eval line as the error, and setting the sourceURL
            // doesn't work, so we'll generate our own generic error instead
            if (e.name === "SyntaxError") {
                var err = Error(e.message);
                err.name = "CBImport SyntaxError";
                err.sourceURL = "fuck.js";
                throw err;
            }

            // This is so the correct file is shown in WebKit debuggers. Neat eh?
            e.sourceURL = fullPath;
            throw e;
        }
    }

    window.CBLoadApplication = CBLoadApplication;

})(window, document);