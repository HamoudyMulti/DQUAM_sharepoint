var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var CNID = parseInt(window.location.search.split("=")[1]);
var arrRelatedToValues = ["People", "Process", "Place", "Provisions", "Product", "Promotions", "Profits"];
var arrIncidentSeverity = [1, 2, 3, 4, 5];
var arrEffectedParty = [];
var arrEffectedPartiesLength = 0;

$(document).ready(function() {
    GetIncidentDetails();
    $('#personTimeOfReporting').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
    });
    $('#dateOfOccurence').flatpickr();   
    $('#timeOfOccurence').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
    });
    $('#personDateOfReporting').flatpickr();
    GetIncidentPartyDetails();
    
    $('#navAnalysis').attr('href', 'https://mgskw.sharepoint.com/sites/DQ/Pages/My-incident-analysis-and-fact-finding.aspx?CNID='+CNID)
    $('#navHistory').attr('href', 'https://mgskw.sharepoint.com/sites/DQ/Pages/Incident-history.aspx?CNID='+CNID)
    $('#navCorrActions').attr('href', 'https://mgskw.sharepoint.com/sites/DQ/Pages/Incident-corrective-actions.aspx?CNID='+CNID);
    $('#pageTitle')[0].innerHTML = "My Incident Details"
})

function GetIncidentDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incidents')/items?$filter=ID eq "+CNID+"&$select=ID,SendBackReason,Title,Incident_Description,Stage,Status,DPI_Department,Date_Of_Occurence,Time_Of_Occurence,Incident_Prevented,Immediate_Actions,Incident_Description,Requester_Incident_Severity,DPI_Job_Position,DPI_Related_To,DPI_Date_Of_Reporting,DPI_Time_Of_Reporting,Incident_Type/Type_Description,DPI_Name/Title,IR_Incident_Reason/Reason_Description,Location/Location_Description&$expand=Incident_Type/ID,DPI_Name/ID,IR_Incident_Reason/ID,Location/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var relatedToHtml = '';
            var severityHtml = '';
            var preventedHtml = '';
            var arrIncident = data.d.results;
            var arrReasonDescription = [];
            arrIncident[0].IR_Incident_Reason.results.map(item => arrReasonDescription.push(item.Reason_Description));
            var arrLocationDescription = [];
            arrIncident[0].Location.results.map(item => arrLocationDescription.push(item.Location_Description));
            console.log("GA_Incident Item", arrIncident);
            $('#sendBackReason')[0].innerHTML = arrIncident[0].SendBackReason
            $('#personName').val(arrIncident[0].DPI_Name.Title);
            $('#personDepartment').val(arrIncident[0].DPI_Department);
            $('#personJob').val(arrIncident[0].DPI_Job_Position);
            $('#personDateOfReporting').val(new Date(arrIncident[0].DPI_Date_Of_Reporting).format('yyyy/MM/dd'));
            $('#personTimeOfReporting').val(arrIncident[0].DPI_Time_Of_Reporting);
            $('#dateOfOccurence').val(new Date(arrIncident[0].Date_Of_Occurence).format('yyyy/MM/dd'));
            $('#timeOfOccurence').val(arrIncident[0].Time_Of_Occurence);
            $('#incidentPrevented').val(arrIncident[0].Incident_Prevented);
            $('#immediateAction').val(arrIncident[0].Immediate_Actions);
            $('#incidentDescription').val(arrIncident[0].Incident_Description);
            for(var i=0;i<arrRelatedToValues.length;i++) {
                if(arrRelatedToValues[i] == arrIncident[0].DPI_Related_To) {
                    relatedToHtml += `<option value="${arrIncident[0].DPI_Related_To}" selected="selected">${arrIncident[0].DPI_Related_To}</option>`
                } else {
                    relatedToHtml += `<option value="${arrRelatedToValues[i]}">${arrRelatedToValues[i]}</option>`
                }
            }
            $('#personRelatedTo').html(relatedToHtml);
            for(var i=0;i<arrIncidentSeverity.length;i++) {
                if(arrIncidentSeverity[i] == arrIncident[0].Requester_Incident_Severity) {
                    severityHtml += `<option value="${arrIncident[0].Requester_Incident_Severity}" selected="selected">${arrIncident[0].Requester_Incident_Severity}</option>`
                } else {
                    severityHtml += `<option value="${arrIncidentSeverity[i]}">${arrIncidentSeverity[i]}</option>`
                }
            }
            $('#incidentSeverity').html(severityHtml);
            for(var i=0;i<["Yes", "No", "Unsure"].length;i++) {
                if(["Yes", "No", "Unsure"][i] == arrIncident[0].Incident_Prevented) {
                    preventedHtml += `<option value="${arrIncident[0].Incident_Prevented}" selected="selected">${arrIncident[0].Incident_Prevented}</option>`
                } else {
                    preventedHtml += `<option value="${["Yes", "No", "Unsure"][i]}">${["Yes", "No", "Unsure"][i]}</option>`
                }
            }
            $('#incidentPrevented').html(preventedHtml);
            $.ajax({
                url: siteUrl + "/_api/web/lists/getbytitle('GA_Incident_Type')/items",
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    var arrIncidentsType = data.d.results;
                    var incidentTypeHtml = '';
                    for(var i=0;i<arrIncidentsType.length;i++) {
                        if(arrIncidentsType[i].Type_Description == arrIncident[0].Incident_Type.Type_Description) {
                            incidentTypeHtml += `<option value="${arrIncidentsType[i].ID}" selected="selected">${arrIncidentsType[i].Type_Description}</option>`
                        } else {
                            incidentTypeHtml += `<option value="${arrIncidentsType[i].ID}">${arrIncidentsType[i].Type_Description}</option>`
                        }
                    }
                    $('#incidentType').html(incidentTypeHtml);
                    console.log("Incident Type", arrIncidentsType);
                    // $('#incidentType').val(arrIncident[0].Incident_Type.Type_Description);
                    $.ajax({
                        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incident_Reason')/items",
                        method: "GET",
                        async: false,
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var arrIncidentsReason = data.d.results;
                            var incidentReasonHtml = '';
                            for(var i=0;i<arrIncidentsReason.length;i++) {
                                if(arrReasonDescription.includes(arrIncidentsReason[i].Reason_Description)) {
                                    incidentReasonHtml += `<option value="${arrIncidentsReason[i].ID}" selected="selected">${arrIncidentsReason[i].Reason_Description}</option>`
                                } else {
                                    incidentReasonHtml += `<option value="${arrIncidentsReason[i].ID}">${arrIncidentsReason[i].Reason_Description}</option>`
                                }
                            }
                            $('#incidentReason').html(incidentReasonHtml);
                            console.log("Incident Reason", arrIncidentsReason);
                            // $('#incidentType').val(arrIncident[0].Incident_Type.Type_Description);
                            $.ajax({
                                url: siteUrl + "/_api/web/lists/getbytitle('GA_Location')/items",
                                method: "GET",
                                async: false,
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var arrIncidentsLocation = data.d.results;
                                    var incidentLocationHtml = '';
                                    for(var i=0;i<arrIncidentsLocation.length;i++) {
                                        if(arrLocationDescription.includes(arrIncidentsLocation[i].Location_Description)) {
                                            incidentLocationHtml += `<option value="${arrIncidentsLocation[i].ID}" selected="selected">${arrIncidentsLocation[i].Location_Description}</option>`
                                        } else {
                                            incidentLocationHtml += `<option value="${arrIncidentsLocation[i].ID}">${arrIncidentsLocation[i].Location_Description}</option>`
                                        }
                                    }
                                    $('#incidentLocation').html(incidentLocationHtml);
                                    console.log("Incident Location", arrIncidentsLocation);
                                    // $('#incidentType').val(arrIncident[0].Incident_Type.Type_Description);
                                },
                                error: function(error) {
                                    console.log(error.responseText)
                                }
                            })
                        },
                        error: function(error) {
                            console.log(error.responseText)
                        }
                    })
                },
                error: function(error) {
                    console.log(error.responseText)
                }
            });
            $.ajax({
                url: siteUrl + "/_api/web/lists/GetByTitle('GA_Incidents_Documents')/items?$filter=GA_Incidents_ItemId eq "+CNID+"&$select=Title,ID,EncodedAbsUrl,LinkFilename&$top=5000",
                type: "GET",
                headers: {
                    accept: 'application/json'
                },
                success: function(data){
                    console.log('Documents', data.value);
                    $('#numberOfFiles')[0].innerHTML = data.value.length + " files";
                    for(var i=0; i<data.value.length; i++) {
                        $('#incidentFiles').append(`<div class="border p-2 rounded-3 d-flex bg-white dark__bg-1000 fs--1 m-2">
                            <span class="fs-1 fas fa-file"></span>
                            <span class="ms-2 me-3">${data.value[i].LinkFilename}</span>
                            <a class="text-300 ms-auto" target="_blank" href="${data.value[i].EncodedAbsUrl}" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Open" data-bs-original-title="Open">
                                <span class="fas fa-arrow-right"></span>
                            </a>
                        </div>`)
                    }
                },
                error: function(data, error, err, errorCode, errorMessage){
                    console.log(data)
                    console.log(error)
                    console.log(err)
                    console.log(errorCode)
                    console.log(errorMessage)
                }
            });
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetIncidentPartyDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incidents_Effected_Parties')/items?$filter=Incident_Parent_ID eq "+CNID+"&$select=ID,Incident_Parent_ID,IE_Type,Consequence,Effected_Parties/Name,Effected_Parties/ID&$expand=Effected_Parties/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_Incident_Effected_Party', data.d.results);
            $('#incidentTableBody').html('');
            var arrEffectedParties = data.d.results;
            arrEffectedPartiesLength = data.d.results.length;
            // arrEffectedParty = data.d.results;
            for(var i=0; i<arrEffectedParties.length; i++) {
                $('#incidentTableBody').append(`<tr id="${i+1}">
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="incidentEffectParty${i+1}">
                            <option value="${arrEffectedParties[i].Effected_Parties.ID}" selected="selected">${arrEffectedParties[i].Effected_Parties.Name}</option>
                        </select>
                    </td>
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="incidentEffectType${i+1}">
                            <option value="${arrEffectedParties[i].IE_Type}" selected="selected">${arrEffectedParties[i].IE_Type}</option>
                            <option value="${arrEffectedParties[i].IE_Type == "Internal" ? "External" : "Internal"}">${arrEffectedParties[i].IE_Type == "Internal" ? "External" : "Internal"}</option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control form-control-style-cursor minw-150" disabled="true" type="text" id="incidentEffectConsequence${i+1}" value="${arrEffectedParties[i].Consequence}" placeholder="Consequence" />
                    </td>
                    <td class="text-center" id="lastTD${i+1}">
                        <div id="add${i+1}">
                            <button class="btn btn-link p-0" type="button" data-bs-toggle="tooltip" data-bs-placement="top" onclick="BindEditEffectParty(${i+1})"
                                title="Edit">
                                <span class="fas fa-edit text-primary-emphasis"></span>
                            </button>
                            <button class="btn btn-link p-0 ms-2" type="button" data-bs-toggle="tooltip" onclick="BindDeleteEffectPartyInList(${arrEffectedParties[i].ID})"
                                data-bs-placement="top" title="Delete">
                                <span class="fas fa-trash text-danger"></span>
                            </button>
                        </div>
                        <div id="update${i+1}">
                            <button class="btn btn-dquam-success btn-sm minw-80" type="button" onclick="UpdateEffectedPartyInList(${i},${arrEffectedParties[i].ID})">
                                <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Update
                            </button>
                        </div>
                    </td>
                </tr>`)
                $(`#update${i+1}`).hide();
            }

            for(var i = 0; i<arrEffectedParty.length; i++) {
                $('#incidentTableBody').append(`<tr id="${i+1+arrEffectedParties.length}">
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="incidentEffectParty${i+1+arrEffectedParties.length}">
                            <option value="${arrEffectedParty[i].Effected_Parties.ID}" selected="selected">${arrEffectedParty[i].Effected_Parties.Name}</option>
                        </select>
                    </td>
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="incidentEffectType${i+1+arrEffectedParties.length}">
                            <option value="${arrEffectedParty[i].IE_Type}" selected="selected">${arrEffectedParty[i].IE_Type}</option>
                            <option value="${arrEffectedParty[i].IE_Type == "Internal" ? "External" : "Internal"}">${arrEffectedParty[i].IE_Type == "Internal" ? "External" : "Internal"}</option>
                    </select>
                    </td>
                    <td>
                        <input class="form-control form-control-style-cursor minw-150" disabled="true" id="incidentEffectConsequence${i+1+arrEffectedParties.length}" type="text" value="${arrEffectedParty[i].Consequence}" placeholder="Consequence" />
                    </td>
                    <td class="text-center" id="lastTD${i+1+arrEffectedParties.length}">
                        <div id="add${i+1+arrEffectedParties.length}">
                            <button class="btn btn-link p-0" type="button" data-bs-toggle="tooltip" data-bs-placement="top" onclick="BindEditEffectParty(${i+1+arrEffectedParties.length})"
                                title="Edit">
                                <span class="fas fa-edit text-primary-emphasis"></span>
                            </button>
                            <button class="btn btn-link p-0 ms-2" type="button" data-bs-toggle="tooltip" onclick="BindDeleteEffectParty(${arrEffectedParty[i].Id})"
                                data-bs-placement="top" title="Delete">
                                <span class="fas fa-trash text-danger"></span>
                            </button>
                        </div>
                        <div id="update${i+1+arrEffectedParties.length}">
                            <button class="btn btn-dquam-success btn-sm minw-80" type="button" onclick="UpdateEffectedParty(${i+arrEffectedParties.length})">
                                <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Update
                            </button>
                        </div>
                    </td>
                </tr>`)
                $(`#update${i+1+arrEffectedParties.length}`).hide();
            }

            $('#incidentTableBody').append(`<tr>
                <td class="text-center">
                    <select class="form-select minw-150" id="incidentEffectParty">
                        <option value="" selected="">select party</option>
                    </select>
                </td>
                <td>
                    <select class="form-select minw-150" id="incidentEffectType">
                        <option value="" selected="">select type</option>
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                    </select>
                </td>
                <td class="text-center">
                    <input class="form-control form-control-style-cursor minw-150" type="text" id="incidentEffectConsequence" placeholder="consequence...">
                </td>
                <td class="text-center">
                    <button class="btn btn-dquam-success btn-sm minw-80" type="button" id="addNew" onclick="AddEffectedParty()">
                        <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Add
                    </button>
                </td>
            </tr>`)
            $('#addNew').show();

            $.ajax({
                url: siteUrl + "/_api/web/lists/getbytitle('GA_External_Parties')/items",
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    var arrEffectExternalParty = data.d.results
                    var dropdownHtml = '';
                    for(var i =0; i<arrEffectExternalParty.length; i++) {
                        dropdownHtml += `<option value="${arrEffectExternalParty[i].ID}">${arrEffectExternalParty[i].Name}</option>`
                    }
                    $('#incidentEffectParty').append(dropdownHtml);
                },
                error:function (error) {
                    console.log(error)
                }
            })
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function AddEffectedParty() {
    if($('#incidentEffectParty').val().trim() != "" && $('#incidentEffectType').val().trim() != "" && $('#incidentEffectConsequence').val().trim() != "") {
        var objEffectedParty = {
            Effected_Parties: {
                Name:$('#incidentEffectParty :selected').text(),
                ID:$('#incidentEffectParty').val()
            },
            IE_Type:$('#incidentEffectType').val(),
            Consequence:$('#incidentEffectConsequence').val(),
            Id:arrEffectedParty.length+1
        }

        arrEffectedParty.push(objEffectedParty)
        GetIncidentPartyDetails();
    } else {
        alert('Cannot add a blank field!');
    }
}

