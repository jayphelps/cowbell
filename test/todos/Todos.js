(function (window, document) {

    CBImport("../../src/cowbell.js");

    var Todos = CB.Application.create();

    CBImport("ListItemView.js");
    CBImport("ListView.js");
    CBImport("ListViewController.js");
    CBImport("ApplicationDelegate.js");

    Todos.start();

})(window, document);