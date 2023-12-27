async function check_user_access(record_id, selected_policy, current_user, approvers_list) {

    if (initiator_check(current_user, selected_policy)) {
        return 'initiator';
    }
    if (await quality_team_check(current_user)) {
        return 'quality';
    }


    if (preparation_check("Preparation", approvers_list, current_user)) {
        return 'preparation';
    }

    if (stakeholders_check("Stakeholders", approvers_list, current_user)) {
        return 'stakeholders';
    }

    if (regulators_check("Regulators", approvers_list, current_user)) {
        return 'regulators';
    }


    return 'unauthorized';


}


function initiator_check(current_user, selected_policy) {
    return selected_policy.Author.Id === current_user;
}


async function quality_team_check(current_user) {
    let quality_team_members = await get_quality_team_members();

    const isMatchFound = quality_team_members.some(record => {
        return record.Approver_Name.Id === current_user;
    });

    return isMatchFound;

}


function get_quality_team_members() {
    return new Promise(function (resolve, reject) {
        let select = "$select=*,Approver_Name/Id,Approver_Name/Title";
        let expand = "$expand=Approver_Name";
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Policy_Quality_Approvers')/items?${select}&${expand}`,
            method: "GET",
            headers: {
                "ACCEPT": "application/json; odata=verbose",
            },
            success: function (data) {
                resolve(data.d.results);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


function preparation_check(type, approvers_list, current_user) {
    return find_user_in_list(type, approvers_list, current_user);
}

function stakeholders_check(type, approvers_list, current_user) {
    return find_user_in_list(type, approvers_list, current_user);
}

function regulators_check(type, approvers_list, current_user) {
    return find_user_in_list(type, approvers_list, current_user);
}

function find_user_in_list(type, approvers_list, current_user) {
    const isMatchFound = approvers_list.some(record => {
        if (record.Approver_Type === type) {
            return record.Approver_Name.Id === current_user;
        }

        return false;
    });

    return isMatchFound;
}


function check_user_permissions(access, step_number) {

    /*
        Step_Number=1,"Quality Team"
        Step_Number=2,"Preparation Team"
        Step_Number=3,"Stakeholders"
        Step_Number=4,"Regulators"
        Step_Number=5,"Publish"
        Step_Number=6,"Completed"
        Step_Number=11,"Send Back By Quality"
        Step_Number=33,"Send Back By Stakeholders"
        Step_Number=44,"Send Back By Regulators"
    */

    const permissions = {
        1: { initiator: "read", quality: "write", preparation: "none", stakeholders: "none", regulators: "none" },
        2: { initiator: "read", quality: "read", preparation: "write", stakeholders: "none", regulators: "none" },
        3: { initiator: "read", quality: "read", preparation: "read", stakeholders: "write", regulators: "none" },
        4: { initiator: "read", quality: "read", preparation: "read", stakeholders: "read", regulators: "write" },
        5: { initiator: "read", quality: "write", preparation: "read", stakeholders: "read", regulators: "read" },
        6: { initiator: "read", quality: "write", preparation: "read", stakeholders: "read", regulators: "read" },

        11: { initiator: "write", quality: "read", preparation: "none", stakeholders: "none", regulators: "none" },
        33: { initiator: "read", quality: "read", preparation: "write", stakeholders: "read", regulators: "none" },
        44: { initiator: "read", quality: "read", preparation: "write", stakeholders: "read", regulators: "read" },
    };

    return permissions[step_number][access];
}



function get_approvers_list(record_id, type) {
    return new Promise(function (resolve, reject) {
        let select = "$select=*,Approver_Name/Id,Approver_Name/Title";
        let expand = "$expand=Approver_Name";
        let filter = `$filter=Request_ID eq ${record_id}`;

        if (type) {
            filter += ` and Approver_Type eq '${type}'`
        }

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Policy_Approvers_List')/items?${select}&${expand}&${filter}`,
            method: "GET",
            headers: {
                "ACCEPT": "application/json; odata=verbose",
            },
            success: function (data) {
                resolve(data.d.results);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


function get_CNID_from_url() {
    let url = window.location.href;
    const match = url.match(/[?&]CNID=([^&]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}



function get_policy_documents(record_id) {
    return new Promise(function (resolve, reject) {
        let select = "$select=Title,LinkFilename,EncodedAbsUrl,ID";
        let filter = `$filter=Policy_Item eq ${record_id}`;
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Policy Attachments')/items?${select}&${filter}`,
            method: "GET",
            headers: {
                "ACCEPT": "application/json; odata=verbose",
            },
            success: function (data) {
                resolve(data.d.results);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


function update_user_approval(approver_record) {
    return new Promise(function (resolve, reject) {
        var seqObj = JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.Policy_x005f_Approvers_x005f_ListListItem'
            },
            "Approver_Approval_Status": 1

        });

        var seqHeaders = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Policy_Approvers_List')/items(" + approver_record + ")",
            method: "POST",
            async: false,
            data: seqObj,
            headers: seqHeaders,
            success: function (data) {
                resolve();
            },
            error: function (error) {
                reject(error)
            }
        })

    });
}


function proceed_to_next_stage(record_id, step_number) {
    return new Promise(function (resolve, reject) {
        var seqObj = JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.Policy_x005f_ListListItem'
            },
            "Step_Number": step_number

        });

        var seqHeaders = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Policy_List')/items(" + record_id + ")",
            method: "POST",
            async: false,
            data: seqObj,
            headers: seqHeaders,
            success: function (data) {
                resolve();
            },
            error: function (error) {
                reject(error)
            }
        })

    });
}


function is_last_approver_check(list) {

    const count_users = list.length;

    const count_approved_users = list.filter(record => record.Approver_Approval_Status === 1).length;

    return count_users - count_approved_users === 1;
}


function get_approver_record_for_current_user(list, current_user) {
    const matchingRecords = list.filter(record => record.Approver_Name.Id === current_user);

    if (matchingRecords.length > 0) {
        return matchingRecords[0].ID;
    }

    return null;
}


function redirect_user_to_home_page(){
    window.location.href = 'https://mgskw.sharepoint.com/sites/DQ/Pages/Policy_Logs.aspx';
    return;
}


function current_user_approved_check(access, approvers_list, current_user, access_type, type) {
    if(access === access_type){
        const isMatchFound = approvers_list.some(record => {
            if (record.Approver_Type === type && record.Approver_Name.Id === current_user && record.Approver_Approval_Status === 1) {
                return true;
            }
            return false;
        });
        
        return isMatchFound;
    }

    return false;

}


function get_policy_info(record_id, select, expand) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Policy_List')/items(${record_id})?${select}&${expand}`,
            method: "GET",
            headers: {
                "ACCEPT": "application/json; odata=verbose",
            },
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


function get_current_user_id(){
    // return _spPageContextInfo.userId;
    return 26;
}

async function submit_changes(type, next_step_number) {
    const record_id = get_CNID_from_url();

    let current_user = get_current_user_id();
    

    let list = await get_approvers_list(record_id, type);

    let approver_record = get_approver_record_for_current_user(list, current_user);

    const is_last_approver = is_last_approver_check(list);

    if (approver_record) {
        await update_user_approval(approver_record);
        console.log("approver_record",approver_record)
        console.log("is_last_approver",is_last_approver)

        if (is_last_approver) {
            await proceed_to_next_stage(record_id, next_step_number);
        }
    }

    redirect_user_to_home_page();
    return;
    
}


function step_number_check(step_number, valid_step_numbers) {
    if (!valid_step_numbers.includes(step_number)) {
        redirect_user_to_home_page();
    }
}