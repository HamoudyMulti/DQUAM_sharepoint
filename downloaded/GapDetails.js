var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var CNID = parseInt(window.location.search.split("=")[1]);
var arrGapHandler = []
var arrSingleGAP = []
var arrEffectedGap = []
var arrAnalyzeGap = []

$(document).ready(function() {
    GetGapHandlers()
    GetaGapDetails();
    GetGapEffectDetails();
    GetGapEvidenceDocuments();
    FillDropDowns()
    BindGAPEffectDetails();

    $('#pageTitle')[0].innerHTML = "GAP Details"
    $('#tabHistory').attr('href', '/sites/DQ/Pages/Gap-History.aspx?CNID='+CNID)
    initializePeoplePicker('assignPlanPerson')

});

function GetGapHandlers() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Handlers')/items?$filter=isActive eq 1&$select=*,GAP_Handler/Title,GAP_Handler/EMail,GAP_Handler/ID&$expand=GAP_Handler/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log("GAP Hanlders",data.d.results)
            data.d.results.map(item => arrGapHandler.push(item.GAP_Handler.EMail));
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetGapAnalysisDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Analysis')/items?$filter=GAP_Parent_ID eq "+CNID+"&$select=*,GA_Improvement_Basket/Title,First_Why_Driver/Driver_Name,Second_Why_Driver/Driver_Name,Third_Why_Driver/Driver_Name,Fourth_Why_Driver/Driver_Name,Fifth_Why_Driver/Driver_Name&$expand=GA_Improvement_Basket/ID,First_Why_Driver/ID,Second_Why_Driver/ID,Third_Why_Driver/ID,Fourth_Why_Driver/ID,Fifth_Why_Driver/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var whyHTML = '';
            console.log("GAP Analysis",data.d.results)
            $('#readImprovementBasket').html(data.d.results[0].GA_Improvement_Basket.Title)

            if(data.d.results[0].Fifth_Why != null) {
                whyHTML = `<tr><td>Why 1</td><td>${data.d.results[0].First_Why}</td><td>${data.d.results[0].First_Why_Driver.Driver_Name}</td></tr><tr><td>Why 2</td><td>${data.d.results[0].Second_Why}</td><td>${data.d.results[0].Second_Why_Driver.Driver_Name}</td></tr><tr><td>Why 3</td><td>${data.d.results[0].Third_Why}</td><td>${data.d.results[0].Third_Why_Driver.Driver_Name}</td></tr><tr><td>Why 4</td><td>${data.d.results[0].Fourth_Why}</td><td>${data.d.results[0].Fourth_Why_Driver.Driver_Name}</td></tr><tr><td>Why 5</td><td>${data.d.results[0].Fifth_Why}</td><td>${data.d.results[0].Fifth_Why_Driver.Driver_Name}</td></tr>`
            } else if(data.d.results[0].Fourth_Why != null) {
                whyHTML = `<tr><td>Why 1</td><td>${data.d.results[0].First_Why}</td><td>${data.d.results[0].First_Why_Driver.Driver_Name}</td></tr><tr><td>Why 2</td><td>${data.d.results[0].Second_Why}</td><td>${data.d.results[0].Second_Why_Driver.Driver_Name}</td></tr><tr><td>Why 3</td><td>${data.d.results[0].Third_Why}</td><td>${data.d.results[0].Third_Why_Driver.Driver_Name}</td></tr><tr><td>Why 4</td><td>${data.d.results[0].Fourth_Why}</td><td>${data.d.results[0].Fourth_Why_Driver.Driver_Name}</td></tr>`
            } else if(data.d.results[0].Third_Why != null) {
                whyHTML = `<tr><td>Why 1</td><td>${data.d.results[0].First_Why}</td><td>${data.d.results[0].First_Why_Driver.Driver_Name}</td></tr><tr><td>Why 2</td><td>${data.d.results[0].Second_Why}</td><td>${data.d.results[0].Second_Why_Driver.Driver_Name}</td></tr><tr><td>Why 3</td><td>${data.d.results[0].Third_Why}</td><td>${data.d.results[0].Third_Why_Driver.Driver_Name}</td></tr>`
            } else if(data.d.results[0].Second_Why != null) {
                whyHTML = `<tr><td>Why 1</td><td>${data.d.results[0].First_Why}</td><td>${data.d.results[0].First_Why_Driver.Driver_Name}</td></tr><tr><td>Why 2</td><td>${data.d.results[0].Second_Why}</td><td>${data.d.results[0].Second_Why_Driver.Driver_Name}</td></tr>`
            } else if(data.d.results[0].First_Why != null) {
                whyHTML = `<tr><td>Why 1</td><td>${data.d.results[0].First_Why}</td><td>${data.d.results[0].First_Why_Driver.Driver_Name}</td></tr>`
            }

            $('#readAnalyzeTBody').append(whyHTML)

        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetaGapDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAPs')/items?$filter=ID eq "+CNID+"&$select=*,Frequency_ID/Frequency_Description,Priority_ID/Priority_Description,Driver_ID/Driver_Name,GAP_Effect_ID/GAP_Effect_Description,GAP_Status_ID/GAP_Status_Description,Related_Policy/Request_title,Related_Procedure/Request_title,Related_Incident/Incident_ID&$expand=Frequency_ID,Priority_ID,Driver_ID,GAP_Effect_ID,GAP_Status_ID,Related_Policy,Related_Procedure,Related_Incident",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

            arrSingleGAP = data.d.results

            if(arrGapHandler.includes(_spPageContextInfo.userEmail) && data.d.results[0].GAP_Stage == 1) {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('#sendBack').show()
                $('#approveButton').show()
                $('#approveButtonDiv').show()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').hide()
                $('#analysisDiv').hide()
            } else if(data.d.results[0].AuthorId == _spPageContextInfo.userId && data.d.results[0].GAP_Stage == 0) {
                $('.data-edit').addClass('active')
                $('.data-view').removeClass('active')
                $('#updateButtonDiv').show()
                $('#approveButtonDiv').hide()
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#analysisDiv').hide()
                $('#assignPlanButtonDiv').hide()
            } else if(arrGapHandler.includes(_spPageContextInfo.userEmail) && data.d.results[0].GAP_Stage == 2) {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#approveButtonDiv').hide()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').show()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').hide()
                $('#analysisDiv').hide()
            } else if(arrGapHandler.includes(_spPageContextInfo.userEmail) && data.d.results[0].GAP_Stage == 3) {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('.data-analysis-edit').removeClass('active')
                $('.data-analysis-view').addClass('active')
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#approveButtonDiv').hide()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').show()
                $('#analysisDiv').show()

                GetGapAnalysisDetails()
            } else if(arrGapHandler.includes(_spPageContextInfo.userEmail) && data.d.results[0].GAP_Stage == 5) {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('.data-analysis-edit').removeClass('active')
                $('.data-analysis-view').addClass('active')
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#approveButtonDiv').hide()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').hide()
                $('#analysisDiv').show()
                GetGapAnalysisDetails()
            } else if(data.d.results[0].GAP_Stage == 6 || data.d.results[0].GAP_Stage == 3) {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('.data-analysis-edit').removeClass('active')
                $('.data-analysis-view').addClass('active')
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#approveButtonDiv').hide()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').hide()
                $('#analysisDiv').show()
                GetGapAnalysisDetails()
            } else {
                $('.data-edit').removeClass('active')
                $('.data-view').addClass('active')
                $('#sendBack').hide()
                $('#approveButton').hide()
                $('#approveButtonDiv').hide()
                $('#updateButtonDiv').hide()
                $('#analyzeButtonDiv').hide()
                $('#completeAnalyzeButtonDiv').hide()
                $('#assignPlanButtonDiv').hide()
                $('#analysisDiv').hide()
            }

            console.log("Gaps ", data.d.results);
            var items = data.d.results[0];
            $("#gapIdentifier").val(items.Identifier);
            $("#txtIdentifier").html(items.Identifier);
            $("#gapDepartment").val(items.Related_Department);
            $("#txtDepartment").html(items.Related_Department);
            $("#explorationDate").val(new Date(items.Exploration_date.split("T")[0]).format('yyyy-MM-dd'));
            $("#txtExpDate").html(items.Exploration_date.split("T")[0]);
            $("#gapStatement").val(items.GAP_Statement);
            $("#txtStatement").html(items.GAP_Statement);
            $("#txtIdentification").html(items.Identification_method);
            $("#txtDriver").html(items.Driver_ID.Driver_Name);
            $("#txtFrequency").html(items.Frequency_ID.Frequency_Description);
            $("#txtPriority").html(items.Priority_ID.Priority_Description);
            $("#txtMainIdea").html(items.Main_Idea);
            $('#gapMainIdea').val(items.Main_Idea)
            for(var i=0;i<items.Related_Incident.results.length;i++) {
                $('#txtRelatedIncidents').append(`<span class="badge fs--1 badge-subtle-secondary text-600 px-3 mx-1">${items.Related_Incident.results[i].Incident_ID}</span>`)
            }

            for(var i=0;i<items.Related_Policy.results.length;i++) {
                $('#txtRelatedPolicy').append(`<span class="badge fs--1 badge-subtle-secondary text-600 px-3 mx-1">${items.Related_Policy.results[i].Request_title}</span>`)
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function BindGAPEffectDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Effects')/items?$filter=GAP_Parent_ID eq "+CNID+"&$select=*,GE_Effect_Catagory/ID,GE_Effect_Catagory/Effect_Catagory&$expand=GE_Effect_Catagory/ID",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_GAP_Effects', data.d.results);
            $('#tbodyGapEffectEdit').html('');
            var arrEffectedGaps = data.d.results;
            arrEffectedGapsLength = data.d.results.length;
            // arrEffectedGap = data.d.results;
            for(var i=0; i<arrEffectedGapsLength; i++) {
                $('#tbodyGapEffectEdit').append(`<tr id="${i+1}">
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="gapEffectCategory${i+1}">
                            <option value="${arrEffectedGaps[i].GE_Effect_Catagory.ID}" selected="selected">${arrEffectedGaps[i].GE_Effect_Catagory.Effect_Catagory}</option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control form-control-style-cursor minw-150" disabled="true" type="text" id="gapEffectDescription${i+1}" value="${arrEffectedGaps[i].GAP_Effect_Description}" placeholder="Description" />
                    </td>
                    <td class="text-center" id="lastTD${i+1}">
                        <div id="add${i+1}">
                            <button class="btn btn-link p-0" type="button" data-bs-toggle="tooltip" data-bs-placement="top" onclick="BindEditEffectParty(${i+1})"
                                title="Edit">
                                <span class="fas fa-edit text-primary-emphasis"></span>
                            </button>
                            <button class="btn btn-link p-0 ms-2" type="button" data-bs-toggle="tooltip" onclick="BindDeleteEffectPartyInList(${arrEffectedGaps[i].ID})"
                                data-bs-placement="top" title="Delete">
                                <span class="fas fa-trash text-danger"></span>
                            </button>
                        </div>
                        <div id="update${i+1}">
                            <button class="btn btn-dquam-success btn-sm minw-80" type="button" onclick="UpdateEffectedPartyInList(${i},${arrEffectedGaps[i].ID})">
                                <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Update
                            </button>
                        </div>
                    </td>
                </tr>`)
                $(`#update${i+1}`).hide();
            }

            for(var i = 0; i<arrEffectedGap.length; i++) {
                $('#tbodyGapEffectEdit').append(`<tr id="${i+1+arrEffectedGaps.length}">
                    <td class="text-center">
                        <select class="form-select minw-150" disabled="true" id="gapEffectCategory${i+1+arrEffectedGaps.length}">
                            <option value="${arrEffectedGap[i].effectCategory.Value}" selected="selected">${arrEffectedGap[i].effectCategory.Name}</option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control form-control-style-cursor minw-150" disabled="true" id="gapEffectDescription${i+1+arrEffectedGaps.length}" type="text" value="${arrEffectedGap[i].effectDescription}" placeholder="Description" />
                    </td>
                    <td class="text-center" id="lastTD${i+1+arrEffectedGaps.length}">
                        <div id="add${i+1+arrEffectedGaps.length}">
                            <button class="btn btn-link p-0" type="button" data-bs-toggle="tooltip" data-bs-placement="top" onclick="BindEditEffectParty(${i+1+arrEffectedGaps.length})"
                                title="Edit">
                                <span class="fas fa-edit text-primary-emphasis"></span>
                            </button>
                            <button class="btn btn-link p-0 ms-2" type="button" data-bs-toggle="tooltip" onclick="BindDeleteEffectParty(${arrEffectedGap[i].Id})"
                                data-bs-placement="top" title="Delete">
                                <span class="fas fa-trash text-danger"></span>
                            </button>
                        </div>
                        <div id="update${i+1+arrEffectedGaps.length}">
                            <button class="btn btn-dquam-success btn-sm minw-80" type="button" onclick="UpdateEffectedParty(${i+arrEffectedGaps.length})">
                                <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Update
                            </button>
                        </div>
                    </td>
                </tr>`)
                $(`#update${i+1+arrEffectedGaps.length}`).hide();
            }

            $('#tbodyGapEffectEdit').append(`
                <tr>
                    <td class="text-center">
                        <select class="form-select minw-150" id="effectCategory">
                            <option value="" selected="selected">select category</option>
                        </select>
                    </td>
                    <td>
                        <input class="form-control form-control-style-cursor minw-150" id="effectDescription" type="text" placeholder="type description..." />
                    </td>
                    <td class="text-center">
                        <button class="btn btn-dquam-success btn-sm minw-80" type="button" id="addNewGap" onclick="AddGapEffect()">
                            <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Add
                        </button>
                    </td>
                </tr>
            `)
            $('#addNewGap').show()

            $.ajax({
                url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Effect_Categories')/items",
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    console.log('GA_GAP_Effect_Categories', data.d.results);
                    var dropdownHtml = '';
                    for(var i=0;i<data.d.results.length;i++) {
                        dropdownHtml += `<option value="${data.d.results[i].ID}">${data.d.results[i].Effect_Catagory}</option>`
                    }
                    $('#effectCategory').append(dropdownHtml);
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
}

function AddGapEffect() {
    if($('#effectCategory').val().trim() == "") {
        alert('Please select Effect Category')
        return false
    } else if($('#effectDescription').val().trim() == "") {
        alert('Please enter Effect Description')
        return false
    }

    var obj = {
        effectCategory: {
            Name: $('#effectCategory :selected').text(),
            Value:$('#effectCategory').val()
        },
        effectDescription:$('#effectDescription').val(),
        Id:arrEffectedGap.length+1
    }

    arrEffectedGap.push(obj)
    BindGAPEffectDetails()
}

function BindEditEffectParty( Id ) {
    $(`#gapEffectCategory${Id}`).attr("disabled", false);
    $(`#gapEffectDescription${Id}`).attr("disabled", false);

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Effect_Categories')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var arrEffectCategoriesList = data.d.results
            var dropdownHtml = `<option value="${$('#gapEffectCategory'+Id).val()}" selected="${$('#gapEffectCategory'+Id).val()}">${$('#gapEffectCategory'+Id+' :selected').text()}</option>`;
            for(var i =0; i<arrEffectCategoriesList.length; i++) {
                if($('#gapEffectCategory'+Id+' :selected').text().trim() != arrEffectCategoriesList[i].Effect_Catagory) {
                    dropdownHtml += `<option value="${arrEffectCategoriesList[i].ID}">${arrEffectCategoriesList[i].Effect_Catagory}</option>`
                }
            }
            $('#gapEffectCategory'+Id).html('');
            $(`#gapEffectCategory${Id}`).append(dropdownHtml);
            $(`#add${Id}`).hide();
            $(`#update${Id}`).show();
            $('#addNew').hide();
        },
        error:function (error) {
            console.log(error)
        }
    })
}

