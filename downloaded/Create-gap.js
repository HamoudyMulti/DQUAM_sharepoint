var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var arrEffectCategories = [];

$(document).ready(function() {
    $('#userImage').attr('src',_spPageContextInfo.siteServerRelativeUrl + "/_layouts/15/userphoto.aspx?size=L&accountname=" + _spPageContextInfo.userEmail);
    $('#userName')[0].innerHTML = _spPageContextInfo.userDisplayName
    $('#userDepartment')[0].innerHTML = "None"
    $('#explorationDate').flatpickr();
    $('#pageTitle')[0].innerHTML = "Add New GAP"
document.getElementById('gapEvidencesIncidents').setAttribute("style","height:100px");
document.getElementById('gapViolationsRelatedPolicy').setAttribute("style","height:100px");
    FillDropDowns()
    BindGapEffect()

    $('#submitGap').hide()

    $('#navGap1').on('click', function() {
        $('#nextButton').show()
        $('#submitGap').hide()
    })

    $('#navGap2').on('click', function() {
        $('#nextButton').show()
        $('#submitGap').hide()
    })
    
    $('#navGap3').on('click', function() {
        $('#nextButton').show()
        $('#submitGap').hide()
    })

    $('#navGap4').on('click', function() {
        $('#nextButton').hide()
        $('#submitGap').show()
    })
})

function FillDropDowns() {
    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_Drivers')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('GA_Drivers', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                $('#gapDriver').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Driver_Name}</option>`)
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
                $('#gapFrequency').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Frequency_Description}</option>`)
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
                $('#gapPriority').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Priority_Description}</option>`)
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
                $('#gapViolationsRelatedPolicy').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Request_title}</option>`)
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('Procedure_List')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log('Procedure_List', data.d.results);
            for(var i=0;i<data.d.results.length;i++) {
                $('#gapViolationsRelatedProcedure').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Request_title}</option>`)
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
                $('#gapEvidencesIncidents').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Incident_ID}</option>`)
            }
        },
        error: function(error) {
            console.log(error.responseText)
        }
    })
}

function BindGapEffect() {
    $('#gapEffectTableBody').html('')
    for(var i=0;i<arrEffectCategories.length;i++) {
        $('#gapEffectTableBody').append(`
            <tr>
                <td class="text-center">
                    <select class="form-select minw-150" id="effectCategory${i+1}" disabled="disabled">
                        <option value="${arrEffectCategories[i].effectCategory.Value}" selected="selected">${arrEffectCategories[i].effectCategory.Name}</option>
                    </select>
                </td>
                <td>
                    <input class="form-control form-control-style-cursor minw-150" id="effectDescription${i+1}" value="${arrEffectCategories[i].effectDescription}" disabled="disabled" type="text" placeholder="type description..." />
                </td>
                <td class="text-center">
                    <div id="add${i+1}">
                        <button class="btn btn-link p-0" type="button" data-bs-toggle="tooltip" data-bs-placement="top"
                            title="Edit" onclick="BindEditEffectGap(${i+1})">
                            <span class="fas fa-edit text-primary-emphasis"></span>
                        </button>
                        <button class="btn btn-link p-0 ms-2" type="button" data-bs-toggle="tooltip"
                            data-bs-placement="top" title="Delete" onclick="BindDeleteEffectGap(${arrEffectCategories[i].Id})">
                            <span class="fas fa-trash text-danger"></span>
                        </button>
                    </div>
                    <div id="update${i+1}">
                        <button class="btn btn-dquam-success btn-sm minw-80" type="button" onclick="UpdateEffectedGap(${i})">
                            <span class="fas fa-plus me-1" data-fa-transform="shrink-3"></span> Update
                        </button>
                    </div>
                </td>
            </tr>
        `)
        $(`#update${i+1}`).hide();  
    }
    $('#gapEffectTableBody').append(`
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
            for(var i=0;i<data.d.results.length;i++) {
                $('#effectCategory').append(`<option value="${data.d.results[i].ID}">${data.d.results[i].Effect_Catagory}</option>`)
            }
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
        Id:arrEffectCategories.length+1
    }

    arrEffectCategories.push(obj)
    BindGapEffect()
}

function MoveNext(event) {
    event.preventDefault();

    if($('#gap-new-form-wizard-tab1').hasClass('active')) {
        $('#navGap2').click()
        $('#submitGap').hide()
        $('#nextButton').show()
    } else if($('#gap-new-form-wizard-tab2').hasClass('active')) {
        $('#navGap3').click()
        $('#submitGap').hide()
        $('#nextButton').show()
    } else if($('#gap-new-form-wizard-tab3').hasClass('active')) {
        $('#navGap4').click()
        $('#submitGap').show()
        $('#nextButton').hide()
    }
}

function UpdateEffectedGap(Id) {
    arrEffectCategories[Id].effectCategory.Value = $(`#effectCategory${Id+1}`).val();
    arrEffectCategories[Id].effectCategory.Name = $(`#effectCategory${Id+1} :selected`).text();
    arrEffectCategories[Id].effectDescription = $(`#effectDescription${Id+1}`).val();

    $(`#effectCategory${Id+1}`).attr("disabled", true);
    $(`#effectDescription${Id+1}`).attr("disabled", true);

    BindGapEffect();
}

