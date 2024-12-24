export async function getUserData(odoo, uid) {
  return new Promise((resolve, reject) => {
    const params = [[['id', '=', uid]], ['id', 'name', 'company_ids', 'company_id', 'email']];
    odoo.execute_kw('res.users', 'search_read', [params], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export async function getUserCompanies(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["id", "in", user[0].company_ids]]);
    inParams.push(["id", "name", "short_name"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("res.company", 'search_read', params, (err, companies) => {
      if (err) {
        reject(err);
      } else {
        resolve(companies);
      }
    });
  });
}

export async function getAssetWithSearch(odoo, user, text, includeNameAndCode, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    if (!id && includeNameAndCode) {
      inParams.push([["company_id", "=", user[0].company_id[0]], '|', ["code", "like", `${text}%`], ["name", "like", `${text}%`]]);
    } else if (id) {
      inParams.push([["id", "=", id]]);
    } else {
      inParams.push([["company_id", "=", user[0].company_id[0]], ["code", "=", text]]);
    }
    inParams.push([
      "id", "name", "code", "asset_type", "category_id", "value",
      "company_id", "state", "acceptance_date", "acceptance_number",
      "description", "quantity", "alt_unit", "management_dept", "asset_user", "handover_party", "asset_user_temporary", "related_handover_party",
      "receiver_handover_party", "asset_management_dept_staff", "asset_status_start",
      "latest_inventory_status", "dept_owner", "sea_office_id", "vendor_name", "company_using", "repair_date",
      "related_handover_party", "note", "procurement_staff", "latest_asset_transfer_date", "asset_receive_date", "liquidation_date"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("account.asset.asset", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getAssetTransferLines(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_id", "=", parseInt(id)]]);
    inParams.push([
      "id", "quantity_demanding", "quantity_done", "asset_status_transfer", "state", "dest_department", "asset_management_dept_staff",
      "note", "source_location_id", "dest_company", "dest_department_temporary", "dest_location_id", "validate_date"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.transfer.line", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getAssetInventoryLines(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_id", "=", parseInt(id)]]);
    inParams.push([
      "id", "quantity_so_sach", "quantity_thuc_te", "asset_inventory_id", "status", "da_dan_tem", "asset_user_temporary", "validated_date", "note", "de_xuat_xu_ly", "giai_trinh", "latest_inventory_status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getAssetAdjustmentLines(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_id", "=", parseInt(id)]]);
    inParams.push([
      "id", "adjustment_code", "increase_quantity", "date_adjustment", "description", "document_ref", "vendor_name"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("account.asset.adjustment", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getAssetRepair(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_id", "=", parseInt(id)]]);
    inParams.push([
      "id", "repair_date_start", "repair_date_end", "repair_party", "accident_place", "description", "quantity"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.repair.lines", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getAuditList(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]]]);
    inParams.push(["id", "name", "state", "start_time", "end_time", "create_uid", "create_date", "note", "sea_office_id"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory", 'search_read', params, (err, audits) => {
      if (err) {
        reject(err);
      } else {
        resolve(audits);
      }
    });
  });
}

export async function getAudit(odoo, user, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]], ["id", "=", id]]);
    inParams.push([
      "id", "name", "state", "start_time", "end_time", "create_uid", "create_date", "department",
      "inventoried_department", "sea_office_id",
      "liquidation_state", "pending_state", "process_state", "draft_state", "company_id", "note"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory", 'search_read', params, (err, audit) => {
      if (err) {
        reject(err);
      } else {
        resolve(audit);
      }
    });
  });
}

export async function getOffices(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]);
    inParams.push([
      "id", "name"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.office", 'search_read', params, (err, offices) => {
      if (err) {
        reject(err);
      } else {
        resolve(offices);
      }
    });
  });
}

