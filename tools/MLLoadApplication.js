/**
 * Include this file so you can work on MLKit itself without having to rebuild
 * it or have it watch your files, for example, if you don't have node.js.
 */

(function (window, document) {

    function MLImport(filePath) {
        var pathname = window.location.pathname;
        var currentPath = MLImport.currentPath || location.origin + pathname.substring(0, pathname.lastIndexOf('/')) + "/";
        var fullPath = currentPath + filePath;

        if (MLImport[fullPath]) {
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

        var sourceCode = request.responseText;

        var oldPath = MLImport.currentPath;
        MLImport.currentPath = fullPath.split("/").slice(0, -1).join("/") + "/";

        var exp = /.*MLImport\s*\(\s*['|"]([a-zA-Z0-9_\.\-\/]*)['|"]\s*\)\s*;?/g;

        var preprocessedCode = sourceCode.replace(exp, function (match, filePath) {
            if ( !match.match(/\s*\/\//) ) {
                return MLImport(filePath);
            }
            
            return match;
        });

        

        MLImport.currentPath = oldPath;

        MLImport[fullPath] = true;

        return preprocessedCode;
    }

    function MLLoadApplication(filePath) {
        var pathname = window.location.pathname;
        var currentPath = MLImport.currentPath || location.origin + pathname.substring(0, pathname.lastIndexOf('/')) + "/";
        var fullPath = currentPath + filePath;

        var preprocessedCode = MLImport(filePath);

        try {
            // So we eval in the global context
            eval(preprocessedCode);
        } catch (e) {
            // In some browsers (WebKit at least) syntax errors show this file
            // and the actual eval line as the error, and setting the sourceURL
            // doesn't work, so we'll generate our own generic error instead
            if (e.name === "SyntaxError") {
                var err = Error(e.message);
                err.name = "MLImport SyntaxError";
                err.sourceURL = fullPath;
                throw err;
            }

            // This is so the correct file is shown in WebKit debuggers. Neat eh?
            e.sourceURL = fullPath;
            throw e;
        }
    }

    window.MLLoadApplication = MLLoadApplication;

})(window, document);