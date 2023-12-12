var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var allIncidents = [];
var hackerList;
var arrExpertsName = [];

$(document).ready(function() {
    GetIncidentExperts();
    GetIncidentsList();
      
    $('#pageTitle')[0].innerHTML = "Incidents Log"
    $('#searchSecurity').on('change', function() {
        if($('#searchStatus').val() == '' && $('#searchDepartment').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents);
        } else if($('#searchType').val() == '' && $('#searchStatus').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchStatus').val() == '' && $('#searchDepartment').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value));
        } else if($('#searchDepartment').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val()));
        } else if($('#searchDepartment').val() == '' && $('#searchStatus').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() == '' && $('#searchDepartment').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchDepartment').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.Stage == $('#searchStatus').val()));
        } else if($('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val() && item.Stage == $('#searchStatus').val()));
        } else if($('#searchDepartment').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() != '' && $('#searchDepartment').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if(this.value != '' && $('#searchDepartment').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() != '' && this.value != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchStatus').val() != '' && $('#searchDepartment').val() != '' && this.value != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchStatus').val() != '' && $('#searchDepartment').val() != '' && this.value != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == this.value && item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        }
    });

    $('#searchStatus').on('change', function() {
        if($('#searchSecurity').val() == '' && $('#searchDepartment').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents);
        } else if($('#searchDepartment').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchDepartment').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchType').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchDepartment').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value));
        } else if($('#searchSecurity').val() == '' && $('#searchDepartment').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchDepartment').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val() && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchDepartment').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchDepartment').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() != '' && this.value != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if(this.value != '' && $('#searchDepartment').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.DPI_Department == $('#searchDepartment').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if(this.value != '' && $('#searchDepartment').val() != '' && $('#searchSecurity').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.DPI_Department == $('#searchDepartment').val() && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if(this.value != '' && $('#searchDepartment').val() != '' && $('#searchSecurity').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == this.value && item.DPI_Department == $('#searchDepartment').val() && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        }
    });

    $('#searchDepartment').on('change', function() {
        if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents);
        } else if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value));
        } else if($('#searchStatus').val() == '' && $('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchType').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val()));
        } else if($('#searchStatus').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Stage == $('#searchStatus').val()));
        } else if($('#searchStatus').val() == '' && $('#searchType').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchType').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchStatus').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if(this.value != '' && $('#searchStatus').val() != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() != '' && this.value != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && this.value != '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && this.value != '' && $('#searchType').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val() && item.Incident_Type.Type_Description == $('#searchType').val()));
        }
    });

    $('#searchType').on('change', function() {
        if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '' && $('#searchDepartment').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents);
        } else if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '' && $('#searchDepartment').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value));
        } else if($('#searchStatus').val() == '' && $('#searchDepartment').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchStatus').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchDepartment').val() == '' && $('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchStatus').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() == '' && $('#searchDepartment').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Stage == $('#searchStatus').val()));
        } else if($('#searchStatus').val() == '' && $('#searchDepartment').val() == '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchDepartment').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.Requester_Incident_Severity == $('#searchSecurity').val()));
        } else if($('#searchStatus').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() == '' && this.value == '') {
            BindListTableHTML(allIncidents.filter(item => item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && $('#searchDepartment').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if(this.value != '' && $('#searchStatus').val() != '' && $('#searchDepartment').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() != '' && this.value != '' && $('#searchDepartment').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.DPI_Department == $('#searchDepartment').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && this.value != '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val()));
        } else if($('#searchSecurity').val() != '' && $('#searchStatus').val() != '' && this.value != '' && $('#searchDepartment').val() != '') {
            BindListTableHTML(allIncidents.filter(item => item.Incident_Type.Type_Description == this.value && item.Requester_Incident_Severity == $('#searchSecurity').val() && item.Stage == $('#searchStatus').val() && item.DPI_Department == $('#searchDepartment').val()));
        }
    });
})

