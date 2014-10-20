/**
 * Created by mattmehalso on 10/20/14.
 */
// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    //TODO : Callbacks for future buttons - Pages, Check API Now, Delete Entries, etc.
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/history/results', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.dateTime + '</td>';
            tableContent += '<td>' + (this.isFailure ? 'FAILURE' : 'SUCCESS') + '</td>';
            tableContent += '<td>' + this.message + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#resultList table tbody').html(tableContent);
    });
};