function BindDeleteEffectPartyInList(Id) {
    $.ajax({  
        url: siteUrl + "/_api/web/lists/getByTitle('GA_GAP_Effects')/items(" + ItemID +")",  
        type: "DELETE",  
        headers: {  
            Accept: "application/json;odata=verbose"  
        },  
        async: false,  
        success: function(data) {  
            alert("GAP Effect Deleted successfully");  
            BindGAPEffectDetails();
        },  
        eror: function(error) {  
            console.log(error.responseText);  
        }  
    });
}

function BindDeleteEffectParty(Id) {
    arrEffectedGap = arrEffectedGap.filter(item => item.Id !== Id)
    BindGAPEffectDetails();
}

function UpdateEffectedPartyInList(Id, ItemID) {
    $(`#gapEffectCategory${Id+1}`).attr("disabled", true);
    $(`#gapEffectDescription${Id+1}`).attr("disabled", true);

    $.ajax({  
        url: siteUrl + "/_api/web/lists/getByTitle('GA_GAP_Effects')/items(" + ItemID +")",  
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
              "type": "SP.Data.GA_x005f_GAP_x005f_EffectsListItem"  
            },  
            "GE_Effect_CatagoryId": parseInt($(`#gapEffectCategory${Id+1}`).val()),
            "GAP_Effect_Description": $(`#gapEffectDescription${Id+1}`).val()  
        }),  
        success: function(data, status, xhr)   
        {   
            console.log("Updated Item" + ItemID);
            BindGAPEffectDetails();
        },   
        error: function(error)   
        {   
            console.log(error.responseText);  
        }   
    }); 
}


