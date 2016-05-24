// Generate a number of star icons according to the grade
function generateStars(grade){
    var maxGrade = 10,
        minGrade = 0,
        ratio = 2,
        stars = '';

    if(grade >= minGrade && grade <= maxGrade){
        // Converting the grade out of 5
        grade = Math.round(grade);
        grade /= ratio;

        // Generating icons
        stars += '<i class="material-icons">star</i>'.repeat(grade);
        stars += '<i class="material-icons">star_half</i>'.repeat(Math.round(grade - Math.floor(grade)));
        stars += '<i class="material-icons">star_border</i>'.repeat(Math.floor(maxGrade / ratio - grade));
    }

    return stars;
}

// Generate template with UV information
function uvMessage (selectedNode, uvwebData) {
    uvwebData.desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia augue sed tellus luctus, a cursus enim suscipit. Phasellus laoreet blandit arcu fringilla tincidunt. Proin sit amet euismod magna. Cras luctus at arcu sed vehicula. Fusce ut ex molestie, bibendum turpis eget, congue tortor. Nulla sed sapien et justo faucibus mattis. Vestibulum blandit justo ac nisi lacinia tristique. Pellentesque eros lorem, facilisis a risus eget, porttitor interdum tellus. Proin sagittis lacus eu tellus pulvinar mattis.';

    var message = '<li class="collection-item">';
    message +=	'<div class="row">';
    message +=	'<div class="col s6 center-align">';
    message +=	'<b>Note sur <a href="https://assos.utc.fr/uvweb/uv/' + selectedNode.id + '" target="_blank">UVWeb</a></b><br>';
    message +=	'<div>' + (uvwebData.note ? generateStars(parseFloat(uvwebData.note)) : 'Note indisponible') + '</div>';
    message +=	'</div>';
    message +=	'<div class="col s6 center-align">';
    message +=	'<b>Taux de réussite</b><br />';
    message +=	'<div>00,00% </div>';
    message +=	'</div>';
    message +=	'</div>';
    message +=	'</div>';
    message +=	'</li>';
    message += '<li class="collection-item text-justify">' + uvwebData.desc.replace(/^(.{500}[^\s]*).*/, "$1") + '... <a href="#">Lire la suite</a></li>';
    message +=	'<li class="collection-item">';
    message +=	'<div class="row">';
    message +=	'<div class="col s3 center-align">';
    message +=	'<i class="material-icons">class</i><br><div>' + selectedNode.attributes.Cat + '</div>';
    message +=	'</div>';
    message +=	'<div class="col s3 center-align">';
    message +=	'<i class="material-icons">school</i><br><div>' + selectedNode.attributes.nbCredits + ' ECTS</div>';
    message +=	'</div>';
    message += '<div class="col s3 center-align">';
    message +=	'<i class="material-icons">group</i><br><div>Effectif</div>';
    message +=	'</div>';
    message +=	'<div class="col s3 center-align"><i class="material-icons">access_time</i><br><div>Semestre</div>';
    message +=	'</div>';
    message +=	'</div>';
    message +=	'</li>';
    message +=	'<li class="collection-item center-align">';
    message += '<button class="btn">Ajouter à mon parcours</button>';
    message +=	'</li>';

    return message;
}

function changeInfobox (aGraph) {
    var activeState = aGraph.graphPlugins.activeState;
    
    var message;
    var selectedNode = activeState.nodes()[activeState.nodes().length - 1];

    if (selectedNode.attributes.Type === 'UV'){
        // Setting UV name and a loader
        $('#right-menu-infoUV ul.collection').empty();
        $('#right-menu-infoUV ul.collection').append('<li class="collection-item center-align"><h5>' + selectedNode.id + ' - ' + selectedNode.attributes.nomUV + '</h5></li>');
        $('#right-menu-infoUV ul.collection').append('<li class="collection" id="uv-progress"><div class="progress"><div class="indeterminate"></div></div></li>');

        $.ajax('uvweb?uv=' + selectedNode.id, {
            success: function (uvwebData) {
                $('#uv-progress').remove();
                message = uvMessage(selectedNode, uvwebData);
                $('#right-menu-infoUV ul.collection').innerHTML = '<li class="collection-item center-align"><h5>' + selectedNode.id + ' - ' + selectedNode.attributes.nomUV + '</h5></li>';
                $('#right-menu-infoUV ul.collection').append(message);
                $('#right-menu').show();
            },
            error: function () {
                $('#uv-progress').remove();
                message = uvMessage(selectedNode);
                $('#right-menu-infoUV ul.collection').append(message);
                $('#right-menu').show();
            }
        });
    }
    else{
        $('#right-menu').hide();
        $('#right-menu-infoUV ul.collection').empty();
    }
}
