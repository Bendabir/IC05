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


// Function that "hide" and "show" properly the "All", "CS" and "TM" buttons
function filterType_CS_TM_Buttons_ShowAndHide (filter) {
    switch (filter) {
        case 'CS' :
            if ( $('#node_category_CS').hasClass('btn-flat') ) {
                $('#node_category_CS').removeClass('btn-flat');
            }
            if ( !$('#node_category_TM').hasClass('btn-flat') ) {
                $('#node_category_TM').addClass('btn-flat');
            }
            if ( !$('#node_category_All').hasClass('btn-flat') ) {
                $('#node_category_All').addClass('btn-flat');
            }
            break;

        case 'TM' :
            if ( $('#node_category_TM').hasClass('btn-flat') ) {
                $('#node_category_TM').removeClass('btn-flat');
            }
            if ( !$('#node_category_CS').hasClass('btn-flat') ) {
                $('#node_category_CS').addClass('btn-flat');
            }
            if ( !$('#node_category_All').hasClass('btn-flat') ) {
                $('#node_category_All').addClass('btn-flat');
            }
            break;

        case 'All' :
            if ( $('#node_category_All').hasClass('btn-flat') ) {
                $('#node_category_All').removeClass('btn-flat');
            }
            if ( !$('#node_category_TM').hasClass('btn-flat') ) {
                $('#node_category_TM').addClass('btn-flat');
            }
            if ( !$('#node_category_CS').hasClass('btn-flat') ) {
                $('#node_category_CS').addClass('btn-flat');
            }
            break;

        default :
            break;
    }
}


// Function that "hide" and "show" properly the buttons used to filter the graph by branch
function filterBranchButtons_ShowAndHide (filter) {
    // "Hide" all buttons by adding the "btn-flat" class (no need to test if the component already has the class, jQuery do not duplicate

    branchs.forEach(function (code) {
        $('#node_branch_' + code).addClass('btn-flat');
        $('#node_branch_' + code).removeClass(branchColor[code]); // remove color to the one previously "active" by removing to all
    });

    // To hide the "All" button by adding the "btn-flat"
    $('#node_branch_All').addClass('btn-flat');

    // "Show" the button just clicked by removing the "btn-flat" class
    $('#node_branch_' + filter).removeClass('btn-flat');
    // Add it's color to it
    $('#node_branch_' + filter).addClass(branchColor[filter]);
}
// ===========================================================================================
// Specify a categorie CS or TM in order to filter the nodes
// ===========================================================================================

$('#node_category_TM').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('TM');
    applyCategoryFilter('TM');
});

$('#node_category_CS').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('CS');
    applyCategoryFilter('CS');
});

$('#node_category_All').click(function(){
    filterType_CS_TM_Buttons_ShowAndHide('All');
    applyCategoryFilter('All');
});




// ===========================================================================================
// Specify a branch in order to filter the nodes
// ===========================================================================================
$('#node_branch_All').click(function(){
    filterBranchButtons_ShowAndHide('All');
    applyBranchFilter('All');
});
$('#node_branch_TC').click(function(){
    filterBranchButtons_ShowAndHide('TC');
    applyBranchFilter('TC');
});
$('#node_branch_GI').click(function(){
    filterBranchButtons_ShowAndHide('GI');
    applyBranchFilter('GI');
});
$('#node_branch_GM').click(function(){
    filterBranchButtons_ShowAndHide('GM');
    applyBranchFilter('GM');
});
$('#node_branch_GSM').click(function(){
    filterBranchButtons_ShowAndHide('GSM');
    applyBranchFilter('GSM');
});
$('#node_branch_GB').click(function(){
    filterBranchButtons_ShowAndHide('GB');
    applyBranchFilter('GB');
});
$('#node_branch_GSU').click(function(){
    filterBranchButtons_ShowAndHide('GSU');
    applyBranchFilter('GSU');
});
$('#node_branch_GP').click(function(){
    filterBranchButtons_ShowAndHide('GP');
    applyBranchFilter('GP');
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