function UpdateEffectedParty(Id) {
    arrEffectedGap[Id-arrEffectedGapsLength].effectCategory.Value = $(`#gapEffectCategory${Id+1}`).val();
    arrEffectedGap[Id-arrEffectedGapsLength].effectCategory.Name = $(`#gapEffectCategory${Id+1} :selected`).text();
    arrEffectedGap[Id-arrEffectedGapsLength].effectDescription = $(`#gapEffectDescription${Id+1}`).val();

    $(`#gapEffectCategory${Id+1}`).attr("disabled", true);
    $(`#gapEffectDescription${Id+1}`).attr("disabled", true);

    BindGAPEffectDetails()
}

function FillDropDowns() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Drivers')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_Drivers', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                if(arrSingleGAP[0].Driver_ID.Driver_Name == data.d.results[i].Driver_Name) {
                    $('#gapDriver').append(`<option value="${data.d.results[i].ID}" selected="selected">${data.d.results[i].Driver_Name}</option>`)
                } else {
                    $('#gapDriver').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Driver_Name}</option>`)
                }
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Frequency')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_GAP_Frequency', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                if(arrSingleGAP[0].Frequency_ID.Frequency_Description == data.d.results[i].Frequency_Description) {
                    $('#gapFrequency').append(`<option value="${data.d.results[i].ID}" selected="selected">${data.d.results[i].Frequency_Description}</option>`)
                } else {
                    $('#gapFrequency').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Frequency_Description}</option>`)
                }
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Priority')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_GAP_Priority', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                if(arrSingleGAP[0].Priority_ID.Priority_Description == data.d.results[i].Priority_Description) {
                    $('#gapPriority').append(`<option value="${data.d.results[i].ID}" selected="selected">${data.d.results[i].Priority_Description}</option>`)
                } else {
                    $('#gapPriority').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Priority_Description}</option>`)
                }
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('Policy_List')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('Policy_List', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                if(arrSingleGAP[0].Related_Policy.results[0].Request_title == data.d.results[i].Request_title) {
                    $('#gapViolationsRelatedPolicy').append(`<option value="${data.d.results[i].ID}" selected="selected">${data.d.results[i].Request_title}</option>`)
                } else {
                    $('#gapViolationsRelatedPolicy').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Request_title}</option>`)
                }
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Incidents')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_Incidents', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                if(arrSingleGAP[0].Related_Incident.results[0].Incident_ID == data.d.results[i].Incident_ID) {
                    $('#gapEvidencesIncidents').append(`<option value="${data.d.results[i].ID}" selected="selected">${data.d.results[i].Incident_ID}</option>`)
                } else {
                    $('#gapEvidencesIncidents').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Incident_ID}</option>`)
                }
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetGapEffectDetails() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Effects')/items?$filter=GAP_Parent_ID eq "+CNID+"&$select=*,GE_Effect_Catagory/Effect_Catagory&$expand=GE_Effect_Catagory",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var items = data.d.results;

            for(var i=0; i<items.length; i++) {

               $("#tbodyGapEffect").append('<tr><td class="text-center">'+items[i].GE_Effect_Catagory.Effect_Catagory +'</td><td class="text-center">'+items[i].GAP_Effect_Description+'</td></tr>');

            }
          
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function GetGapEvidenceDocuments(){
    
    var requestUri = _spPageContextInfo.webAbsoluteUrl +"/_api/web/lists/getByTitle('GAP_Evidences')/items?$filter=GA_GAPs_ItemId eq "+CNID+"&$select=EncodedAbsUrl,*,File/Name,GA_GAPs_Item/ID&$expand=File,GA_GAPs_Item";
    
    var requestHeaders = {
        "accept": "application/json;odata=verbose"
    }
    
    $.ajax({
        url: requestUri,
        type: 'GET',
        dataType: 'json',
        headers: requestHeaders,
        success: function (data) 
        {
    
        var items = data.d.results;
            for(var i=0; i<items.length; i++) {
                
                $("#GapEvidenceFile").append('<div class="border p-2 rounded-3 d-flex bg-white dark__bg-1000 fs--1 m-2"><span class="fs-1 far fa-image"></span><span class="ms-2 me-3">'+items[i].File.Name+'</span> <a class="text-300 ms-auto" href="#!" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Download" data-bs-original-title="Download"><span class="fas fa-arrow-down"></span></a></div>');

            }

        },
        error: function ajaxError(response) {
            console.log(response.status + ' ' + response.statusText);
        }
    });
    
}

function SendBack(event) {

    event.preventDefault()

    if($('#sendBackReason').val().trim() == "") {
        alert('Reason is required')
        return false
    }

    var obj = JSON.stringify({
        '__metadata': {  
            'type': 'SP.Data.GA_x005f_GAPsListItem'  
        },
        "GAP_Stage":0,
        "GAP_Status_IDId":4,
        "SendBackReason":$('#sendBackReason').val()
    })

    var headers = {
        "Accept": "application/json;odata=verbose",  
        "Content-Type": "application/json;odata=verbose",  
        "IF-MATCH": "*",  
        "X-HTTP-Method": "MERGE",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    }

    $.ajax({  
        url: siteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+CNID+")",  
        method: "POST",  
        async: false,
        data: obj,  
        headers: headers,  
        success: function(data) {

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":"GAP sent back to initiator",
                "Action":"Send back",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
                method: "POST",  
                async: false,
                data: historyObj,  
                headers: historyHeaders,  
                success: function(data) {
                    alert('GAP sent back to initiator');
                    console.log('History created successfully!')
                    window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/gap-logs.aspx'
                },
                error: function(error) {
                    console.log(error)
                }
            });

        },  
        error: function(error) {  
            console.log(JSON.stringify(error));  

        }

    })
}

function CancelSendBack(event) {

    event.preventDefault()

    $('#sendBackReason').val('')
}

function Approve() {

    var obj = JSON.stringify({
        '__metadata': {  
            'type': 'SP.Data.GA_x005f_GAPsListItem'  
        },
        "GAP_Stage":2,
        "GAP_Status_IDId":2
    })

    var headers = {
        "Accept": "application/json;odata=verbose",  
        "Content-Type": "application/json;odata=verbose",  
        "IF-MATCH": "*",  
        "X-HTTP-Method": "MERGE",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    }

    $.ajax({  
        url: siteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+CNID+")",  
        method: "POST",  
        async: false,
        data: obj,  
        headers: headers,  
        success: function(data) {

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":"GAP approved",
                "Action":"Approved",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
                method: "POST",  
                async: false,
                data: historyObj,  
                headers: historyHeaders,  
                success: function(data) {
                    alert('GAP approved');
                    console.log('History created successfully!')
                    window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/gap-logs.aspx'
                },
                error: function(error) {
                    console.log(error)
                }
            });

        },  
        error: function(error) {  
            console.log(JSON.stringify(error));  

        }

    })
}

function UpdateGAP() {

    if($('#gapIdentifier').val() == "") {
        alert('Please enter Identifier');
        return false;
    }
    else if($('#gapDepartment').val() == "") {
        alert('Please select Department');
        return false;
    }
    else if($('#explorationDate').val() == "") {
        alert('Please select Exploration Date');
        return false;
    }
    else if($('#gapStatement').val() == "") {
        alert('Please enter Statement');
        return false;
    }
    else if($('#gapIdentificationMethod').val() == "") {
        alert('Please select Identification Method');
        return false;
    }
    else if($('#gapDriver').val() == "") {
        alert('Please select Driver');
        return false;
    }
    else if($('#gapFrequency').val().trim() == "") {
        alert('Please select Frequency');
        return false;
    } else if($('#gapPriority').val() == "") {
        alert('Please select Priority');
        return false;
    } else if($('#gapViolationsRelatedPolicy').val() == []) {
        alert('Please select Related Policies');
        return false;
    } else if($('#gapEvidencesIncidents').val() == []) {
        alert('Please select Related Incidents');
        return false;
    }

    $('#updateButton').attr('disabled', true);

    var obj = JSON.stringify({
        '__metadata': {  
            'type': 'SP.Data.GA_x005f_GAPsListItem'  
        },
        "GAP_Stage":1,
        "GAP_Status_IDId":1,
        "Identifier":$('#gapIdentifier').val(),
        "Related_Department":$('#gapDepartment').val(),
        "Exploration_date":new Date($('#explorationDate').val()),
        "GAP_Statement":$('#gapStatement').val(),
        "Identification_method":$('#gapIdentificationMethod').val(),
        "Driver_IDId":parseInt($('#gapDriver').val()),
        "Main_Idea":$('#gapMainIdea').val(),
        "Frequency_IDId":parseInt($('#gapFrequency').val()),
        "Priority_IDId":parseInt($('#gapPriority').val()),
        "Related_IncidentId":{results:$('#gapEvidencesIncidents').val().map(item => parseInt(item))},
        "Related_PolicyId":{results:$('#gapViolationsRelatedPolicy').val().map(item => parseInt(item))},
    })

    var headers = {
        "Accept": "application/json;odata=verbose",  
        "Content-Type": "application/json;odata=verbose",  
        "IF-MATCH": "*",  
        "X-HTTP-Method": "MERGE",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val() 
    }

    $.ajax({  
        url: siteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+CNID+")",  
        method: "POST",  
        async: false,
        data: obj,  
        headers: headers,  
        success: function(data) {
            if($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length > 0) {
                uploadFile(CNID);
            }
            if(arrEffectedGap.length > 0) {
                for(var i=0; i<arrEffectedGap.length;i++) {
                    var tableObj = JSON.stringify({
                        '__metadata': {  
                            'type': 'SP.Data.GA_x005f_GAP_x005f_EffectsListItem'  
                        },
                        "GE_Effect_CatagoryId":parseInt(arrEffectedGap[i].effectCategory.Value),
                        "GAP_Effect_Description":arrEffectedGap[i].effectDescription,
                        "GAP_Parent_ID": parseInt(CNID)
                    })

                    var tableHeaders = {
                        "accept": "application/json;odata=verbose",   
                        "content-type": "application/json;odata=verbose",  
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    }

                    $.ajax({  
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GA_GAP_Effects')/items",  
                        method: "POST",  
                        async: false,
                        data: tableObj,
                        headers: tableHeaders,  
                        success: function(data) {  
                            console.log("GAP Effect " +(i+1)+ " created successfully");
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    })
                }
            }

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":$('#incidentDescription').val(),
                "Action":"GAP updated",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
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

            alert("GAP updated successfully");
            
            $('#updateGAP').attr('disabled', false);

            if($('#dropzoneGapEvidencesUpdate')[0].dropzone.getAcceptedFiles().length == 0) {
                window.location.reload()
            }
        },  
        error: function(error) {  
            console.log(JSON.stringify(error));  

        }

    })
}

function uploadFile(MainItemID) {
    // Define the folder path for this example.
    var serverRelativeUrlToFolder = 'GAP_Evidences';

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
                    window.location.reload()
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
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}', 'GA_GAPs_ItemId':{3}}}",
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

function AnalyzeGAP() {
    $('.data-analysis-edit').addClass('active')
    $('.data-analysis-view').removeClass('active')
    $('#analyzeButtonDiv').hide()
    $('#completeAnalyzeButtonDiv').show()
    $('#analysisDiv').show()

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Analysis_Improvement_Basket')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            for(var i=0;i<data.d.results.length;i++) {
                $('#gapAnalyzingChooseImprovementBasket').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Title}</option>`)
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    BindAnalyzeGAPHTML()
}

