(function(mod) {
 if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../dialog/dialog"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../dialog/dialog"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineOption("goTo", false, function(cm, val) {
    if (val) {
	  console.log(cm.lineCount());
	  key('ctrl+shift+g', function(){
            fnGoTo(cm);
            return false 
      });
    }
  });
	var fnGoTo = function(cm) {
		var queryDialog = 'GoTo: <input type="text" style="width: 10em" />';
		dialog(cm, queryDialog, ":", cm.getSelection(), function(line) {
			cm.operation(function() {
			  	var column = 0;
			  	if (line.match(/,/)) {
				  var oLine = line.split(',');
				  line = oLine[0];
				  column = oLine[1]
				}
				if (line && !isNaN(Number(line))) {
					if (Number(line) === 0 ) {
						line = 0;
					} else {
						line = Number(line) - 1;
					}
					console.log(line)
					cm.setCursor(Number(line),0);
					cm.setSelection({line:Number(line),ch:column},{line:Number(line),ch:column});
					cm.focus();
				}
			});
    	});
	};
	function dialog(cm, text, shortText, deflt, f) {
    	if (cm.openDialog) cm.openDialog(text, f, {value: deflt});
    	else f(prompt(shortText, deflt));
  	}
});