export async function getDepartments(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["company_id", "=", user[0].company_id[0]]]);
    inParams.push(["id", "name"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("hr.department", 'search_read', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function getAssetInventoryCommitee(odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id", "=", parseInt(auditId)]]);
    inParams.push(["id", "employee_id_temp", "position"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.committee", 'search_read', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function getAssetInventoriedDept(odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id", "=", parseInt(auditId)]]);
    inParams.push(["id", "employee_id_temp", "department"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventoried.department", 'search_read', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function getAssetInventory(odoo, auditId) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["asset_inventory_id", "=", parseInt(auditId)]]);
    inParams.push(["id", "asset_id", "quantity_so_sach", "quantity_thuc_te", "status", "is_done"]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export async function getAssetInventoryLine(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([["id", "=", id]]);
    inParams.push([
      "id", "asset_id", "quantity_so_sach", "quantity_thuc_te", "asset_inventory_id", "status", "da_dan_tem", "asset_user_temporary", "validated_date", "note", "de_xuat_xu_ly", "giai_trinh", "latest_inventory_status", "is_done"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("asset.inventory.line", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getEmployeeTemporary(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = [];
    inParams.push([]);
    inParams.push([
      'id',
      'name',
      'employee_id',
      'user_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("hr.employee.temporary", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  });
}

export async function getSignDocumentById(odoo, user, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([["company_id", "=", user[0].company_id[0]], ["id", "=", id]]);

    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments",
      //  "stage_comment", 
      // "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentAway(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", "=", user[0].company_id[0]],
      '|',
      ['user_creator', '=', user[0].id],
      ['user_requester', '=', user[0].id],
    ]);
    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentArrive(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", "=", user[0].company_id[0]],
      ['status', '!=', 'draft'],
      ['user_creator', '!=', user[0].id],
      [
        'stage_actions.list_access_user',
        'child_of', user[0].id
      ],
    ]);
    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentArriveDone(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", "=", user[0].company_id[0]],
      ['status', '!=', 'draft'],
      ['document_stages.user_do_action', 'child_of', user[0].id],
      ['user_creator', '!=', user[0].id]
    ]);
    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentArriveProcess(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", "=", user[0].company_id[0]],
      ['status', '!=', 'draft'],
      ['current_stage.actions.list_access_user', 'child_of', user[0].id],
      ['user_creator', '!=', user[0].id]
    ]);
    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentArriveAwait(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", "=", user[0].company_id[0]],
      ['status', '!=', 'draft'],
      '!',
      ['document_stages.user_do_action', 'child_of', user[0].id],
      '!',
      ['current_stage.actions.list_access_user', 'child_of', user[0].id],
      ['stage_actions.list_access_user', 'child_of', user[0].id],
      ['user_creator', '!=', user[0].id]
    ]);
    inParams.push([
      "id", "name", "name_seq", "employee_creator", "employee_request", "user_creator", "company_id",
      "department_employee_request", "job_position_employee_request", "document_detail", "document_stages",
      "stage_actions", "current_stage",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status"
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getEmployeeBasedOnUserId(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      // ["user_id", "=", user[0].id],
    ]);
    inParams.push([
      'id',
      'name',
      'user_id',
      's_identification_id',
      'department_id',
      'job_id',
      'company_id',
      'department_id',
    ])
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("hr.employee.multi.company", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })


}

export async function getSignDocumentStage(odoo, user, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["sea_sign_document_id.id", '=', id],
      // ["company_id", "=", user[0].company_id[0]],
    ]);
    inParams.push([
      'id',
      'name',
      'stage_status',
      'status',
      'sea_sign_document_id',
      'process_list_employee',
      'actions',
      'user_do_action',
      'isCancel',
      'is_complete',
      'confirm_date',
      'comment',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document.stage", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDocumentStageAction(odoo, user, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["sea_sign_document_id.id", '=', id],
    ]);
    inParams.push([
      'id',
      'name',
      'order',
      'description',
      'next_stage_id',
      'sea_sign_document_id',
      'employee_do_action',
      "sea_sign_document_stage",
      "send_to_list_employee",
      'confirm',
      'status',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document.stage.action", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getCurrentStageAction(odoo, user, id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([Number(id)]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'get_current_stage_actions', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
      }
    });
  })
}

export async function confirmActionDocument(odoo, user, id) {
  return new Promise((resolve, reject) => {

    var inParams = [Number(id), false];
    // inParams.push([id, false]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document.stage.action", 'action_confirm', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getEmployeeMultiCompany(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", '=', user[0].company_id[0]],
      ['employee_current_status', '!=', 'resigned']
    ]);
    inParams.push([
      'id',
      'name',
      'user_id',
      's_identification_id',
      'department_id',
      'job_id',
      "company_id",
      "department_id",
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("hr.employee.multi.company", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getTemporaryLeaveType(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([]);
    inParams.push([
      'id',
      'name',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave.type", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignDetailModelLink(odoo) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([]);
    inParams.push([
      'id',
      'name',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.detail.model.link", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}


export async function getTemporaryLeave(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ['sea_sign_document_id.id', '=', id]
    ]);
    inParams.push([
      'id',
      'name',
      'leave_days',
      'reason_leaving',
      'leave_date_from',
      'leave_date_to',
      'sea_sign_document_id',
      'temporary_leave_line',
      'name',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getTemporaryLeaveLine(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ['temporary_leave_id.sea_sign_document_id.id', '=', id]
    ]);
    inParams.push([
      'id',
      'name',
      'leave_date_from',
      'leave_date_to',
      'num_leave_date_to',
      'leave_date_type',
      'leave_reason_type',
      'temporary_leave_id',
      'sea_sign_document_id',
      'active'
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave.line", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function createSignDocument(odoo, user, name, employee_request, document_detail, reason_leaving) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push({
      "id": 0,
      "name": name,
      "employee_request": employee_request,
      "user_creator": user[0].id,
      "company_id": user[0].company_id[0],
      "document_detail": document_detail,
      "status": 'draft',
      "reason_leaving_compute": reason_leaving,
    })
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'create', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
        console.log(assets)
      }
    });
  })
}


export async function createTemporaryLeaveLine(odoo, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type, temporary_leave_id, sea_sign_document_id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push({
      "leave_date_from": leave_date_from,
      "leave_date_to": leave_date_to,
      "num_leave_date_to": num_leave_date_to,
      "leave_reason_type": leave_reason_type,
      "leave_date_type": leave_date_type,
      "temporary_leave_id": temporary_leave_id,
      "sea_sign_document_id": sea_sign_document_id,
      'active': true,
    })
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave.line", 'create', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
        console.log(assets)
      }
    });
  })
}

export async function deleteTemporaryLeaveLine(odoo, id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave.line", 'unlink', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
        console.log(assets)
      }
    });
  })
}

export async function updateTemporaryLeaveLine(odoo, id, leave_date_from, leave_date_to, num_leave_date_to, leave_reason_type, leave_date_type) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    inParams.push({
      "leave_date_from": leave_date_from,
      "leave_date_to": leave_date_to,
      "num_leave_date_to": num_leave_date_to,
      "leave_reason_type": leave_reason_type,
      "leave_date_type": leave_date_type,
      'active': true,
    })
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave.line", 'write', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
        console.log(assets)
      }
    });
  })
}

export async function updateTemporaryLeave(odoo, id, reason_leaving) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    inParams.push({
      "reason_leaving": reason_leaving,
    })
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.temporary.leave", 'write', params, (err, assets) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(assets);
        console.log(assets)
      }
    });
  })
}
