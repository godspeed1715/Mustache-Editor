'use strict';

/* Services */

angular.module('mustache.services', [])
    .service('mustacheService', function() {
        $.support.cors = true;

        //Set private this variable
        var _this = this;
	  
        //Create ActiveX File System object 
        //IE HTA service to manipulate local user data.
        var oFileSystem = new ActiveXObject("Scripting.FileSystemObject");

        //Set User Application data folder.  
        var objShell = new ActiveXObject("WScript.Shell")
        oUserProfilePath = objShell.ExpandEnvironmentStrings("%APPDATA%");
        userProfilePathRaw = objShell.ExpandEnvironmentStrings("%APPDATA%").split('\\');
        userProfilePath = '/';
        for (var _userpath = 1; _userpath < userProfilePathRaw.length; _userpath++) {
            userProfilePath += userProfilePathRaw[_userpath] + "/"
        }
        var extensionToSyntax = [{
            "extension": "js",
            "syntax": "javascript"
        }, {
            "extension": "css",
            "syntax": "css"
        }, {
            "extension": "ht",
            "syntax": "htmlmixed"
        }, {
            "extension": "vb",
            "syntax": "vb"
        }, {
            "extension": "py",
            "syntax": "python"
        }, {
            "extension": "rb",
            "syntax": "ruby"
        }, {
            "extension": "ps",
            "syntax": "powershell"
        }, {
            "extension": "md",
            "syntax": "markdown"
        }, {
            "extension": "jade",
            "syntax": "jade"
        }, {
            "extension": "php",
            "syntax": "php"
        }, {
            "extension": "txt",
            "syntax": "plaintext"
        }];

        //Apply the syntax of the input file. 
        _this.applySyntax = function(extension) {
            try {
                for (i in extensionToSyntax) {
                    if (extension) {
                        extension = extension.slice(0, 2);
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

        //Get the root directory of the editor.
        _this.locateRootDirectory = function() {
            rootDirectory = "";
            pathname = location.pathname.split('\\');
            for (var _path = 0; _path < pathname.length - 1; _path++) {
                rootDirectory += pathname[_path] + "\\"
            }
            return rootDirectory
        }

        //Load the Syntax files for CodeMirror.
        _this.loadSyntaxFiles = function(rootDirectory) {
            var syntaxNames = [];
            var langaugeSyntaxFolder = rootDirectory + "app\\lib\\js\\codemirror\\modes";
            console.log("Language Syntax Folder: " + langaugeSyntaxFolder);
            var oSyntaxFolder = oFileSystem.GetFolder(langaugeSyntaxFolder);
            var oSyntaxFiles = new Enumerator(oSyntaxFolder.files);
            for (; !oSyntaxFiles.atEnd(); oSyntaxFiles.moveNext()) {
                syntaxNames.push(oSyntaxFiles.item());
            }
            for (_i = 0; _i < syntaxNames.length; _i++) {
                var sTemp = String(syntaxNames[_i]);
                var newTemp = sTemp.split('\\');
                var newTemp2 = newTemp[newTemp.length - 1];
                var newTemp3 = newTemp2.split('.js');
                var newTemp4 = newTemp3[newTemp3.length - 2];
                syntaxNames[_i] = newTemp4;
            }
            return syntaxNames
        }

        //Load the themes for Mustache, and CodeMirror.
        this.loadThemes = function(rootDirectory) {
            var themeNames = [];
            var themesFolder = rootDirectory + "app\\lib\\css\\themes";
            console.log("Themes Folder: " + themesFolder);
            var oThemesFolder = oFileSystem.GetFolder(themesFolder);
            var oThemeFiles = new Enumerator(oThemesFolder.files);
            for (; !oThemeFiles.atEnd(); oThemeFiles.moveNext()) {
                themeNames.push(oThemeFiles.item());
            }
            for (_i = 0; _i < themeNames.length; _i++) {
                var sTemp = String(themeNames[_i]);
                var newTemp = sTemp.split('\\');
                var newTemp2 = newTemp[newTemp.length - 1];
                var newTemp3 = newTemp2.split('.css');
                var newTemp4 = newTemp3[newTemp3.length - 2];
                themeNames[_i] = newTemp4;
            }
            return themeNames
        }

        //Init the local config file. Will check if config exist, and if it does not, then sets mustache defaults.
        var initUserConfig = function() {
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
                        console.log('Config Folder does not exist, creating ' + oUserProfilePath)
                        oFileSystem.CreateFolder(oUserProfilePath + "\\mustache");
                        if (bConfigFileExist) {
                            return ajaxPath
                        } else {
                            var configFile = oFileSystem.CreateTextFile(configFilePath, true);
                            configFile.write("{\n\t\"theme\": \"lightbox\",\n\t\"syntax\": \"javascript\",\n\t\"fontsize\": \"14\",\n\t\"tabsize\": \"4\",\n\t\"sidebar\": false,\n\t\"linenumbers\": true,\n\t\"wordwrap\": false\n}")
                            return ajaxPath
                        }
                    } catch (e) {
                        console.log(e)
                        console.error('Configuration file could not be found nor created, reverting to default configuration.')
                    }
                }
            } catch (e) {
                console.log(e)
                console.error('Configuration folder could not be found nor created, reverting to default configuration.')
            }
        }

        //Loads the local Config file
        this.loadUserConfig = function(configFile) {
            var configFile = initUserConfig();
            console.log('AJAX Request: Loading User Configuration: ' + configFile)
            var promise = $.getJSON(configFile, function(responseData) {
                console.log('Loaded config successfully');
                data = responseData
                return data
            }).error(function(e) {
                console.log("Unable to Load Config File. Error: " + JSON.stringify(e));
            });

            return promise;
        };

        //Find the current editor and returns the Unique Id.
        _this.getCurrentEditor = function() {
            return $("#tabs .active a").attr('data-editor');
        };

        //Saves the current Editor content to local file.
        _this.saveFile = function(workingFiles) {
            var iCurrentEditor = _this.getCurrentEditor();
            if (iCurrentEditor) {
                var contentData = editors[iCurrentEditor].getValue("\r\n");
                var sFilePath = workingFiles[iCurrentEditor].path;
                console.log("Saving File: " + sFilePath);
                if (sFilePath === "untitled") {
                    _this.saveAs();
                } else {
                    try {
                        var sFile = oFileSystem.OpenTextFile(sFilePath, 2, true);
                        contentData = contentData.replace(/[\n]$/, '')
                        sFile.Write(contentData);
                        sFile.Close

                        return "Saved " + workingFiles[iCurrentEditor].path;
                    } catch (e) {
                        _this.saveAs();
                        return 'Unable to save file, attempting again, error code: ' + JSON.stringify(e)
                        console.info('Unable to save file, attempting again, error code: ' + JSON.stringify(e));
                    }
                }
            }
        }

        //Prompts the user to save the file. Save As functionality.
        _this.saveAs = function(iCurrentEditor) {
            var iCurrentEditor = _this.getCurrentEditor();
		  	console.log(iCurrentEditor)
            if (iCurrentEditor) {
                try {
                    var editorContent = editors[iCurrentEditor].getValue("\r\n");
                    var newIframe = document.createElement('iframe');
                    newIframe.width = '200';
                    newIframe.height = '200';
                    newIframe.src = 'about:blank';
                    document.body.appendChild(newIframe);
                    newIframe.contentWindow.document.open('text/html', 'replace');
                    newIframe.contentWindow.document.write(editorContent);
                    newIframe.contentWindow.document.close();
                    if (newIframe.contentWindow.document.execCommand("SaveAs", 1, "*.txt")) {
                        console.info("File was saved.");
                        newIframe.parentNode.removeChild(newIframe);
                    } else {
                        newIframe.parentNode.removeChild(newIframe);
                        throw "File cannot be saved.";
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }

        //Exits Mustache, and saves the user's settings.
        _this.exitApplication = function(configFileData) {
            var configFileOnExit = oFileSystem.OpenTextFile(oUserProfilePath + "\\mustache\\config.mustache.settings", 2, true);
            configFileOnExit.write("{\n\t\"theme\": \"" + configFileData.theme + "\",\n\t\"syntax\": \"" + configFileData.syntax + "\",\n\t\"fontsize\": \"" + configFileData.fontsize + "\",\n\t\"sidebar\": " + configFileData.sidebar + ",\n\t\"linenumbers\": " + configFileData.linenumbers + ",\n\t\"wordwrap\": " + configFileData.wordwrap + ",\n\t\"tabsize\": " + configFileData.tabsize + "\n}")
            configFileOnExit.Close
            window.close();
        }

        //Initialize an instance of the editor.
        _this.createEditor = function(configFileData, id) {
            editors[ed] = CodeMirror.fromTextArea(document.getElementById(id), {
                lineNumbers: configFileData.linenumbers,
                lineWrapping: configFileData.wordwrap,
                autofocus: true,
                indentWithTabs: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                goTo: true,
                mode: {
                    name: configFileData.syntax,
                    globalVars: true
                },
                foldGutter: true,
                scrollPastEnd: true,
                viewportMargin: 150,
                theme: configFileData.theme,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "showOnKeyPress": true
                },
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            });
            CodeMirror.modeURL = "./app/lib/js/codemirror/modes/%N.js";
            CodeMirror.autoLoadMode(editors[ed], {
                name: configFileData.syntax,
                globalVars: true
            });
            editors[ed].setSize("height", window.innerHeight - 62);

        }

        //Sets all editors instances inactive for bootstrap tabs.
        _this.setAllInactive = function(oWorkingFiles) {
            angular.forEach(oWorkingFiles, function(workingFiles) {
                workingFiles.active = false;
            });
        };

        //Implements jsBeautify
        _this.beautifyCode = function() {
            var iCurrentEditor = _this.getCurrentEditor();
		  	if (iCurrentEditor) {
				var editorContent = editors[iCurrentEditor].getValue("\r\n");
				try {
					var beautified = js_beautify(editorContent);
					editors[iCurrentEditor].setValue(beautified);
					console.log('Content was beautified.');

					return "Content was beautified"
				} catch (e) {

					return "Unable to beautify content."
				}
			}
        }
    });