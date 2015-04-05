'use strict';

/* Directives */

angular.module('mustache.directives', [])
    .directive('dropdownmenu', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="dropdown">' +
                '<span class="mustache-logo dropdown-toggle" data-toggle="dropdown">M</span>' +
                ' <ul class="dropdown-menu main-menu-dropdown">' +
                '   <li id="mustache-new-file" ng-click="fnNewFile()"><a href="#"><i class="fa fa-file-text"></i> New <span class="pull-right"><small>Ctrl+N</small></span></a>' +
                '    </li>' +
                '    <li id="mustache-main-open" ng-click="fnOpenFile()"><input id="fileOpen" type="file" class="hide"><a href="#"><i class="fa fa-file-o"></i> Open <span class="pull-right"><small>Ctrl+O</small></span></a>' +
                '    </li>' +
                '    <li id="mustache-main-open-folder" ng-click="fnOpenFolder()"><a href="#"><i class="fa fa-folder-open"></i> Open Folder <span class="pull-right"><small>Ctrl+Alt+O</small></span></a>' +
                '    </li>' +
                '    <li id="mustache-main-close" ng-click="fnCloseFile()"><a tabindex="-1" href="#"><i class="fa fa-times"></i> Close <span class="pull-right"><small>Ctrl+W</small></span></a>' +
                '    </li>' +
                '    <li id="mustache-main-close-all" ng-click="fnCloseAllFiles()"><a href="#"><i class="fa fa-ban"></i> Close All <span class="pull-right"><small>Ctrl+Alt+W</small></span></a>' +
                '    </li>' +
                '    <li role="presentation" class="divider"></li>' +
                '    <li class="mustache-main-save" ng-click="fnSaveFile()"><a href="#"><i class="fa fa-save"></i> Save <span class="pull-right"><small>Ctrl+S</small></span></a>' +
                '    </li>' +
                '    <li class="mustache-main-save-as" ng-click="fnSaveFileAs()"><a href="#"><i class="fa fa-save"></i> Save As... <span class="pull-right"><small>Ctrl+Alt+S</small></span></a>' +
                '    </li>' +
                '    <li role="presentation" class="divider"></li>' +
		 		'	 <li class="mustache-main-beautify" ng-click="fnBeautifyCode()"><a href="#"><i class="fa fa-code"></i> Beautify Code <span class="pull-right"><small>Ctrl+Alt+B</small></span></a>' +
                '    </li>' +
                '    <li id="mustache-main-view" class="dropdown-submenu">' +
                '        <a href="#"><i class="fa fa-eye"></i> View</a>' +
                '        <ul class="dropdown-menu">' +
                '             <li class="dropdown-header text-center">View</li>' +
                '            <li class="mustache-toggle-sidebar" ng-click="fnToggleSidebar()"><a href="#"><i class="fa fa-columns"></i> Toggle Sidebar <span class="pull-right"><small>Ctrl+Shift+H</small></span></a>' +
                '            </li>' +
                '            <li class="mustache-toggle-linenumbers" ng-click="fnToggleLineNumbers()"><a href="#"><i class="fa fa-list-ol"></i> Line Numbers <span class="pull-right"><small>Ctrl+Shift+I</small></span></a>' +
                '            </li>' +
                '            <li class="mustache-toggle-wordwarp" ng-click="fnToggleWordWrap()"><a href="#"><i class="fa fa-outdent"></i> Word Wrap <span class="pull-right"><small>Ctrl+Shift+W</small></span></a>' +
                '            </li>' +
                '           <li class="mustache-main-show-config" ng-click="fnShowConfig()"><a href="#"><i class="fa fa-gears"></i> Show Config  <span class="pull-right"><small>Ctrl+Alt+C</small></span></a>' +
                '               </li>' +
                '        </ul>' +
                '    </li>' +
                '    <li id="mustache-main-themes" class="dropdown-submenu">' +
                '        <a tabindex="-1" href="#"><i class="fa fa-tint"></i> Themes</a>' +
                '        <ul class="dropdown-menu">' +
                '            <li class="dropdown-header text-center">Themes</li>' +
                '            <li ng-repeat="theme in themeNames" data-theme-name="{{theme}}" ng-click="fnChangeTheme($event)"><a href="#">{{theme}}<i ng-show="theme === currentTheme" class="fa fa-check pull-right"></i></a></li>' +
                '            <li ng-show="themeNames.length === 0 || !themeNames"><a href="#">No Themes Loaded</a></li>' +
                '        </ul>' +
                '    </li>' +
                '    <li id="mustache-main-modes" class="dropdown-submenu hide">' +
                '        <a tabindex="-1" href="#"><i class="fa fa-code"></i> Syntax</a>' +
                '        <ul class="dropdown-menu">' +
                '            <li class="dropdown-header text-center">Syntax</li>' +
                '            <li ng-repeat="syntax in syntaxNames" data-mode-name="{{syntax}}" ng-click="fnChangeSyntax($event)"><a href="#">{{syntax}}<i ng-show="syntax === currentSyntax" class="fa fa-check pull-right"></i></a></li>' +
                '            <li ng-show="syntaxNames.length === 0 || !syntaxNames"><a href="#">No Syntax Loaded</a></li>' +
                '        </ul>' +
                '    </li>' +
                '    <li role="presentation" class="divider"></li>' +
                '    <li id="mustache-main-exit" ng-click="fnExitApp()"><a href="#"><i class="fa fa-times-circle"></i> Exit <span class="pull-right"><small>Ctrl+Q</small></span></a>' +
                '    </li>' +
                '</ul>' +
                '</span>'
        }
    })
    .directive('tabs', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<ul class="" data-tabs="tabs" id="tabs">' +
                '<li ng-click="showTab() && tab.active === true" ng-class="{active: tab.active}" ng-repeat="tab in workingFiles" data-toggle="tooltip" data-placement="top" title="{{tab.fullPath}}" class="mustache-header-tab codeeditor{{$index}}"><a href="#codeeditor{{$index}}" data-toggle="tab" data-editor="{{$index}}"> {{tab.filename}} <i ng-click="fnCloseFile(tab)" class="fa fa-times closefile"></i></a></li>' +
                '</ul>'
        }
    })
    .directive('tabcontent', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="tab-content" >' +
                '	<div ng-repeat="content in workingFiles" id="codeeditor-content{{$index}}" class="tab-pane codeeditor{{$index}}"><textarea id="editor-{{$index}}" class="contentStyle"></textarea></div>' +
                '</div>'
        }
    })
    .directive('sidebar', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="sidebar" id="mustache-Sidebar-Container">' +
                '<div class="sidebar-wrap">' +
                '    <span class="header">Working Files</span>' +
                '	<a href="#codeeditor{{file.ed}}" data-toggle="tab" ng-repeat="file in workingFiles" class="workingfile active"><i class="fa fa-file-o"></i> {{file.filename}}</a>' +
                '</div>' +
                '</div>'
        }
    })
    .directive('statusbarline', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="statusbar-lines">Line: {{line}}, Column: {{column}}</span>'
        }
    })
    .directive('statusbarstatus', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="statusbar-status"> {{editorStatus}} </span>'
        }
    })
    .directive('statusbarfontsize', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="dropdown statusbar-fontsize-dropdown">' +
                '   <span class="statusbar-fontsize dropdown-toggle" data-toggle="dropdown"> Font Size: {{fontsize}}px <i class="fa fa-sort"></i></span>' +
                '   <ul class="dropdown-menu">' +
                '       <li class="dropdown-header text-center">Font Size</li>' +
                '           <li ng-repeat="size in range(20) track by $index" data-fontsize="{{$index + 1}}" ng-click="fnChangeFontsize($event)"><a href="#"> Font Size: {{$index + 1}}px <i ng-show="$index + 1 === fontsize" class="fa fa-check pull-right"></i></a></li>' +
                '   </ul>' +
                '</div>'
        }
    })
    .directive('statusbartabsize', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="dropdown statusbar-indent-dropdown">' +
                '   <span class="statusbar-indent dropdown-toggle" data-toggle="dropdown"> {{editorIndent}} <i class="fa fa-sort"></i></span>' +
                '   <ul class="dropdown-menu">' +
                '       <li class="dropdown-header text-center">Indent</li>' +
                '           <li ng-repeat="indent in indentRange" data-indent="{{indent}}" ng-click="fnChangeIndent($event)"><a href="#"> Tab Width: {{indent}} <i ng-show="indent === tabSize" class="fa fa-check pull-right"></i></a></li>' +
                '   </ul>' +
                '</div>'
        }
    })
    .directive('statusbarsyntax', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="dropdown statusbar-syntax-dropdown">' +
                '   <span class="statusbar-syntax dropdown-toggle" data-toggle="dropdown"> {{currentSyntax}} <i class="fa fa-sort"></i></span>' +
                '   <ul class="dropdown-menu">' +
                '       <li class="dropdown-header text-center"> Syntax </li>' +
                '           <li ng-repeat="syntax in syntaxNames | filter:syntaxFilter" data-mode-name="{{syntax}}" ng-click="fnChangeSyntax($event)"><a href="#"> {{syntax}} <i ng-show="syntax === currentSyntax" class="fa fa-check pull-right"></i></a></li>' +
                '       <li ng-show="syntaxNames.length === 0 || !syntaxNames"><a href="#">No Syntax Loaded</a></li>' +
                '   </ul>' +
                '</div> '
        }
    })