function BindEditEffectParty( Id ) {
    $(`#incidentEffectParty${Id}`).attr("disabled", false);
    $(`#incidentEffectType${Id}`).attr("disabled", false);
    $(`#incidentEffectConsequence${Id}`).attr("disabled", false);

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_External_Parties')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var arrEffectPary = data.d.results
            var dropdownHtml = `<option value="${$('#incidentEffectParty'+Id).val()}" selected="${$('#incidentEffectParty'+Id).val()}">${$('#incidentEffectParty'+Id+' :selected').text()}</option>`;
            for(var i =0; i<arrEffectPary.length; i++) {
                if($('#incidentEffectParty'+Id+' :selected').text().trim() != arrEffectPary[i].Name) {
                    dropdownHtml += `<option value="${arrEffectPary[i].ID}">${arrEffectPary[i].Name}</option>`
                }
            }
            $('#incidentEffectParty'+Id).html('');
            $(`#incidentEffectParty${Id}`).append(dropdownHtml);
            $(`#add${Id}`).hide();
            $(`#update${Id}`).show();
            $('#addNew').hide();
        },
        error:function (error) {
            console.log(error)
        }
    })
}

function UpdateEffectedParty(Id) {
    arrEffectedParty[Id-arrEffectedPartiesLength].Effected_Parties.ID = $(`#incidentEffectParty${Id+1}`).val();
    arrEffectedParty[Id-arrEffectedPartiesLength].Effected_Parties.Name = $(`#incidentEffectParty${Id+1} :selected`).text();
    arrEffectedParty[Id-arrEffectedPartiesLength].IE_Type = $(`#incidentEffectType${Id+1}`).val();
    arrEffectedParty[Id-arrEffectedPartiesLength].Consequence = $(`#incidentEffectConsequence${Id+1}`).val();

    $(`#incidentEffectParty${Id+1}`).attr("disabled", true);
    $(`#incidentEffectType${Id+1}`).attr("disabled", true);
    $(`#incidentEffectConsequence${Id+1}`).attr("disabled", true);

    GetIncidentPartyDetails();
}

