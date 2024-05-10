window.ace.define("ace/mode/mqfl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var MQFLHighlightRules = function() {
        this.$rules = {
            "start" : [
                {
                    token: "support.function",//Paragraph
                    regex: /^(?:\d+\.){2,}.*/
                }, {
                    token: "constant.character.asterisk",//Chapter
                    regex: /^Chapter\s+\d+/
                }, {
                    token: 'variable.parameter',//Page header possibly
                    regex: /.+\-.+\d{1,2}\s[A-Z]+\s\d{4}.*/,
                    caseInsensitive: true
                }, {
                    token: 'variable.parameter',//Page header possibly
                    regex: /\d+.+\-.+\d{1,2}\s[A-Z]+\s\d{4}.*/,
                    caseInsensitive: true
                }, {
                    token: 'string',//answer
                    regex: /^\s*[a-z]\s*\..*$/,
                    caseInsensitive: true
                }, {
                    token: 'variable',//correct answer
                    regex: /^\s*\*\s*[a-z]\s*\..*$/,
                    caseInsensitive: true
                }, {
                    token: 'variable',//correct answer
                    regex: /^\s*(answer|ans)\s*:.*$/,
                    caseInsensitive: true
                }, {
                    token: "storage",//Title
                    regex: /^\s*!.*$/
                }, {
                    token: "comment",//Comment
                    regex: /^\s*>.*$/
                }, {
                    token: "term",
                    regex: /\w+/
                }, {
                    token: "text",
                    regex: /\s+/
                }
            ]
        };
    };
    
    oop.inherits(MQFLHighlightRules, TextHighlightRules);
    
    exports.MQFLHighlightRules = MQFLHighlightRules;
    });
    
    window.ace.define("ace/mode/mqfl",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/mqfl_highlight_rules"], function(require, exports, module) {
    
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var MQFLHighlightRules = require("./mqfl_highlight_rules").MQFLHighlightRules;
    
    var Mode = function() {
        this.HighlightRules = MQFLHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    
    oop.inherits(Mode, TextMode);
    
    (function() {
        this.$id = "ace/mode/mqfl";
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
    });                (function() {
                        window.ace.require(["ace/mode/mqfl"], function(m) {
                            if (typeof module == "object" && typeof exports == "object" && module) {
                                module.exports = m;
                            }
                        });
                    })();
                