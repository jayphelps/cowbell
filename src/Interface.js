(function () {

    var Interface = ML.Object.create({

        create: function (instanceMembers, staticMembers) {
            return {
                instanceMembers: instanceMembers,
                staticMembers: staticMembers
            };
        }

    });
    
    ML.Interface = Interface;

})();