function UpdateEffectedPartyInList(Id, ItemID) {
    $(`#incidentEffectParty${Id+1}`).attr("disabled", true);
    $(`#incidentEffectType${Id+1}`).attr("disabled", true);
    $(`#incidentEffectConsequence${Id+1}`).attr("disabled", true);

    $.ajax({  
        url: siteUrl + "/_api/web/lists/getByTitle('GA_Incidents_Effected_Parties')/items(" + ItemID +")",  
        type: "POST",          
        headers:   
        {   
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
             "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val()  
        },  
         data: JSON.stringify({  
         "__metadata":  
            {  
              "type": "SP.Data.GA_x005f_Incidents_x005f_Effected_x005f_PartiesListItem"  
            },  
            "Effected_PartiesId": parseInt($(`#incidentEffectParty${Id+1}`).val()),
            "IE_Type": $(`#incidentEffectType${Id+1}`).val(),  
            "Consequence": $(`#incidentEffectConsequence${Id+1}`).val()
        }),  
        success: function(data, status, xhr)   
        {   
            console.log("Updated Item" + ItemID);
            GetIncidentPartyDetails();
        },   
        error: function(error)   
        {   
            console.log(error.responseText);  
        }   
    }); 
}

function BindDeleteEffectParty( Id ) {
    arrEffectedParty = arrEffectedParty.filter(item => item.Id !== Id)
    GetIncidentPartyDetails();
}

