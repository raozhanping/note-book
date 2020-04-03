// template
(function(){
    
})();

// JSON.stringify(value, replacer, space)
!function () {
    var obj = {
        1: "332",
        undefined: 111,
        2222: undefined,
        3333: function() {},
        4444: Symbol(111),
        test: {
            "#": "b#"
        }
    };
    var arr = [ function() {}, undefined, 111, Symbol(4444) ];
    function jsonStringify(obj) {
        var type = typeof obj;
        if (type !== "object" || obj == null) {
            if (/string|undefined|function/.test(type)) {
                obj = '"' + obj + '"';
            }
            return String(obj);
        } else {
            var json = [];
            var arr = (obj && obj.constructor === Array);
            for (let k in obj) {
                let v = obj[k];
                let type = typeof v;
                if (/string|undefined|function/.test(type)) {
                    v = '"' + v + '"';
                } else if (type === "object") {
                    v = jsonStringify(v);
                }
                json.push((arr ? "" : '"' + k + '":') + String(v));
            }
    
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }

    console.log(Symbol.for(111) === Symbol.for(111))
    console.log(JSON.stringify(obj, "#", 4));
    console.log(JSON.stringify(arr));
    console.log(
        JSON.stringify(/test|d{3}/),
        JSON.stringify(new Error('test error')),
        JSON.stringify(new Date()),
        (new Date()).toString(),
        JSON.stringify(function() {}),
        String(function() {}),
        JSON.stringify("arr"),
        JSON.stringify(undefined),
        JSON.stringify(null),
        String(null),
        typeof null
    );
    console.log(
        jsonStringify(/test|d{3}/),
        jsonStringify(new Error('test error')),
        jsonStringify(new Date()),
        (new Date()).toString(),
        jsonStringify(function() {}),
        String(function() {}),
        jsonStringify("arr"),
        jsonStringify(undefined),
        jsonStringify(null)
    );
}();
