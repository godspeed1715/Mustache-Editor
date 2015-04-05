'use strict';

/* Services */

angular.module('mustache.services', [])
.service('mustacheService', function() {
    $.support.cors = true;
    //Create ActiveX File System object 
    //IE HTA service to manipulate local user data.
    var oFileSystem = new  ActiveXObject("Scripting.FileSystemObject"); 
    //Set User Application data folder.  
    var objShell = new  ActiveXObject("WScript.Shell")
    oUserProfilePath = objShell.ExpandEnvironmentStrings("%APPDATA%");
    userProfilePathRaw = objShell.ExpandEnvironmentStrings("%APPDATA%").split('\\'); 
    userProfilePath = '/';
    for (var _userpath = 1; _userpath < userProfilePathRaw.length; _userpath++) {
        userProfilePath += userProfilePathRaw[_userpath] + "/"
    }
    var extensionToSyntax = [
      {"extension":"js", "syntax":"javascript"},
      {"extension":"css", "syntax":"css"},
      {"extension":"ht", "syntax":"htmlmixed"},
      {"extension":"vb", "syntax":"vb"},
      {"extension":"py", "syntax":"python"},
      {"extension":"rb", "syntax":"ruby"},
      {"extension":"ps", "syntax":"powershell"},
      {"extension":"md", "syntax":"markdown"},
      {"extension":"jade", "syntax":"jade"},
      {"extension":"php", "syntax":"php"},
      {"extension":"txt", "syntax":"plaintext"}
    ];
  
    this.applySyntax = function (extension) {
        try {
            for (i in extensionToSyntax) {
            	  if (extension) {
            		  extension = extension.slice(0,2);
            	  }
            	  var re = new RegExp(extension, 'i');
            	  if (extensionToSyntax[i].extension.match(re)) {
            		  return extensionToSyntax[i].syntax;
            	  }
            }
        } catch (e) {
            return "txt"
        }
    }

    this.locateRootDirectory = function () {
        rootDirectory = "";
        pathname = location.pathname.split('\\');
        for (var _path = 0; _path < pathname.length - 1; _path++) {
            rootDirectory += pathname[_path] + "\\"
        }
        return rootDirectory
    }
    this.loadSyntaxFiles = function (rootDirectory) {
        var syntaxNames = [];
        var langaugeSyntaxFolder = rootDirectory + "app\\lib\\js\\codemirror\\modes";
        console.log("Language Syntax Folder: " + langaugeSyntaxFolder);  
        var oSyntaxFolder = oFileSystem.GetFolder(langaugeSyntaxFolder); 
        var oSyntaxFiles = new Enumerator(oSyntaxFolder.files);    
        for (; !oSyntaxFiles.atEnd(); oSyntaxFiles.moveNext())   
        {   
            syntaxNames.push(oSyntaxFiles.item());
        }   
        for (_i=0; _i < syntaxNames.length; _i++){
            var sTemp = String(syntaxNames[_i]);
            var newTemp = sTemp.split('\\');
            var newTemp2 = newTemp[newTemp.length-1];
            var newTemp3 = newTemp2.split('.js');
            var newTemp4 = newTemp3[newTemp3.length-2];
            syntaxNames[_i] = newTemp4;      
        }
        return syntaxNames
    }
    this.loadThemes = function (rootDirectory) {
        var themeNames = [];
        var themesFolder = rootDirectory + "app\\lib\\css\\themes";
        console.log("Themes Folder: " + themesFolder);  
        var oThemesFolder = oFileSystem.GetFolder(themesFolder); 
        var oThemeFiles = new Enumerator(oThemesFolder.files);     
        for (; !oThemeFiles.atEnd(); oThemeFiles.moveNext())   
        {   
            themeNames.push(oThemeFiles.item());
        }
        for (_i=0; _i < themeNames.length; _i++){
            var sTemp = String(themeNames[_i]);
            var newTemp = sTemp.split('\\');
            var newTemp2 = newTemp[newTemp.length-1];
            var newTemp3 = newTemp2.split('.css');
            var newTemp4 = newTemp3[newTemp3.length-2];
            themeNames[_i] = newTemp4;      
        }
        return themeNames
    }

     //Load config file
    var initUserConfig = function () {
        var configFolderPath = oUserProfilePath + "\\mustache"
        var configFilePath = configFolderPath + "\\config.mustache.settings";
        var bConfigFolderExist = oFileSystem.FolderExists(oUserProfilePath + "\\mustache");
        var bConfigFileExist = oFileSystem.FileExists(configFolderPath + "\\config.mustache.settings");
        var ajaxPath = userProfilePath + 'mustache/config.mustache.settings';
        try {
            if (bConfigFolderExist) {
                if (bConfigFileExist) {
                    return ajaxPath
                } else {
                    var configFile = oFileSystem.CreateTextFile(configFilePath, true);
                    configFile.write("{\n\t\"theme\": \"lightbox\",\n\t\"syntax\": \"javascript\",\n\t\"fontsize\": \"14\",\n\t\"tabsize\": \"4\",\n\t\"sidebar\": false,\n\t\"linenumbers\": true,\n\t\"wordwrap\": false\n}")
                    return ajaxPath
                }
            } else {
                try {
                    console.log('Config Folder does not exist, creating '+ oUserProfilePath)
                    oFileSystem.CreateFolder(oUserProfilePath + "\\mustache");
                    if (bConfigFileExist) {
                        return ajaxPath
                    } else {
                        var configFile = oFileSystem.CreateTextFile(configFilePath, true);
                        configFile.write("{\n\t\"theme\": \"lightbox\",\n\t\"syntax\": \"javascript\",\n\t\"fontsize\": \"14\",\n\t\"tabsize\": \"4\",\n\t\"sidebar\": false,\n\t\"linenumbers\": true,\n\t\"wordwrap\": false\n}")
                        return ajaxPath
                    }
                } catch(e) {
                    console.log(e)
                    console.error('Configuration file could not be found nor created, reverting to default configuration.')
                }
            }
        } catch(e) {
            console.log(e)
            console.error('Configuration folder could not be found nor created, reverting to default configuration.')
        }
    }
    this.loadUserConfig = function(configFile) {
        var configFile = initUserConfig();
        console.log('AJAX Request: Loading User Configuration: ' + configFile)
        var promise = $.getJSON( configFile, function( responseData ) {
           console.log('Loaded config successfully');
           data = responseData
           return data
        }).error(function(e){
            console.log("Unable to Load Config File. Error: " + JSON.stringify(e));
        });

        return promise;
    }
    this.saveFile = function(sFilePath, contentData) {
        try {
		  	setTimeout(
			  function() {
			  var sFile = oFileSystem.OpenTextFile(sFilePath,2,true);
			  sFile.WriteLine(contentData);
			  sFile.Close
			  },Math.floor((Math.random()*500)+1))
        } catch(e) {
          console.info("Unable to save file, attempting again, error code: " + JSON.stringify(e));
            try {
              setTimeout(
                function() {        
                  var sFile = oFileSystem.OpenTextFile(sFilePath,2,true);
                  sFile.Write(contentData);
                  sFile.Close
                },1500
              );
            } catch(e) {
              console.error("Critical Error: Unable to save file, error code: " + JSON.stringify(e))
            }
        }
    }
    this.saveAs = function(iCurrentEditor) {
        var editorContent = editors[iCurrentEditor].getValue("\r\n");
        var newIframe = document.createElement('iframe');
        newIframe.width = '200';newIframe.height = '200';
        newIframe.src = 'about:blank'; 
        document.body.appendChild(newIframe);
        newIframe.contentWindow.document.open('text/html', 'replace');
        newIframe.contentWindow.document.write(editorContent);
        newIframe.contentWindow.document.close();
        if(newIframe.contentWindow.document.execCommand("SaveAs",1,"*.txt")) {
            console.info("File was saved.");
            newIframe.parentNode.removeChild(newIframe);
        }else {
            newIframe.parentNode.removeChild(newIframe);
            throw "File cannot be saved.";
        }
    }
    this.exitApplication = function(configFileData) {
        var configFileOnExit = oFileSystem.OpenTextFile(oUserProfilePath + "\\mustache\\config.mustache.settings",2,true);
        configFileOnExit.write("{\n\t\"theme\": \"" + configFileData.theme + "\",\n\t\"syntax\": \"" + configFileData.syntax + "\",\n\t\"fontsize\": \"" + configFileData.fontsize + "\",\n\t\"sidebar\": " + configFileData.sidebar + ",\n\t\"linenumbers\": " + configFileData.linenumbers + ",\n\t\"wordwrap\": " + configFileData.wordwrap + ",\n\t\"tabsize\": " + configFileData.tabsize + "\n}")
        configFileOnExit.Close
        window.close();
    }
    this.createEditor = function (configFileData, id) {
        editors[ed] = CodeMirror.fromTextArea(document.getElementById(id), {
                lineNumbers: configFileData.linenumbers,
                lineWrapping: configFileData.wordwrap,
                autofocus: true,
                indentWithTabs: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                goTo: true,
                mode: {name: configFileData.syntax, globalVars: true},
                foldGutter: true,
                scrollPastEnd: true,
                viewportMargin: 150,
                theme: configFileData.theme,
		 		extraKeys: {"Ctrl-Space": "autocomplete", "showOnKeyPress": true},
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            }); 
            CodeMirror.modeURL = "./app/lib/js/codemirror/modes/%N.js";
            CodeMirror.autoLoadMode(editors[ed], {name: configFileData.syntax, globalVars: true});
            editors[ed].setSize("height",window.innerHeight - 62);
           
    }
	this.setAllInactive = function(oWorkingFiles) {
	  angular.forEach(oWorkingFiles, function(workingFiles) {
		workingFiles.active = false;
	  });
	};
});