function BindDeleteEffectPartyInList( ItemID ) {
    $.ajax({  
        url: siteUrl + "/_api/web/lists/getByTitle('GA_External_Parties')/items(" + ItemID +")",  
        type: "DELETE",  
        headers: {  
            Accept: "application/json;odata=verbose"  
        },  
        async: false,  
        success: function(data) {  
            alert("Item Deleted successfully");  
            GetIncidentPartyDetails();
        },  
        eror: function(error) {  
            console.log(error.responseText);  
        }  
    });
}

function SubmitIncident() {

    if($('#dateOfOccurrence').val() == "") {
        alert('Please select Date of Occurance');
        return false;
    }
    else if($('#timeOfOccurence').val() == "") {
        alert('Please select Time of Occurance');
        return false;
    }
    else if($('#personDepartment').val() == "") {
        alert('Please enter Department');
        return false;
    }
    else if($('#personJob').val() == "") {
        alert('Please enter Job Title');
        return false;
    }
    else if($('#personDateOfReporting').val() == "") {
        alert('Please select Reporting Date');
        return false;
    }
    else if($('#personTimeOfReporting').val() == "") {
        alert('Please select Reporting Time');
        return false;
    }
    else if($('#incidentType').val().trim() == "") {
        alert('Please select Incident Type');
        return false;
    } else if($('#incidentLocation').val() == []) {
        alert('Please select Location');
        return false;
    } else if($('#incidentReason').val() == []) {
        alert('Please select Reason');
        return false;
    } else if($('#incidentPrevented').val() == "") {
        alert('Please select Prevention');
        return false;
    } else if($('#immediateAction').val() == "") {
        alert('Please enter Immediate Actions');
        return false;
    } else if($('#incidentDescription').val() == "") {
        alert('Please enter Incident Description');
        return false;
    } else if($('#personRelatedTo').val() == "") {
        alert('Please enter Related To on previous form');
        return false;
    }
    $('#submitForm').attr('disabled', true);

    var obj = JSON.stringify({
        '__metadata': {  
            'type': 'SP.Data.GA_x005f_IncidentsListItem'  
        },
        "Date_Of_Occurence": new Date($('#dateOfOccurrence').val()),
        "Time_Of_Occurence":$('#timeOfOccurence').val(),
        "Incident_TypeId":parseInt($('#incidentType').val()),
        "LocationId":{ "results":$('#incidentLocation').val().map(item => parseInt(item)) },
        "IR_Incident_ReasonId":{ "results": $('#incidentReason').val().map(item => parseInt(item)) },
        "Requester_Incident_Severity":$('#incidentNewSeverity').val(),
        "Incident_Prevented":$('#incidentPrevented').val(),
        "Immediate_Actions":$('#immediateAction').val(),
        "Incident_Description":$('#incidentDescription').val(),
        "DPI_Related_To": $('#personRelatedTo').val(),
        // "DPI_NameId": _spPageContextInfo.userId,
        "DPI_Date_Of_Reporting": new Date($('#personDateOfReporting').val()),
        "DPI_Time_Of_Reporting": $('#personTimeOfReporting').val(),
        "DPI_Job_Position": $('#personJob').val(),
        "DPI_Department": $('#personDepartment').val(),
        "Status":0
    })

    var headers = {
        "Accept": "application/json;odata=verbose",  
        "Content-Type": "application/json;odata=verbose",  
        "IF-MATCH": "*",  
        "X-HTTP-Method": "MERGE",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val() 
    }

    $.ajax({  
        url: siteUrl + "/_api/web/lists/GetByTitle('GA_Incidents')/items("+CNID+")",  
        method: "POST",  
        async: false,
        data: obj,  
        headers: headers,  
        success: function(data) {
            if($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length > 0) {
                uploadFile(CNID); 
            }
            if(arrEffectedParty.length > 0) {
                for(var i=0; i<arrEffectedParty.length;i++) {
                    var tableObj = JSON.stringify({
                        '__metadata': {  
                            'type': 'SP.Data.GA_x005f_Incidents_x005f_Effected_x005f_PartiesListItem'  
                        },
                        "Effected_PartiesId":parseInt(arrEffectedParty[i].Effected_Parties.ID),
                        "IE_Type":arrEffectedParty[i].IE_Type,
                        "Consequence":arrEffectedParty[i].Consequence,
                        "Incident_Parent_ID": parseInt(CNID)
                    })

                    var tableHeaders = {
                        "accept": "application/json;odata=verbose",   
                        "content-type": "application/json;odata=verbose",  
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    }

                    $.ajax({  
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GA_Incidents_Effected_Parties')/items",  
                        method: "POST",  
                        async: false,
                        data: tableObj,
                        headers: tableHeaders,  
                        success: function(data) {  
                            console.log("Item " +(i+1)+ " created successfully");
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    })
                }
            }

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.Incident_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":$('#incidentDescription').val(),
                "Action":"Incident updated",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Incident_Approver_History')/items",  
                method: "POST",  
                async: false,
                data: historyObj,  
                headers: historyHeaders,  
                success: function(data) {
                    console.log('History created successfully!')
                },
                error: function(error) {
                    console.log(error)
                }
            });

            alert("Incident updated successfully");
            
            $('#submitForm').attr('disabled', false);

            if($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length == 0) {
                window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/Incident-logs.aspx' 
            }
        },  
        error: function(error) {  
            console.log(JSON.stringify(error));  

        }

    })
}

