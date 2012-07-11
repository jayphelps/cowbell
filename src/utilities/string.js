(function (CB, window, document) {

    // Make the first character upper case.
    CB.upperCaseFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    CB.hyphensToLowerCamelCase = function (str) {
         return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
    }

    CB.underscoreToLowerCamelCase = function (str) {
        str += '';
        var ret = (str.charAt(0).toLowerCase()) + str.substr(1);

        return ret.replace(/(_[a-zA-Z0-9\$])/g, function($1) {
            return $1.toUpperCase().replace('_', '');
        });
    };

    CB.isWhitespace = function (str) {
        if (str) {
            return (str.replace(/\s/g, '') === '');
        }

        return false;
    };

    CB.removeFileExtension = function (str) {
        return str.substr(0, str.lastIndexOf('.')) || str;
    };

    CB.isValidEmail = function (str) {
        /**
         * These comments use the following terms from RFC2822:
         * local-part, domain, domain-literal and dot-atom.
         * Does the address contain a local-part followed an @ followed by a domain?
         * Note the use of lastIndexOf to find the last @ in the address
         * since a valid email address may have a quoted @ in the local-part.
         * Does the domain name have at least two parts, i.e. at least one dot,
         * after the @? If not, is it a domain-literal?
         * 
         * This WILL ACCEPT some invalid email addresses BUT
         * it doesn't reject valid ones, which is most important to us
         * as this should just be used to prevent gibberish input.
         *
         * Reference: http://tools.ietf.org/html/rfc2822
         */    
        
        // First, make sure the string isn't empty
        if (!str || str === '') {
            return false;
        }
        
        var atSymbol = str.lastIndexOf('@');

        // no local-part
        if (atSymbol < 1) {
            return false;
        }
        
        // no domain
        if (atSymbol == str.length - 1) {
            return false;
        }
        
        // there may only be 64 octets in the local-part
        if (atSymbol > 64) {
            return false;
        }
        
        // there may only be 255 octets in the domain
        if (str.length - atSymbol > 255) {
            return false;
        }
        
        // Is the domain plausible?
        var lastDot = str.lastIndexOf('.');

        // Check if it is a dot-atom such as example.com
        if (lastDot > atSymbol + 1 && lastDot < str.length - 1) {
            return true;
        }

        //  Check if could be a domain-literal.
        if (str.charAt(atSymbol + 1) == '[' && str.charAt(str.length - 1) == ']') {
            return true;
        }
        
        // If you reach here we just give up and say no
        return false;
    };

})(CB, window, document);