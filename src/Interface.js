(function () {

    var Interface = CB.Object.create({

        create: function (instanceMembers, staticMembers) {
            return {
                instanceMembers: instanceMembers,
                staticMembers: staticMembers
            };
        }

    });
    
    CB.Interface = Interface;

})();