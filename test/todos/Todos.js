(function (window, document) {

    MLImport("../../src/MLKit.js");

    var Todos = ML.Application.create();

    MLImport("ListItemView.js");
    MLImport("ListView.js");
    MLImport("ListViewController.js");
    MLImport("ApplicationDelegate.js");

    Todos.start();

})(window, document);