function GetIncidentExperts() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incident_Experts')/items?$filter=isActive eq 1&$select=ID,isActive,Expert_Name/Title&$expand=Expert_Name/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log("All Incident Experts", data.d.results);
            data.d.results.map(item => arrExpertsName.push(item.Expert_Name.Title));
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetIncidentsList() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incidents')/items?$select=ID,Title,Incident_Description,Incident_ID,Stage,Status,DPI_Department,Date_Of_Occurence,Requester_Incident_Severity,Author/Title,Incident_Type/Type_Description&$expand=Incident_Type/ID,Author/ID&$orderby=ID desc",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            allIncidents = data.d.results;
            console.log("All Incidents", allIncidents);
            BindListTableHTML(allIncidents);
            var options = {
                valueNames: [
                    'id',
                    'status',
                    'department',
                    'incidentType',
                    'incidentDate',
                    'securityLevel'
                ],
                page:5,
                pagination:true
            };
              
            hackerList = new List('tableIncidentssLog', options);
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function BindListTableHTML(arrIncidents) {
    var html = '';
    var progressBarValue = 0;
    var progressBarColorClass = '';
    var progressBarColorValue = '';
    var statusValue = '';
    var nextPageUrl = '';
    for(var i=0; i<arrIncidents.length; i++) {
        var analysisCompleted = false;
        if(arrIncidents[i].Requester_Incident_Severity == 1) {
            progressBarValue = 20;
            progressBarColorClass = 'bg-success';
            progressBarColorValue = '';
        } else if(arrIncidents[i].Requester_Incident_Severity == 2) {
            progressBarValue = 40;
            progressBarColorClass = '';
            progressBarColorValue = '; background-color: #ffcc00;';
        } else if(arrIncidents[i].Requester_Incident_Severity == 3) {
            progressBarValue = 60;
            progressBarColorClass = '';
            progressBarColorValue = '; background-color: #ffa200;';
        } else if(arrIncidents[i].Requester_Incident_Severity == 4) {
            progressBarValue = 80;
            progressBarColorClass = '';
            progressBarColorValue = '; background-color: #ff6927;'
        } else if(arrIncidents[i].Requester_Incident_Severity == 5) {
            progressBarValue = 100;
            progressBarColorClass = 'bg-danger';
            progressBarColorValue = ''
        }

        $.ajax({
            url: siteUrl + "/_api/web/lists/getbytitle('GA_Incident_Expert_Findings')/items?$filter=Incident_ID eq "+arrIncidents[i].ID,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if(data.d.results.length > 0) {
                    if(data.d.results[0].Case_Description.length > 0) {
                        analysisCompleted = true
                    }
                }
            },  
            error: function(error) {  
                console.log(JSON.stringify(error));  
            }
        })

        if(arrExpertsName.includes(_spPageContextInfo.userDisplayName) && analysisCompleted) {
            nextPageUrl = "/sites/DQ/Pages/Incident-corrective-actions.aspx?CNID="+arrIncidents[i].ID
        } else if(arrExpertsName.includes(_spPageContextInfo.userDisplayName)) {
            nextPageUrl = "/sites/DQ/Pages/My-incident-analysis-and-fact-finding.aspx?CNID="+arrIncidents[i].ID
        } else if(arrIncidents[i].Author.Title == _spPageContextInfo.userDisplayName) {
            nextPageUrl = "/sites/DQ/Pages/My-incident-details.aspx?CNID="+arrIncidents[i].ID
        } else {
            nextPageUrl = "/sites/DQ/Pages/My-incident-details-readonly.aspx?CNID="+arrIncidents[i].ID
        }

        if(arrIncidents[i].Status == 0) {
            statusValue = "Pending with expert"
        } else if(arrIncidents[i].Status == 1) {
            statusValue = 'Analysis done'
        } else if(arrIncidents[i].Status == 9) {
            statusValue = 'Send back'
        }

        html += `<tr>
            <td class="id">${arrIncidents[i].Incident_ID}</td>
            <td>
                <span class="d-inline-block text-truncate maxw-250" data-bs-toggle="tooltip" data-bs-placement="top" title="${arrIncidents[i].Incident_Description}">
                    ${arrIncidents[i].Incident_Description}
                </span>
            </td>
            <td class="status text-center">
                <span class="badge rounded badge-subtle-info p-2 minw-80">${statusValue}</span>
            </td>
            <td class="department text-center">${arrIncidents[i].DPI_Department}</td>
            <td class="incidentType text-center">${arrIncidents[i].Incident_Type.Type_Description}</td>
            <td class="incidentDate text-center">${new Date(arrIncidents[i].Date_Of_Occurence).format('yyyy/MM/dd')}</td>
            <td class="securityLevel text-center">
                <div class="row g-2 align-items-center justify-content-center">
                    <div class="col-auto">
                        <div class="progress" style="height: 5px; width: 60px" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar ${progressBarColorClass}" style="width: ${progressBarValue}%${progressBarColorValue}"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        ${arrIncidents[i].Requester_Incident_Severity}
                    </div>
                </div>
            </td>
            <td class="text-center">
                <div class="btn-group font-sans-serif position-static">
                    <button class="btn btn-link btn-sm text-600 dropdown-toggle actionsDropdownbutton" type="button" onclick="OpenCloseDropdown(${arrIncidents[i].ID})" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">
                        <span class="fas fa-ellipsis-h fs--1"></span>
                    </button>
                    <div class="dropdown-menu actions-menu" id="actionsDropdown${arrIncidents[i].ID}">
                        <a class="dropdown-item" href='${nextPageUrl}'>View</a>
                        <a class="dropdown-item text-danter" href="#" onclick="DeleteIncidentRecord(${arrIncidents[i].ID})">Delete</a>
                    </div>
                </div>
            </td>
        </tr>`
    }
    $('#incidentsTableBody').html(html);

    var options = {
        valueNames: [
            'id',
            'status',
            'department',
            'incidentType',
            'incidentDate',
            'securityLevel'
        ],
        page:5,
        pagination:true
    };
      
    hackerList = new List('tableIncidentssLog', options);
}

function OpenCloseDropdown(Id) {
    for(var i=0;i<$('.actions-menu').length;i++) {
        if($('.actions-menu')[i].id == `actionsDropdown${Id}`) {
            if($(`#actionsDropdown${Id}`).hasClass('show')) {
                $(`#actionsDropdown${Id}`).removeClass('show')
            } else {
                $(`#actionsDropdown${Id}`).addClass('show');
            }   
        } else {
            $(`#actionsDropdown${$('.actions-menu')[i].id.charAt($('.actions-menu')[i].id.length-1)}`).removeClass('show')
        }
    }
}

function DeleteIncidentRecord(Id) {
    $.ajax({
        url: webURL + "/_api/web/lists/GetByTitle('GA_Incidents')/items("+Id+")",
        type: "POST",
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-Http-Method": "DELETE",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "If-Match": "*"
        },
        success: function(data) {
            alert('item deleted');
            GetIncidentsList();
        },
        error: function(data) {
        //Log error and perform further activity upon error/exception
        }
    });
}