function BindAnalyzeGAPHTML() {
    $('#analyzeTBody').html('');
    for(var i=0;i<arrAnalyzeGap.length;i++) {
        $('#analyzeTBody').append(`<tr>
            <td class="text-center">
                <input class="form-control form-control-style-cursor minw-150" type="text" id="analyzeWhyNumber${i+1}" disabled="disabled" value="${arrAnalyzeGap[i].whyNumber}" placeholder="why number" />
            </td>
            <td>
                <input class="form-control form-control-style-cursor minw-150" type="text" id="analyzeWhyStatement${i+1}" disabled="disabled" value="${arrAnalyzeGap[i].whyStatement}" placeholder="type statement..." />
            </td>
            <td class="text-center">
                <select class="form-select" disabled="disabled" id="analyzeWhyDriver${i+1}">
                    <option value="${arrAnalyzeGap[i].whyDriver.driverID}" selected="selected">${arrAnalyzeGap[i].whyDriver.driverName}</option>
                </select>
            </td>
            <td class="text-center">
                
            </td>
        </tr>`)
    }

    $('#analyzeTBody').append(`<tr>
        <td class="text-center">
            <input class="form-control form-control-style-cursor minw-150" type="text" id="analyzeWhyNumber" disabled="disabled" value="Why ${arrAnalyzeGap.length+1}" placeholder="why number" />
        </td>
        <td>
            <input class="form-control form-control-style-cursor minw-150" type="text" id="analyzeWhyStatement" placeholder="type statement..." />
        </td>
        <td class="text-center">
            <select class="form-select" id="analyzeWhyDriver">
                <option value="" selected="">Select Driver</option>
            </select>
        </td>
        <td class="text-center">
            <button class="btn btn-dquam-primary btn-sm minw-80" onclick="AddAnalyzeGAP(event)" type="button">
                <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Add
            </button>
        </td>
    </tr>`)

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Drivers')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            for(var i=0;i<data.d.results.length;i++) {
                $('#analyzeWhyDriver').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Driver_Name}</option>`)
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function AddAnalyzeGAP(event) {

    event.preventDefault()
    
    if(arrAnalyzeGap.length == 5) {
        alert('Maximum 5 Analysis are allowed')
        return false
    } else if($('#analyzeWhyStatement').val().trim() == "") {
        alert("Please enter Statement")
        return false
    } else if($('#analyzeWhyDriver').val().trim() == "") {
        alert('Please select Driver')
        return false
    }

    obj = {
        whyNumber:$('#analyzeWhyNumber').val(),
        whyStatement:$('#analyzeWhyStatement').val(),
        whyDriver:{
            driverName:$('#analyzeWhyDriver :selected').text(),
            driverID:parseInt($('#analyzeWhyDriver').val())
        }
    }

    arrAnalyzeGap.push(obj)
    BindAnalyzeGAPHTML()
}

function SubmitAnalyzeGAP(event) {
    event.preventDefault()

    if($('#gapAnalyzingChooseImprovementBasket').val().trim() == "") {
        alert('Please select Improvement Basket')
        return false
    }

    var stringObj = {}

    if(arrAnalyzeGap.length == 1) {
        stringObj = {
            "__metadata":  
            {  
            "type": "SP.Data.GA_x005f_GAP_x005f_AnalysisListItem"  
            },
            "GAP_Parent_ID":parseInt(CNID),
            "First_Why":arrAnalyzeGap[0].whyStatement,
            "First_Why_DriverId":parseInt(arrAnalyzeGap[0].whyDriver.driverID),
            "GA_Improvement_BasketId":parseInt($('#gapAnalyzingChooseImprovementBasket').val())
        }
    } else if(arrAnalyzeGap.length == 2) {
        stringObj = {
            "__metadata":  
            {  
            "type": "SP.Data.GA_x005f_GAP_x005f_AnalysisListItem"  
            },
            "GAP_Parent_ID":parseInt(CNID),
            "First_Why":arrAnalyzeGap[0].whyStatement,
            "Second_Why":arrAnalyzeGap[1].whyStatement,
            "First_Why_DriverId":parseInt(arrAnalyzeGap[0].whyDriver.driverID),
            "Second_Why_DriverId":parseInt(arrAnalyzeGap[1].whyDriver.driverID),
            "GA_Improvement_BasketId":parseInt($('#gapAnalyzingChooseImprovementBasket').val())
        }
    } else if( arrAnalyzeGap.length == 3) {
        stringObj = {
            "__metadata":  
            {  
            "type": "SP.Data.GA_x005f_GAP_x005f_AnalysisListItem"  
            },
            "GAP_Parent_ID":parseInt(CNID),
            "First_Why":arrAnalyzeGap[0].whyStatement,
            "Second_Why":arrAnalyzeGap[1].whyStatement,
            "Third_Why":arrAnalyzeGap[2].whyStatement,
            "First_Why_DriverId":parseInt(arrAnalyzeGap[0].whyDriver.driverID),
            "Second_Why_DriverId":parseInt(arrAnalyzeGap[1].whyDriver.driverID),
            "Third_Why_DriverId":parseInt(arrAnalyzeGap[2].whyDriver.driverID),
            "GA_Improvement_BasketId":parseInt($('#gapAnalyzingChooseImprovementBasket').val())
        }
    } else if(arrAnalyzeGap.length == 4) {
        stringObj = {
            "__metadata":  
            {  
            "type": "SP.Data.GA_x005f_GAP_x005f_AnalysisListItem"  
            },
            "GAP_Parent_ID":parseInt(CNID),
            "First_Why":arrAnalyzeGap[0].whyStatement,
            "Second_Why":arrAnalyzeGap[1].whyStatement,
            "Third_Why":arrAnalyzeGap[2].whyStatement,
            "Fourth_Why":arrAnalyzeGap[3].whyStatement,
            "First_Why_DriverId":parseInt(arrAnalyzeGap[0].whyDriver.driverID),
            "Second_Why_DriverId":parseInt(arrAnalyzeGap[1].whyDriver.driverID),
            "Third_Why_DriverId":parseInt(arrAnalyzeGap[2].whyDriver.driverID),
            "Fourth_Why_DriverId":parseInt(arrAnalyzeGap[3].whyDriver.driverID),
            "GA_Improvement_BasketId":parseInt($('#gapAnalyzingChooseImprovementBasket').val())
        }
    } else if(arrAnalyzeGap.length == 5) {
        stringObj = {
            "__metadata":  
            {  
            "type": "SP.Data.GA_x005f_GAP_x005f_AnalysisListItem"  
            },
            "GAP_Parent_ID":parseInt(CNID),
            "First_Why":arrAnalyzeGap[0].whyStatement,
            "Second_Why":arrAnalyzeGap[1].whyStatement,
            "Third_Why":arrAnalyzeGap[2].whyStatement,
            "Fourth_Why":arrAnalyzeGap[3].whyStatement,
            "Fifth_Why":arrAnalyzeGap[4].whyStatement,
            "First_Why_DriverId":parseInt(arrAnalyzeGap[0].whyDriver.driverID),
            "Second_Why_DriverId":parseInt(arrAnalyzeGap[1].whyDriver.driverID),
            "Third_Why_DriverId":parseInt(arrAnalyzeGap[2].whyDriver.driverID),
            "Fourth_Why_DriverId":parseInt(arrAnalyzeGap[3].whyDriver.driverID),
            "Fifth_Why_DriverId":parseInt(arrAnalyzeGap[4].whyDriver.driverID),
            "GA_Improvement_BasketId":parseInt($('#gapAnalyzingChooseImprovementBasket').val())
        }
    }

    var bodyObj = JSON.stringify(stringObj)

    var headersObj = {
        "accept": "application/json;odata=verbose",   
        "content-type": "application/json;odata=verbose",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    }

    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GA_GAP_Analysis')/items",  
        method: "POST",  
        async: true,
        data: bodyObj,  
        headers: headersObj,  
        success: function(data) {

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":"GAP analysis completed",
                "Action":"Analysis done",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
                method: "POST",  
                async: false,
                data: historyObj,  
                headers: historyHeaders,  
                success: function(data) {
                    console.log('History created successfully!')

                    var obj = JSON.stringify({
                        '__metadata': {  
                            'type': 'SP.Data.GA_x005f_GAPsListItem'  
                        },
                        "GAP_Stage":3,
                        "GAP_Status_IDId":3
                    })
                
                    var headers = {
                        "Accept": "application/json;odata=verbose",  
                        "Content-Type": "application/json;odata=verbose",  
                        "IF-MATCH": "*",  
                        "X-HTTP-Method": "MERGE",  
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    }
                
                    $.ajax({  
                        url: siteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+CNID+")",  
                        method: "POST",  
                        async: false,
                        data: obj,  
                        headers: headers,  
                        success: function(data) {
                            console.log('GAP updated successfully!')
                            alert('Analysis done successfully')
                            window.location.reload()
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });

                },
                error: function(error) {
                    console.log(error)
                }
            });
        },
        error: function(error) {
            console.log(error)
        }
    })
}

function AssignPlanGAP(event) {

    event.preventDefault()

    var obj = JSON.stringify({
        '__metadata': {  
            'type': 'SP.Data.GA_x005f_GAPsListItem'  
        },
        "GAP_Stage":6,
        "GAP_Status_IDId":5
    })

    var headers = {
        "Accept": "application/json;odata=verbose",  
        "Content-Type": "application/json;odata=verbose",  
        "IF-MATCH": "*",  
        "X-HTTP-Method": "MERGE",  
        "X-RequestDigest": $("#__REQUESTDIGEST").val()
    }

    $.ajax({  
        url: siteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items("+CNID+")",  
        method: "POST",  
        async: false,
        data: obj,  
        headers: headers,  
        success: function(data) {
            console.log('GAP updated successfully!')

            var historyObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                },
                "Approver_Name": _spPageContextInfo.userDisplayName,
                "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                "Comments":"Plan assigned to approver",
                "Action":"Plan assigned",
                "Request_ID":parseInt(CNID)
            })
        
            var historyHeaders = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
                method: "POST",  
                async: false,
                data: historyObj,  
                headers: historyHeaders,  
                success: function(data) {

                    $.ajax({  
                        url: _spPageContextInfo.webAbsoluteUrl + `/_api/web/siteusers?$filter=Email eq '${SPClientPeoplePicker.SPClientPeoplePickerDict['assignPlanPerson_TopSpan'].GetAllUserInfo()[0].EntityData.Email}'`,  
                        method: "GET",  
                        async: false,  
                        headers: { "Accept": "application/json; odata=verbose" },  
                        success: function (data) {		   
                            var ApproverID = data.d.results[0].Id;

                            var approverObj = JSON.stringify({
                                '__metadata': {  
                                    'type': 'SP.Data.GA_x005f_GAP_x005f_ApproversListItem'  
                                },
                                "Approver_NameId": parseInt(ApproverID),
                                "Request_ID":parseInt(CNID)
                            })
                        
                            var approverHeaders = {
                                "accept": "application/json;odata=verbose",   
                                "content-type": "application/json;odata=verbose",  
                                "X-RequestDigest": $("#__REQUESTDIGEST").val()
                            }
                        
                            $.ajax({  
                                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GA_GAP_Approvers')/items",  
                                method: "POST",  
                                async: false,
                                data: approverObj,  
                                headers: approverHeaders,  
                                success: function(data) {
                                    alert('Plan assigned successfully')
                                    window.location.reload()
                                },
                                error: function(error) {
                                    console.log(error)
                                }
                            });
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });
                },
                error: function(error) {
                    console.log(error)
                }
            });
            
        },
        error: function(error) {
            console.log(error)
        }
    });
}

function initializePeoplePicker(peoplePickerElementId) {

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '340px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}