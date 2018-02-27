const app = angular.module('flvsPLA', ['ui.router', 'ngMaterial', 'md.data.table', 'textAngular']);

// Application configuration options
app.config(($mdThemingProvider) => {
    // Extend the color themes to use the FLVS colors...
    const flvsBlue = $mdThemingProvider.extendPalette('blue', {
        default: '#0075C9',
        contrastDefaultColor: 'light',
    });
    $mdThemingProvider.definePalette('flvsBlue', flvsBlue);

    const flvsOrange = $mdThemingProvider.extendPalette('deep-orange', {
        default: '#FC7D3C',
        contrastDefaultColor: 'light',
    });

    $mdThemingProvider.definePalette('flvsOrange', flvsOrange);

    // For the prototype purposes, make everything grey for now.
    $mdThemingProvider.theme('default')
        .primaryPalette('flvsBlue')
        .accentPalette('flvsOrange')
        .warnPalette('flvsOrange')
        .backgroundPalette('grey');
});


// Configuration for the textAngular WYSIWYG editor from
// https://kielczewski.eu/2016/09/text-angular-with-angular-material/
app.config(['$provide', ($provide) => {
    $provide.decorator('taOptions', ['$delegate', (taOptions) => {
        taOptions.forceTextAngularSanitize = true;
        taOptions.keyMappings = [];
        taOptions.toolbar = [
            /* For reference, here are all the allowed values.
            ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['html', 'insertImage', 'insertLink']
            */
            ['bold', 'italics', 'underline', 'ul', 'ol', 'pre', 'quote', 'undo', 'redo', 'clear', 'insertLink'],
        ];
        taOptions.classes = {
            focussed: '',
            toolbar: 'ta-toolbar',
            toolbarGroup: 'ta-button-group',
            toolbarButton: '',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'ta-text-editor',
            htmlEditor: 'md-input',
        };
        return taOptions;
    }]);
    $provide.decorator('taTools', ['$delegate', (taTools) => {
        taTools.h1.display = '<md-button aria-label="Heading 1">H1</md-button>';
        taTools.h2.display = '<md-button aria-label="Heading 2">H2</md-button>';
        taTools.h3.display = '<md-button aria-label="Heading 3">H3</md-button>';
        taTools.p.display = '<md-button aria-label="Paragraph">P</md-button>';
        taTools.pre.display = '<md-button aria-label="Pre">pre</md-button>';
        taTools.quote.display = '<md-button class="md-icon-button" aria-label="Quote"><md-icon md-font-set="material-icons">format_quote</md-icon></md-button>';
        taTools.bold.display = '<md-button class="md-icon-button" aria-label="Bold"><md-icon md-font-set="material-icons">format_bold</md-icon></md-button>';
        taTools.italics.display = '<md-button class="md-icon-button" aria-label="Italic"><md-icon md-font-set="material-icons">format_italic</md-icon></md-button>';
        taTools.underline.display = '<md-button class="md-icon-button" aria-label="Underline"><md-icon md-font-set="material-icons">format_underlined</md-icon></md-button>';
        taTools.ul.display = '<md-button class="md-icon-button" aria-label="Buletted list"><md-icon md-font-set="material-icons">format_list_bulleted</md-icon></md-button>';
        taTools.ol.display = '<md-button class="md-icon-button" aria-label="Numbered list"><md-icon md-font-set="material-icons">format_list_numbered</md-icon></md-button>';
        taTools.undo.display = '<md-button class="md-icon-button" aria-label="Undo"><md-icon md-font-set="material-icons">undo</md-icon></md-button>';
        taTools.redo.display = '<md-button class="md-icon-button" aria-label="Redo"><md-icon md-font-set="material-icons">redo</md-icon></md-button>';
        taTools.justifyLeft.display = '<md-button class="md-icon-button" aria-label="Align left"><md-icon md-font-set="material-icons">format_align_left</md-icon></md-button>';
        taTools.justifyRight.display = '<md-button class="md-icon-button" aria-label="Align right"><md-icon md-font-set="material-icons">format_align_right</md-icon></md-button>';
        taTools.justifyCenter.display = '<md-button class="md-icon-button" aria-label="Align center"><md-icon md-font-set="material-icons">format_align_center</md-icon></md-button>';
        taTools.justifyFull.display = '<md-button class="md-icon-button" aria-label="Justify"><md-icon md-font-set="material-icons">format_align_justify</md-icon></md-button>';
        taTools.clear.display = '<md-button class="md-icon-button" aria-label="Clear formatting"><md-icon md-font-set="material-icons">format_clear</md-icon></md-button>';
        taTools.html.display = '<md-button class="md-icon-button" aria-label="Show HTML"><md-icon md-font-set="material-icons">code</md-icon></md-button>';
        taTools.insertLink.display = '<md-button class="md-icon-button" aria-label="Insert link"><md-icon md-font-set="material-icons">insert_link</md-icon></md-button>';
        taTools.insertImage.display = '<md-button class="md-icon-button" aria-label="Insert photo"><md-icon md-font-set="material-icons">insert_photo</md-icon></md-button>';
        return taTools;
    }]);
}]);
