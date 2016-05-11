var branchColor = {
        'TC' : 'green darken-2',
        'GI' : 'blue',
        'GM' : 'deep-purple accent-1',
        'GSM' : 'deep-purple accent-1',
        'GSU' : 'pink lighten-2',
        'GP' : 'orange',
        'GB' : 'light-green accent-4',
        'All' : ''
    };
var branchs = ['TC', 'GI', 'GM', 'GSM', 'GSU', 'GP', 'GB'];
var categories = ['CS', 'TM'];
var classColorForResetFilterButton = 'blue-grey lighten-3';


// ===========================================================================================
//                           Functions used in this file
// ===========================================================================================


// Function that "hide" and "show" properly the "All", "CS" and "TM" buttons
function filterType_CS_TM_Buttons_ShowAndHide (filter) {
    // add btn-flat class to all buttons
    categories.forEach(function (code) {
        $('#node_category_' + code).addClass('btn-flat');
    });

    if (filter == 'All') { // enlever la "décoloration"
        $('#node_category_All').removeClass(classColorForResetFilterButton);
    }
    else { // ajouter la "décoloration"
        $('#node_category_All').addClass(classColorForResetFilterButton);
    }
    // remove btn-flat class to the button clicked
    $('#node_category_' + filter).removeClass('btn-flat');
}


// Function that "hide" and "show" properly the buttons used to filter the graph by branch
function filterBranchButtons_ShowAndHide (filter) {
    // "Hide" all buttons by adding the "btn-flat" class (no need to test if the component already has the class, jQuery do not duplicate
    branchs.forEach(function (code) {
        $('#node_branch_' + code).addClass('btn-flat');
        $('#node_branch_' + code).removeClass(branchColor[code]); // remove color to the one previously "active" by removing to all
    });

    // To hide the "All" button by adding the "btn-flat"
    if (filter == 'All') { // enlever la "décoloration"
        $('#node_branch_All').removeClass(classColorForResetFilterButton);
    }
    else { // ajouter la "décoloration"
        $('#node_branch_All').addClass(classColorForResetFilterButton);
    }

    // "Show" the button just clicked by removing the "btn-flat" class
    $('#node_branch_' + filter).removeClass('btn-flat');
    // Add it's color to it
    $('#node_branch_' + filter).addClass(branchColor[filter]);
}






// ===========================================================================================
//              Collapse or expand all in the left menu
// ===========================================================================================

// Collapse all in left menu
$('#left_menu_collapse_all').click(function(){
    var menu_visualisation_header = $('#menu_visualisation_header');
    var menu_filtres_header = $('#menu_filtres_header');
    var menu_parcours_header = $('#menu_parcours_header');

    if (collapsibleOpen('menu_visualisation_header')) {
        menu_visualisation_header.click();
    }
    if (collapsibleOpen('menu_filtres_header')) {
        menu_filtres_header.click();
    }
    if (collapsibleOpen('menu_parcours_header')) {
        menu_parcours_header.click();
    }
});

// Expand all in left menu
$('#left_menu_expand_all').click(function(){
    var menu_visualisation_header = $('#menu_visualisation_header');
    var menu_filtres_header = $('#menu_filtres_header');
    var menu_parcours_header = $('#menu_parcours_header');

    if (!collapsibleOpen('menu_visualisation_header')) {
        menu_visualisation_header.click();
    }
    if (!collapsibleOpen('menu_filtres_header')) {
        menu_filtres_header.click();
    }
    if (!collapsibleOpen('menu_parcours_header')) {
        menu_parcours_header.click();
    }
});



// ===========================================================================================
//              Collapse or expand all in the right menu
// ===========================================================================================

// Collapse all in right menu
$('#right_menu_collapse_all').click(function(){
    var menu_infos_header = $('#menu_infos_header');
    var menu_details_parcours_header = $('#menu_details_parcours_header');

    if (collapsibleOpen('menu_infos_header')) {
        menu_infos_header.click();
    }
    if (collapsibleOpen('menu_details_parcours_header')) {
        menu_details_parcours_header.click();
    }
});

// Expand all in right menu
$('#right_menu_expand_all').click(function(){
    var menu_infos_header = $('#menu_infos_header');
    var menu_details_parcours_header = $('#menu_details_parcours_header');

    if (!collapsibleOpen('menu_infos_header')) {
        menu_infos_header.click();
    }
    if (!collapsibleOpen('menu_details_parcours_header')) {
        menu_details_parcours_header.click();
    }
});



// ===========================================================================================
//              Specify a categorie CS or TM in order to filter the nodes
// ===========================================================================================