function uploadFile(MainItemID) {
    // Define the folder path for this example.
    var serverRelativeUrlToFolder = 'GA_Incidents_Documents';
  
    // Get test values from the file input and text input page controls.
    var fileInput = $('input[name="file"]');
    var newName = '';
    var fileParts = [];
  
    // Get the server URL.
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
  
    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var filesUploaded = 0;
    for(var i=0;i<$('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length;i++) {
        var getFile = getFileBuffer(i);
        getFile.done(function (arrayBuffer, i) {
          // Add the file to the SharePoint folder.
          var addFile = addFileToFolder(arrayBuffer, MainItemID, i);
          addFile.done(function (file, status, xhr) {
            // Get the list item that corresponds to the uploaded file.
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            getItem.done(function (listItem, status, xhr) {
              // Change the display name and title of the list item.
              var changeItem = updateListItem(listItem.d.__metadata, MainItemID);
              changeItem.done(function (data, status, xhr) {
                // alert('file uploaded and updated');
                filesUploaded++;
                if($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length == filesUploaded){  
                    window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/My-incident-details-readonly.aspx?CNID='+CNID
                }
              });
              changeItem.fail(onError);
            });
            getItem.fail(onError);
          });
          addFile.fail(onError);
        });
        getFile.fail(onError);
    }
  
    // Get the local file as an array buffer.
    function getFileBuffer(i) {
      var deferred = jQuery.Deferred();
      var reader = new FileReader();
      reader.onloadend = function (e) {
        deferred.resolve(e.target.result, i);
      }
      reader.onerror = function (e) {
        deferred.reject(e.target.error);
      }
      reader.readAsArrayBuffer($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles()[i]);
      return deferred.promise();
    }
  
    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer, MainItemID, i) {
      // Get the file name from the file input control on the page.
      //var parts = fileInput[0].value.split('\\');
      var fileName = $('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles()[i].name;
    //   var fileName = parts[parts.length - 1];
      fileParts = fileName.split('.');
      newName = fileParts[0];
  
      // Construct the endpoint.
      var fileCollectionEndpoint = String.format(
              "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
              "/add(overwrite=true, url='{2}')",
              serverUrl, serverRelativeUrlToFolder, "File"+newName+"-"+MainItemID+"."+fileParts[1]);
  
      // Send the request and return the response.
      // This call returns the SharePoint file.
      return jQuery.ajax({
          url: fileCollectionEndpoint,
          type: "POST",
          data: arrayBuffer,
          processData: false,
          headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
          }
      });
    }
  
    // Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
    function getListItem(fileListItemUri) {
      // Send the request and return the response.
      return jQuery.ajax({
        url: fileListItemUri,
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" }
      });
    }
  
    // Change the display name and title of the list item.
    function updateListItem(itemMetadata, MainItemID) {
      // Define the list item changes. Use the FileLeafRef property to change the display name.
      // For simplicity, also use the name as the title.
      // The example gets the list item type from the item's metadata, but you can also get it from the
      // ListItemEntityTypeFullName property of the list.
      var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}', 'GA_Incidents_ItemId':{3}}}",
          itemMetadata.type, "File_"+newName+"-"+MainItemID, "File_"+newName+"-"+MainItemID+"."+fileParts[1], MainItemID);
  
      // Send the request and return the promise.
      // This call does not return response content from the server.
      return $.ajax({
          url: itemMetadata.uri,
          type: "POST",
          data: body,
          headers: {
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
            "content-type": "application/json;odata=verbose",
            "IF-MATCH": itemMetadata.etag,
            "X-HTTP-Method": "MERGE"
          }
      });
    }
  }
  
  // Display error messages.
  function onError(error) {
    alert(error.responseText);
  }