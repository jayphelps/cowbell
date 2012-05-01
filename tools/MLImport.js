/**
 * Include this file so you can work on MLKit itself without having to rebuild
 * it or have it watch your files, for example, if you don't have node.js.
 * 
 * WARNING: This script currently does not import the script into the same scope
 * of where it was called so any imported code that relies on such will not work
 * as expected. All distributes of MLKit should use the merc build tool instead.
 */
function MLImport(filePath) {
    var scripts = document.getElementsByTagName("script");
    var currentScript = scripts[scripts.length-1].src.split("?")[0];
    var currentPath = currentScript.split("/").slice(0, -1).join("/") + "/";

    var fullPath = currentPath + filePath;

    if (MLImport[fullPath]) {
        return false;
    }

    // @TODO add support for stupid IE...
    var request = new XMLHttpRequest();

    request.open("GET", fullPath, false);   
    request.send(null);  

    // Check for 200 status for HTTP, but also catch if responseText
    // contains anything for local file:// access that return zero status
    if (request.status !== 200 && !request.responseText) {  
       throw new Error('Importing file failed: ' + filePath + ' with status code: ' + request.status);
    }

    var source = request.responseText;

    try {
        // So we eval in the global context
        eval.call(window, source);
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

    MLImport[fullPath] = true;

    return true;
}
