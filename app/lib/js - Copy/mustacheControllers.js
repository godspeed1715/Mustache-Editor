'use strict';

/* Controllers */

angular.module('mustache.controllers', [])
.controller('MustacheCtrl', ['$scope', 'mustacheService',
    function ($scope, mustacheService) {
        'use strict';
	  	$.support.cors = true;
        $scope.root = mustacheService.locateRootDirectory();
        $scope.codePaneActive = false;
        $scope.syntaxNames;
        $scope.indentNumbers = ["1","2","3","4","5","6","7","8"];
        $scope.tabSize = 4;
        $scope.syntaxNames = mustacheService.loadSyntaxFiles($scope.root);
        $scope.currentSyntax = "javascript";
        $scope.line = "1";
        $scope.column = "1";
        $scope.editorIndent = "Tab Size: 4"
        $scope.editorStatus = "";
        $scope.themeNames = mustacheService.loadThemes($scope.root);
        $scope.currentTheme = "lightbox";
        $scope.fontsize = 14; 
        $scope.workingFiles = [];
        $scope.toggleSidebar = false;
        $scope.toggleLineNumbers = true;
        $scope.toggleWordWrap = true; 
        $scope.configFileData = [];
	  	var openFile = true; 
		$scope.range = function(number) {
        	return new Array(number);
    	};
        (function () {
            mustacheService.loadUserConfig().then(function(data){
                $scope.configFileData = data
                if (data.theme) {
                    sThemeName = data.theme
                    $scope.currentTheme = sThemeName;
                    console.log("Theme changed to " + sThemeName)
                    $('#themes').attr('href','./app/lib/css/themes/' + sThemeName + '.css');
                    $('#mustache-themes').attr('href','./app/lib/css/' + sThemeName + '.css');
                    if (editors.length === 0) {
                      $scope.currentTheme = sThemeName;
                    } else {
                      for (var _x = 0;_x <= editors.length -1; _x++) {
                        editors[_x].setOption("theme", sThemeName);
                      }
                    }
                }
                if (data.syntax) {
                    var sModeName = data.syntax;
                    $scope.currentSyntax = sModeName;
                    console.log('Syntax Changed to ' + sModeName);
                    CodeMirror.modeURL = "./app/lib/js/codemirror/modes/%N.js";
                    if (editors.length != 0) {
                        for (var y = 0; y <= editors.length -1; y++){
                            editors[y].setOption("mode", sModeName);
                            CodeMirror.autoLoadMode(editors[y], sModeName);
                        };
                    } 
                    $scope.$apply($scope.currentSyntax);
                }
                if (data.fontsize) {
                    console.log("Fontsize changed to " + data.fontsize);
                    $scope.fontsize = data.fontsize;
                    $scope.$apply($scope.fontsize);
                }
                if (data.tabsize) {$scope.range = function(n) {
		  			return new Array(n);
	  			};
                    console.log("Tabsize changed to " + data.tabsize);
                    $scope.tabSize = data.tabsize;
                }
                if (data.sidebar !== "") {
                    console.log("Display sidebar: " + data.sidebar);
                    if (data.sidebar === true) {
                        $scope.fnToggleSidebar();
                    } 
                }
                if (data.linenumbers !== "") {
                    console.log("Display linenumbers: " + data.linenumbers);
                    $scope.toggleLineNumbers = data.linenumbers;
                    $scope.$apply($scope.toggleLineNumbers);
                }
                if (data.wordwrap !== "") {
                    console.log("Wordwrap: " + data.wordwrap);
                    $scope.toggleWordWrap = data.wordwrap;
                    $scope.$apply($scope.toggleWordWrap);
                }
            });
        })()

        Array.prototype.remove = function (arrayIndex) {
          this.splice(arrayIndex, 1)
        }
        $scope.showTab = function () {
            var iCurrentEditor = $("#tabs .active a").attr('data-editor');
            if (iCurrentEditor) {
			  editors[ed - 1].scrollTo({x: $scope.workingFiles[iCurrentEditor].scrollView})
			  console.log($scope.workingFiles[iCurrentEditor].scrollView)
			  mustacheService.setAllInactive($scope.workingFiles);
              $scope.currentSyntax = $scope.configFileData.syntax = $scope.workingFiles[iCurrentEditor].syntax;
              document.title = $scope.workingFiles[iCurrentEditor].path;
              console.log(JSON.stringify($scope.workingFiles[iCurrentEditor]));
            }
        }
        $scope.fnFind = function (e) {
            console.log('Find');
            e.preventDefault();
        }
        $scope.fnCreateEditorInstance = function(id){
           mustacheService.createEditor($scope.configFileData, id)
            editors[ed].on('cursorActivity', function(cm) {
              var line = JSON.stringify(cm.getCursor().line);
              var column = JSON.stringify(cm.getCursor().ch);
              $scope.line = Number(line) + 1;
              $scope.column = column;
              $scope.$apply($scope.line,$scope.column)
            })
			/*
			editors[ed].on('cursorActivity', function(cm) {
			  //var currentViewTopLine = cm.getScrollInfo();
			  console.log(cm.getScrollInfo().top);
			  var iCurrentEditor = $("#tabs .active a").attr('data-editor');
			  console.log("working")
			   for (var _x = 0; _x < $scope.workingFiles.length; _x++) {
				 	console.log("Editor Number" + _x)
			  		if (_x === Number(iCurrentEditor)) {
			  			$scope.workingFiles[iCurrentEditor].scrollView = cm.getScrollInfo().top;
					  	$scope.$apply($scope.workingFiles)
				  		console.log("ScrollView" + $scope.workingFiles[iCurrentEditor].scrollView)
					}
			   }
            })*/
        }
        $scope.fnNewFile = function (filename, fullPath, fileExtension) {
            if (!fullPath && !filename && !fileExtension) {
                fullPath = "untitled";
                filename = "untitled"
            } else if (!fullPath && !fileExtension && filename){
                fullPath = filename;
                fileExtension = "txt"
            } else if (!fullPath && fileExtension && filename) {
                fullPath = filename;
            }
            
            document.title = fullPath + " - Mustache" 
			$('#tabs li').removeClass('active');            
            $('.tab-content div').removeClass('active');
		  	$('.sidebar a').removeClass('active');
            $('#tabs').tooltip()
			mustacheService.setAllInactive($scope.workingFiles);
            $scope.currentSyntax = $scope.configFileData.syntax = mustacheService.applySyntax(fileExtension);
		  	$scope.workingFiles.push({"ed": ed, "active": true, "scrollView": 0, "path": fullPath, "filename": filename, "extension": fileExtension, "syntax": $scope.currentSyntax, "fontsize": $scope.fontsize});
            $scope.$apply($scope.workingFiles)
            $scope.fnCreateEditorInstance("editor-" + ed);
            $('.CodeMirror').css({"font-size": $scope.fontsize + "px"})
            ed++;
            $scope.codePaneActive = true;
        }
        $scope.fnOpenFile = function () {
            $("#fileOpen").val('');
            if (openFile === true) {  
                openFile = false;
			  	try {
				  document.getElementById("fileOpen").click();
				  var file = $("#fileOpen").val();
				  if (file) {
					  var openElement = $("#fileOpen");
					  openElement.replaceWith( openElement = openElement.clone( true ) );
					  console.log('Open File: ' + file);
					  var sData = "";
					  var newfile = file.replace(/\\/g,"/");
					  var fullpath = newfile.slice(2,newfile.length);
					  var splitPath = fullpath.split('/');
					  var filename = splitPath[splitPath.length - 1];
					  var splitFileExtension = splitPath[splitPath.length - 1].split('.');
					  var fileExtension = splitFileExtension[splitFileExtension.length - 1];
					  $scope.editorStatus = "Opening File: " + fullpath;
					  $.ajax({
						  type: "POST",
						  url: fullpath,
						  dataType: "text"
					  }).success(function (sData) {
						  $scope.fnNewFile(filename, fullpath, fileExtension);
						  editors[ed - 1].setValue(sData);
						  editors[ed - 1].setSize("height",document.innerHeight); 
						  $scope.editorStatus = "";
					  }).error(function(e){
						  console.log("Unable to Open File. Error: " + e);
					  });
					  $scope.codePaneActive = true;
				  }
				} catch(e) {
				  throw "Error opening file: " + e
				}
            }
            setTimeout(
                function () {
                    openFile = true;
                },500
            )
        }
        $scope.fnOpenFolder = function () {
            console.log('Open Folder');
            $scope.codePaneActive = true;
        }
        $scope.fnCloseFile = function (file) {
            console.log('Close File');
            if (!file) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
            } else {
                var iCurrentEditor = $scope.workingFiles.indexOf(file);
            }
            if (parseInt(iCurrentEditor, 10) + 1 === $scope.workingFiles.length ) {
                $('#tabs').find('.codeeditor' + iCurrentEditor).prev('li').addClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).prev('.tab-pane').addClass('active');
            } else {
                $('#tabs').find('.codeeditor' + iCurrentEditor).next('li').addClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).next('.tab-pane').addClass('active');  
            }
            $scope.workingFiles.remove(iCurrentEditor);
            $('#tabs').find('.codeeditor' + iCurrentEditor).remove();
            editors.remove(iCurrentEditor); 
            if (ed !== 0) {
                ed--
            }
        }
        $scope.fnCloseAllFiles = function () {
            console.log('Close all files');
            document.title = "Mustache"
            $('.splash-container').removeClass('hide')
            $('#mustache-code-pane').addClass('hide');
            $('#tabs').html('');
            $('.tab-content').html('');
            $scope.workingFiles = [];
            $scope.$apply($scope.workingFiles);
            $scope.codePaneActive = false;
        }
        $scope.fnSaveFile = function () {
            var iCurrentEditor = $("#tabs .active a").attr('data-editor');
            if (iCurrentEditor) {
                var contentData = editors[iCurrentEditor].getValue("\r\n");
                var sFilePath = $scope.workingFiles[iCurrentEditor].path;
                console.log("Saving File: " + sFilePath);
                if (sFilePath === "untitled"){
                    $scope.fnSaveFileAs();
                } else {  
                    mustacheService.saveFile(sFilePath, contentData);
                }
                $scope.editorStatus = "Saved File: " + $scope.workingFiles[iCurrentEditor].path;
                $scope.$apply($scope.editorSaved);
            }
        }
        $scope.fnSaveFileAs = function () {
            console.log('Save File As');
            var iCurrentEditor = $("#tabs .active a").attr('data-editor');
            if (iCurrentEditor) {
			  	var workspaceShapshot = $scope.workingFiles;
			  	try {
                	mustacheService.saveAs(iCurrentEditor, workspaceShapshot);
				} catch(e) {
				  console.log(e)
				  $scope.workingFiles = workspaceShapshot;
				}
            }
        }
        $scope.fnToggleSidebar = function () {
            if ($scope.toggleSidebar === true) {
                $scope.toggleSidebar = false;
                $scope.configFileData.sidebar = false
                $scope.$apply($scope.toggleSidebar);
                console.log('Toggle Sidebar: ' + $scope.toggleSidebar);
            } else if ($scope.toggleSidebar === false) {
                $scope.toggleSidebar = true;
                $scope.configFileData.sidebar = true
                $scope.$apply($scope.toggleSidebar);
                console.log('Toggle Sidebar: ' + $scope.toggleSidebar);
            }
            $('#mustache-Sidebar-Container, #mustache-Feed-Container, #mustache-Settings-Container').toggleClass('sidebar-open');
            $('#mustache-Sidebar-Container > .menuIcon').toggleClass('hide');
        }
        $scope.fnToggleLineNumbers = function () {
            if ($scope.toggleLineNumbers) {
                console.log('Toggle Line Numbers: ' + $scope.toggleLineNumbers);
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (editors.length === 0) {
                    $scope.toggleLineNumbers = false;
                    $scope.configFileData.linenumbers = false;
                } else if (iCurrentEditor) {
                    $scope.toggleLineNumbers = false;
                    $scope.configFileData.sidebar = false;
                    editors[iCurrentEditor].setOption("lineNumbers", false)
                    editors[iCurrentEditor].refresh()
                }
            } else if(!$scope.toggleLineNumbers){
                console.log('Toggle Line Numbers: ' + $scope.toggleLineNumbers);
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (editors.length === 0) {
                    $scope.toggleLineNumbers = true;
                    $scope.configFileData.sidebar = true;
                } else if (iCurrentEditor) {
                    $scope.toggleLineNumbers = true;
                    $scope.configFileData.sidebar = true
                    editors[iCurrentEditor].setOption("lineNumbers", true)
                    editors[iCurrentEditor].setOption({gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]});
                    editors[iCurrentEditor].refresh();
                }
            }
            $scope.$apply($scope.toggleLineNumbers)
        }
        $scope.fnToggleWordWrap = function () {
            if ($scope.toggleWordWrap === true) {
                $scope.toggleWordWrap = false;
                $scope.configFileData.wordwrap = false;
                console.log('Toggle Word Wrap: ' + $scope.toggleWordWrap);
            } else {
                $scope.toggleWordWrap = true;
                $scope.configFileData.wordwrap = true;
                console.log('Toggle Word Wrap: ' + $scope.toggleWordWrap);
            }
        }
        $scope.fnChangeTheme = function (event) {
            var sThemeName = $(event.currentTarget).attr('data-theme-name');
            console.log("Theme changed to " + sThemeName)
            $('#themes').attr('href','./app/lib/css/themes/' + sThemeName + '.css');
            $('#mustache-themes').attr('href','./app/lib/css/' + sThemeName + '.css');
            if (editors.length === 0) {
                $scope.currentTheme = sThemeName;
                $scope.configFileData.theme = sThemeName;
            } else {
              for (var _x = 0;_x <= editors.length -1; _x++) {
                editors[_x].setOption("theme", sThemeName);
              }
            }
        }
        $scope.fnChangeSyntax = function(event){
            var sModeName = $(event.currentTarget).attr('data-mode-name');
            console.log('Syntax Changed to ' + sModeName);
            CodeMirror.modeURL = "./app/lib/js/codemirror/modes/%N.js";
            if (editors.length != 0) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (iCurrentEditor) {
                    editors[iCurrentEditor].setOption("mode", sModeName);
                    CodeMirror.autoLoadMode(editors[iCurrentEditor], sModeName);
                    $scope.currentSyntax = sModeName;
                    $scope.workingFiles[iCurrentEditor].syntax = sModeName;
                    $scope.configFileData.syntax = sModeName;
                };
            } 
        }
		$scope.fnChangeFontsize = function (event) {
            var sFontsize = $(event.currentTarget).attr('data-fontsize');
            $scope.fontsize = sFontsize;
            $scope.configFileData.fontsize = sFontsize;
            console.log('Fontsize Changed to ' + sFontsize);
            if (editors.length != 0) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (iCurrentEditor) {
					$('.CodeMirror').css({"font-size": $scope.fontsize + "px"})
				};
            } 
        };
        $scope.fnChangeIndent = function (event) {
            var sIndent = $(event.currentTarget).attr('data-indent');
            $scope.tabSize = sIndent;
            $scope.editorIndent = "Tab Size: " + sIndent;
            $scope.configFileData.tabsize = sIndent;
            console.log('Tabsize Changed to ' + sIndent);
            if (editors.length != 0) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (iCurrentEditor) {
                    editors[iCurrentEditor].setOption("indent", sIndent);
                };
            } 
            console.log('Editor Indent: ' + $scope.editorIndent)
        };
        $scope.fnShowConfig = function () {
            console.log('Show Config: ' + userProfilePath + 'mustache/config.mustache.settings');
            $.ajax({
                type: "POST",
                url: userProfilePath + 'mustache/config.mustache.settings',
                dataType: "text"
            }).success(function (sData) {
                $scope.fnNewFile('config.mustache.settings', userProfilePath + 'mustache/config.mustache.settings')
                editors[ed - 1].setValue(sData);
                editors[ed - 1].setSize("height",document.innerHeight); 
            }).error(function(e){
                console.log("Unable to Open File. Error: " + e);
            });
            $scope.codePaneActive = true;
        }
        $scope.fnChangeTab = function () {
            var iCurrentEditor = $("#tabs .active a").attr('data-editor');
            console.log("Current Editor Index" + iCurrentEditor);
            if (parseInt(iCurrentEditor, 10) + 1 === ed ) {
                console.log('at end of tabs')
                $('#tabs').find('.codeeditor' + iCurrentEditor).removeClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).removeClass('active');
                $('#tabs').find('.codeeditor' + iCurrentEditor).prev('.mustache-header-tab').addClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).prev('.tab-pane').addClass('active');
            } else {
                console.log('not at end of tabs');
                $('#tabs').find('.codeeditor' + iCurrentEditor).removeClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).removeClass('active');
                $('#tabs').find('.codeeditor' + iCurrentEditor).next('.mustache-header-tab').addClass('active');
                $('.tab-content').find('.codeeditor'+ iCurrentEditor).next('.tab-pane').addClass('active');  
            }
        }
        $scope.fnExitApp = function () {
            mustacheService.exitApplication($scope.configFileData);
        }
        
        //mustache core loader
        $(document).ready(function (){
            $('.statusbar-syntax-dropdown .dropdown-menu, .statusbar-indent-dropdown .dropdown-menu, .statusbar-fontsize-dropdown .dropdown-menu').css('left',window.innerWidth - 275);
        });
        //mustache window resize
        $(window).resize(function(){
            $('.statusbar-syntax-dropdown .dropdown-menu, .statusbar-indent-dropdown .dropdown-menu, .statusbar-fontsize-dropdown .dropdown-menu').css('left',window.innerWidth - 275);
            if (editors.length !== 0) {
              if (editors.length === 1) {
                editors[0].setSize("height",window.innerHeight - 62);
                editors[0].refresh();
              } else if (editors.length > 1 ) {
                for (var _editor = 0;_editor < editors.length; _editor++) {
                    editors[_editor].setSize("height",window.innerHeight - 62);
                    editors[_editor].refresh();
                }
              }
            }
        })
        //Shortcut keys listener.
        key.filter = function(event){
          var tagName = (event.target || event.srcElement).tagName;
          key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
          return true;
        };
        function filter(event){
          var tagName = (event.target || event.srcElement).tagName;
          return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
        }
        key('ctrl+f', function(){
            $scope.fnFind(e); 
            return false 
        });
        key('ctrl+shift+h', function(){
            $scope.fnToggleSidebar(); 
            return false 
        });
        key('ctrl+n', function(){
             $scope.fnNewFile();
            return false 
        });
        key('ctrl+alt+w', function(){
            $scope.fnCloseAllFiles();
            return false 
        });
        key('ctrl+w', function(){
            $scope.fnCloseFile();
            return false 
        });
        key('ctrl+alt+s', function(){
            $scope.fnSaveFileAs();
            return false 
        });
        key('ctrl+s', function(){
            $scope.fnSaveFile();
            return false 
        });
        key('ctrl+o', function(){
            $scope.fnOpenFile();
            return false 
        });
        key('ctrl+shift+l', function(){
            $scope.fnToggleLineNumbers();
            return false 
        });
        key('ctrl+shift+w', function(){
            $scope.fnToggleWordWrap();
            return false 
        });
        key('ctrl+alt+c', function(){
            $scope.fnShowConfig();
            return false 
        });
	  	key('shift+=', function(){
		  	if (editors.length != 0) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (iCurrentEditor) {
					$('.CodeMirror').css({"font-size": $scope.fontsize++ + "px"});
				  	$scope.fontsize++;
				};
            } 
			return false
		});
	  	key('shift+-', function(){
		  	if (editors.length != 0) {
                var iCurrentEditor = $("#tabs .active a").attr('data-editor');
                if (iCurrentEditor) {
					$('.CodeMirror').css({"font-size": $scope.fontsize-- + "px"})
					$scope.fontsize--;
				};
            } 
			return false
		})
        key('ctrl+q', function(){
            $scope.fnExitApp();
            return false 
        });
      
        //Scoll to top 
        $(document).scroll(function(){
            if($(this).scrollTop()>= 100 ){
                $('.scrollToTop').removeClass('hide').fadeIn()
            } else if ($(this).scrollTop()< 99 ) {
               $('.scrollToTop').fadeOut('slow')
            }
        });
        $('.scrollToTop').on('click', function () {
          $(document).scrollTop(0);
        })
    }
]);
