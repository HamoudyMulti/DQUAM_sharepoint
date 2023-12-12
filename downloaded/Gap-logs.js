var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var allGAPs = [];
var arrGAPHandlers = []

$(document).ready(function() {
    GetGapHandler()
    GetGAPsList()
    $('#pageTitle')[0].innerHTML = "GAP Logs"

    $('#stageFilter').on('change', function() {
        if(this.value == '') {
            BindListTableHTML(allGAPs);
        } else {
            BindListTableHTML(allGAPs.filter(item => item.GAP_Stage == this.value))
        }
    });
})

function GetGapHandler() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Handlers')/items?$filter=isActive eq 1&$select=*,GAP_Handler/Title,GAP_Handler/EMail,GAP_Handler/ID&$expand=GAP_Handler/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log("GAP Hanlders",data.d.results)
            data.d.results.map(item => arrGAPHandlers.push(item.GAP_Handler.EMail));
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetGAPsList() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAPs')/items?$select=*,Frequency_ID/ID,Frequency_ID/Frequency_Description,Author/Title,Author/EMail,Priority_ID/ID,Priority_ID/Priority_Description,Driver_ID/ID,Driver_ID/Driver_Name,Related_Policy/ID,Related_Policy/Request_title,Related_Procedure/ID,Related_Procedure/Request_title,Related_Incident/ID,Related_Incident/Incident_ID,GAP_Status_ID/ID,GAP_Status_ID/GAP_Status_Description&$expand=Frequency_ID/ID,Author/ID,Priority_ID/ID,Driver_ID/ID,Related_Policy/ID,Related_Procedure/ID,Related_Incident/ID,GAP_Status_ID/ID&$orderby=ID desc",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            allGAPs = data.d.results;
            console.log("All GAPs", allGAPs);
            BindListTableHTML(allGAPs);
            var options = {
                valueNames: [
                    'id',
                    'statement',
                    'status',
                    'driver',
                    'improvementBasket',
                    'lastActionBy',
                    'stage'
                ],
                page:5,
                pagination:true
            };
              
            hackerList = new List('tableGAPsLog', options);
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function BindListTableHTML(arrGAPs) {
    var html = '';
    var progressBarValue = 0;
    var progressBarColorClass = '';
    var progressBarColorValue = '';
    var statusValue = '';
    var stageValue = ''
    var nextPageUrl = '';
    for(var i=0; i<arrGAPs.length; i++) {
        if(arrGAPs[i].GAP_Stage == 1) {
            progressBarValue = 25;
            progressBarColorClass = '';
            progressBarColorValue = '#00d27a';
            stageValue = 'New'
        } else if(arrGAPs[i].GAP_Stage == 2) {
            progressBarValue = 50;
            progressBarColorClass = '';
            progressBarColorValue = '#ffa200';
            stageValue = 'Approved'
        } else if(arrGAPs[i].GAP_Stage == 3) {
            progressBarValue = 75;
            progressBarColorClass = '';
            progressBarColorValue = '#2a7be4';
            stageValue = 'Analysis done'
        } else if(arrGAPs[i].GAP_Stage == 6) {
            progressBarValue = 100;
            progressBarColorClass = '';
            progressBarColorValue = '#7e55a4'
            stageValue = 'Plan Assigned'
        } else if(arrGAPs[i].GAP_Stage == 0) {
            progressBarValue = 5;
            progressBarColorClass = '';
            progressBarColorValue = 'red'
            stageValue = 'Send back'
        }

        if(arrGAPHandlers.includes(_spPageContextInfo.userDisplayName)) {
            nextPageUrl = "/sites/DQ/Pages/Gap-Details-New.aspx?CNID="+arrGAPs[i].ID
        } else if(arrGAPs[i].Author.Title == _spPageContextInfo.userDisplayName) {
            nextPageUrl = "/sites/DQ/Pages/Gap-Details-New.aspx?CNID="+arrGAPs[i].ID
        } else {
            nextPageUrl = "/sites/DQ/Pages/Gap-Details-New.aspx?CNID="+arrGAPs[i].ID
        }

        if(arrGAPs[i].Status == 0) {
            statusValue = "Pending with expert"
        } else if(arrGAPs[i].Status == 1) {
            statusValue = 'Analysis done'
        } else if(arrGAPs[i].Status == 9) {
            statusValue = 'Send back'
        }

        html += `<tr>
            <td class="id">${arrGAPs[i].GAP_ID}</td>
            <td>
                <span class="d-inline-block text-truncate maxw-250" data-bs-toggle="tooltip" data-bs-placement="top" title="${arrGAPs[i].GAP_Statement}">
                    ${arrGAPs[i].GAP_Statement}
                </span>
            </td>
            <td class="status text-center">
                <span class="badge rounded badge-subtle-info p-2 minw-80">${arrGAPs[i].GAP_Status_ID.GAP_Status_Description}</span>
            </td>
            <td class="driver text-center">${arrGAPs[i].Driver_ID.Driver_Name}</td>
            <td class="improvementBasket text-center">${'Improvement Basket'}</td>
            <td class="lastActionBy text-center">${arrGAPs[i].Author.Title}</td>
            <td class="stage text-center">
                <div class="d-flex align-items-center gap-2">
                    <div style="--falcon-circle-progress-bar:${progressBarValue}">
                        <svg class="circle-progress-svg" width="26" height="26" viewBox="0 0 120 120">
                            <circle class="progress-bar-rail" cx="60" cy="60" r="54" fill="none" stroke-linecap="round"
                                stroke-width="12"></circle>
                            <circle class="progress-bar-top" cx="60" cy="60" r="54" fill="none" stroke-linecap="round" stroke="${progressBarColorValue}"
                                stroke-width="12"></circle>
                        </svg>
                    </div>
                    <h6 class="mb-0 text-700">${stageValue}</h6>
                </div>
            </td>
            <td class="text-center">
                <div class="btn-group font-sans-serif position-static">
                    <button class="btn btn-link btn-sm text-600 dropdown-toggle actionsDropdownbutton" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">
                        <span class="fas fa-ellipsis-h fs--1"></span>
                    </button>
                    <div class="dropdown-menu actions-menu" id="actionsDropdown${arrGAPs[i].ID}">
                        <a class="dropdown-item" href='${nextPageUrl}'>View</a>
                        <a class="dropdown-item text-danter" href="#" onclick="DeleteGAPRecord(${arrGAPs[i].ID})">Delete</a>
                    </div>
                </div>
            </td>
        </tr>`
    }
    $('#gapsTableBody').html(html);

    var options = {
        valueNames: [
            'id',
            'statement',
            'status',
            'driver',
            'improvementBasket',
            'lastActionBy',
            'stage'
        ],
        page:5,
        pagination:true
    };
      
    hackerList = new List('tableGapsLog', options);
}

function DeleteGAPRecord(Id) {
    $.ajax({
        url: webURL + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+Id+")",
        type: "POST",
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-Http-Method": "DELETE",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "If-Match": "*"
        },
        success: function(data) {
            alert('GAP deleted');
            GetGAPsList();
        },
        error: function(data) {
        //Log error and perform further activity upon error/exception
        }
    });
}