$('#node_category_TM').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('TM');
    applyCategoryFilter(activeGraph, 'TM', true);
});

$('#node_category_CS').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('CS');
    applyCategoryFilter(activeGraph, 'CS', true);
});

$('#node_category_All').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('All');
    applyCategoryFilter(activeGraph, 'All', true);
});




// ===========================================================================================
//                      Specify a branch in order to filter the nodes
// ===========================================================================================
$('#node_branch_All').click(function(){
    filterBranchButtons_ShowAndHide('All');
    applyBranchFilter(activeGraph, 'All');
});
$('#node_branch_TC').click(function(){
    filterBranchButtons_ShowAndHide('TC');
    applyBranchFilter(activeGraph, 'TC');
});
$('#node_branch_GI').click(function(){
    filterBranchButtons_ShowAndHide('GI');
    applyBranchFilter(activeGraph, 'GI');
});
$('#node_branch_GM').click(function(){
    filterBranchButtons_ShowAndHide('GM');
    applyBranchFilter(activeGraph, 'GM');
});
$('#node_branch_GSM').click(function(){
    filterBranchButtons_ShowAndHide('GSM');
    applyBranchFilter(activeGraph, 'GSM');
});
$('#node_branch_GB').click(function(){
    filterBranchButtons_ShowAndHide('GB');
    applyBranchFilter(activeGraph, 'GB');
});
$('#node_branch_GSU').click(function(){
    filterBranchButtons_ShowAndHide('GSU');
    applyBranchFilter(activeGraph, 'GSU');
});
$('#node_branch_GP').click(function(){
    filterBranchButtons_ShowAndHide('GP');
    applyBranchFilter(activeGraph, 'GP');
});


// ===========================================================================================
// Work on the colors of the branch buttons in order to make them match with the graph colors
// ===========================================================================================

// Branch TC
$('#node_branch_TC').mouseover(function (e) {
    $('#node_branch_TC').addClass(branchColor['TC']);
});
$('#node_branch_TC').mouseleave(function (e) {
    if ($('#node_branch_TC').hasClass('btn-flat')) {
        $('#node_branch_TC').removeClass(branchColor['TC']);
    }
});
// Branch GI
$('#node_branch_GI').mouseover(function (e) {
    $('#node_branch_GI').addClass(branchColor['GI']);
});
$('#node_branch_GI').mouseleave(function (e) {
    if ($('#node_branch_GI').hasClass('btn-flat')) {
        $('#node_branch_GI').removeClass(branchColor['GI']);
    }
});
// Branch GM
$('#node_branch_GM').mouseover(function (e) {
    $('#node_branch_GM').addClass(branchColor['GM']);
});
$('#node_branch_GM').mouseleave(function (e) {
    if ($('#node_branch_GM').hasClass('btn-flat')) {
        $('#node_branch_GM').removeClass(branchColor['GM']);
    }
});
// Branch GSM
$('#node_branch_GSM').mouseover(function (e) {
    $('#node_branch_GSM').addClass(branchColor['GSM']);
});
$('#node_branch_GSM').mouseleave(function (e) {
    if ($('#node_branch_GSM').hasClass('btn-flat')) {
        $('#node_branch_GSM').removeClass(branchColor['GSM']);
    }
});
// Branch GSU
$('#node_branch_GSU').mouseover(function (e) {
    $('#node_branch_GSU').addClass(branchColor['GSU']);
});
$('#node_branch_GSU').mouseleave(function (e) {
    if ($('#node_branch_GSU').hasClass('btn-flat')) {
        $('#node_branch_GSU').removeClass(branchColor['GSU']);
    }
});
// Branch GB
$('#node_branch_GB').mouseover(function (e) {
    $('#node_branch_GB').addClass(branchColor['GB']);
});
$('#node_branch_GB').mouseleave(function (e) {
    if ($('#node_branch_GB').hasClass('btn-flat')) {
        $('#node_branch_GB').removeClass(branchColor['GB']);
    }
});
// Branch GP
$('#node_branch_GP').mouseover(function (e) {
    $('#node_branch_GP').addClass(branchColor['GP']);
});
$('#node_branch_GP').mouseleave(function (e) {
    if ($('#node_branch_GP').hasClass('btn-flat')) {
        $('#node_branch_GP').removeClass(branchColor['GP']);
    }
});



// ===========================================================================================
//                          Specify the user's UVs
// ===========================================================================================


$('#visibility-me').change(function(){
    showUserUVs(activeGraph, true);
});
$('#visibility-all').change(function(){
    showUserUVs(activeGraph, false);
});