function BindDeleteEffectGap(Id) {
    arrEffectCategories = arrEffectCategories.filter(item => item.Id !== Id)
    BindGapEffect();
}

function BindEditEffectGap(Id) {
    $(`#effectCategory${Id}`).attr("disabled", false);
    $(`#effectDescription${Id}`).attr("disabled", false);

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('GA_GAP_Effect_Categories')/items",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var arrEffectCatagory = data.d.results
            var dropdownHtml = `<option value="${$('#effectCategory'+Id).val()}" selected="${$('#effectCategory'+Id).val()}">${$('#effectCategory'+Id+' :selected').text()}</option>`;
            for(var i =0; i<arrEffectCatagory.length; i++) {
                if($('#effectCategory'+Id+' :selected').text().trim() != arrEffectCatagory[i].Effect_Catagory) {
                    dropdownHtml += `<option value="${arrEffectCatagory[i].ID}">${arrEffectCatagory[i].Effect_Catagory}</option>`
                }
            }
            $('#effectCategory'+Id).html('');
            $(`#effectCategory${Id}`).append(dropdownHtml);
            $(`#add${Id}`).hide();
            $(`#update${Id}`).show();
            $('#addNewGap').hide();
        },
        error:function (error) {
            console.log(error)
        }
    })
}

function SubmitGap() {
    if($('#explorationDate').val().trim() == "") {
        alert('Please select Exploration Date in GAP Information')
        return false
    } else if($('#gapStatement').val().trim() == "") {
        alert('Please enter Statement in GAP Information')
        return false
    } else if($('#gapMainIdea').val().trim() == "") {
        alert('Please select Main Idea in GAP Information')
        return false
    } else if($('#gapIdentificationMethod').val().trim() == "") {
        alert('Please select Identification Method in GAP Information')
        return false
    } else if($('#gapDriver').val().trim() == "") {
        alert('Please select GAP Driver in GAP Information')
        return false
    } else if($('#gapFrequency').val().trim() == "") {
        alert('Please select GAP Frequency in GAP Information')
        return false
    } else if($('#gapPriority').val().trim() == "") {
        alert('Please select GAP Priority in GAP Information')
        return false
    } else if($('#gapPriority').val().trim() == "") {
        alert('Please select GAP Priority in GAP Information')
        return false
    } else if(arrEffectCategories.length == 0) {
        alert('Please enter Gap Effect')
        return false
    } else if($('#gapPriority').val().trim() == "") {
        alert('Please select GAP Priority in GAP Information')
        return false
    } else if($('#gapEvidencesIncidents').val() == []) {
        alert('Please select Incidents in Evidences')
        return false
    } else if($('#gapViolationsRelatedPolicy').val() == []) {
        alert('Please select Related Policy in Violations')
        return false
    }

    $('#submitGap').attr('disabled', true);

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('Sequence_List')/items?$filter=Title eq 'GAP'",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var sequenceItem = data.d.results
            var seqObj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.Sequence_x005f_ListListItem'  
                },
                "Sequence_Number":sequenceItem[0].Sequence_Number+1
            })      

            var seqHeaders = {
                "Accept": "application/json;odata=verbose",  
                "Content-Type": "application/json;odata=verbose",  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "MERGE",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }

            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Sequence_List')/items("+sequenceItem[0].ID+")",  
                method: "POST",  
                async: false,
                data: seqObj,  
                headers: seqHeaders,  
                success: function(data) {
                    console.log('Request ID for GAP incremented by 1')
                },
                error: function(error) {
                    console.log(error.responseText)
                }
            })
        },
        error: function(error) {
            console.log(error)
        }
    })

    $.ajax({
        url: siteUrl + "/_api/web/lists/getbytitle('Sequence_List')/items?$filter=Title eq 'GAP'",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var sequenceItem = data.d.results
            var obj = JSON.stringify({
                '__metadata': {  
                    'type': 'SP.Data.GA_x005f_GAPsListItem'  
                },
                "GAP_Stage":1,
                "GAP_Status_IDId":1,
                "GAP_ID":sequenceItem[0].Request_Number,
                "Exploration_date":new Date($('#explorationDate').val()),
                "GAP_Statement":$('#gapStatement').val(),
                "Main_Idea":$('#gapMainIdea').val(),
                "Identification_method":$('#gapIdentificationMethod').val(),
                "Driver_IDId":parseInt($('#gapDriver').val()),
                "Frequency_IDId":parseInt($('#gapFrequency').val()),
                "Priority_IDId":parseInt($('#gapPriority').val()),
                "Related_IncidentId":{results:$('#gapEvidencesIncidents').val().map(item => parseInt(item))},
                "Related_PolicyId":{results:$('#gapViolationsRelatedPolicy').val().map(item => parseInt(item))},
            })
        
            var headers = {
                "accept": "application/json;odata=verbose",   
                "content-type": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        
            $.ajax({  
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GA_GAPs')/items",  
                method: "POST",  
                async: false,
                data: obj,  
                headers: headers,  
                success: function(data) { 
                    var mainItem = data.d;
                    var itemCount = 0;
        
                    if($('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles().length > 0) {
                        uploadFile(mainItem.ID); 
                    }
        
                    for(var i=0; i<arrEffectCategories.length;i++) {
                        var tableObj = JSON.stringify({
                            '__metadata': {  
                                'type': 'SP.Data.GA_x005f_GAP_x005f_EffectsListItem'  
                            },
                            "GE_Effect_CatagoryId":parseInt(arrEffectCategories[i].effectCategory.Value),
                            "GAP_Effect_Description":arrEffectCategories[i].effectDescription,
                            "GAP_Parent_ID": parseInt(mainItem.ID)
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
                                itemCount++
                                if(itemCount == arrEffectCategories.length) {
                                    alert('GAP created successfully!')
                                    if($('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles().length == 0) {
                                        window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/Gap-logs.aspx';
                                    }
                                }
                                console.log("Item " +(i+1)+ " created successfully");
                            },
                            error: function(error) {
                                console.log(error)
                            }
                        })
                    }

                    var historyObj = JSON.stringify({
                        '__metadata': {  
                            'type': 'SP.Data.GAP_x005f_Approver_x005f_HistoryListItem'  
                        },
                        "Approver_Name": _spPageContextInfo.userDisplayName,
                        "Approved_On":`${new Date().format('yyyy/MM/dd')} ${new Date().format('hh:mm:ss tt')}`,
                        "Comments":$('#incidentNewDescription').val(),
                        "Action":"GAP created",
                        "Request_ID":parseInt(mainItem.ID)
                    })
                
                    var historyHeaders = {
                        "accept": "application/json;odata=verbose",   
                        "content-type": "application/json;odata=verbose",  
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    }
                
                    $.ajax({  
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('GAP_Approver_History')/items",  
                        method: "POST",  
                        async: true,
                        data: historyObj,  
                        headers: historyHeaders,  
                        success: function(data) {
                            console.log('History created successfully!')
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });
                },
                error: function(error) {
                    console.log(error.responseText)
                }
            })

        },
        error: function(error) {
            console.log(error)
        }
    })
}

function CancelGap() {
    $('#explorationDate').val('')
    $('#gapStatement').val('')
    $('#gapMainIdea').val('')
    $('#gapIdentificationMethod').val('')
    $('#gapDriver').val('')
    $('#gapFrequency').val('')
    $('#gapPriority').val('')
    $('#gapEvidencesIncidents').val([])
    $('#gapViolationsRelatedPolicy').val([])
    $('#gapViolationsRelatedProcedure').val([])
    $('#dropzoneGapEvidences')[0].dropzone.removeAllFiles();
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
    for(var i=0; i<$('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles().length; i++) {
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
                filesUploaded++;
                if($('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles().length == filesUploaded){  
                    $('#dropzoneGapEvidences')[0].dropzone.removeAllFiles();
                    // alert('file uploaded and updated');
                    window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/Gap-logs.aspx';
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
      reader.readAsArrayBuffer($('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles()[i]);
      return deferred.promise();
    }
  
    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer, MainItemID, i) {
      // Get the file name from the file input control on the page.
    //   var parts = fileInput[0].value.split('\\');
      var fileName = $('#dropzoneGapEvidences')[0].dropzone.getAcceptedFiles()[i].name;
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