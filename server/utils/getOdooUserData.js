export async function getUserData(odoo, uid) {
  return new Promise((resolve, reject) => {
    const params = [[['id', '=', uid]], ['id', 'name', 'company_ids', 'company_id', 'email', 'phone', 'mobile', 'login', 'image', 'job_id', 'department_id', 'employee_id', 'groups_id', 'in_group_177']];
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
      "partner_id",
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
      "partner_id",
      // "current_stage_actions",
      // "sea_sign_attachments", "stage_comment", "reason_leaving_compute", "temporary_leave_line",
      "sent_date", "status",
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
      "partner_id",
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
      "partner_id",
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
      "partner_id",
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
      "partner_id",
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

export async function getAdvancePaymentRequest(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ['sea_sign_document_id.id', '=', id]
    ]);
    inParams.push([
      'id',
      'payment_date',
      'amount',
      'partner_id',
      'advance_file_id',
      'advance_payment_description',
      'advance_payment_method',
      'sea_sign_document_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payment.request", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}


export async function createSignDocument(odoo, user, name, employee_request, document_detail,
  reason_leaving,
  partner_id, ap_amount, advance_payment_description, payment_method, advance_file_id,
  payment_content, expire_date, bank_id, remaining_amount, payment_proposal_purpose, pr_payments, pr_advance_payments) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    if (document_detail == 7) {
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
    } else if (document_detail == 9) {
      inParams.push({
        "id": 0,
        "name": name,
        "employee_request": employee_request,
        "user_creator": user[0].id,
        "company_id": user[0].company_id[0],
        "document_detail": document_detail,
        "status": 'draft',
        "partner_id": partner_id,
        "ap_amount": ap_amount,
        "advance_payment_description": advance_payment_description,
        "advance_payment_method": payment_method,
        "advance_file_id": advance_file_id,
      })
    } else if (document_detail == 10) {
      if (payment_method == 'cash') {
        inParams.push({
          "id": 0,
          "name": name,
          "employee_request": employee_request,
          "user_creator": user[0].id,
          "company_id": user[0].company_id[0],
          "document_detail": document_detail,
          "status": 'draft',
          "partner_id": partner_id,
          "pr_pay_content": payment_content,
          "pr_expire_date": expire_date,
          "pr_payment_method": payment_method,
          "pr_remaining_amount": remaining_amount,
          "pr_bank_ids": bank_id,
          "pr_advance_file_id": advance_file_id,
          "payment_proposal_purpose": payment_proposal_purpose,
          'pr_payments': pr_payments,
          'pr_advance_payments': pr_advance_payments,
        })
      } else {
        inParams.push({
          "id": 0,
          "name": name,
          "employee_request": employee_request,
          "user_creator": user[0].id,
          "company_id": user[0].company_id[0],
          "document_detail": document_detail,
          "status": 'draft',
          "partner_id": partner_id,
          "pr_pay_content": payment_content,
          "pr_expire_date": expire_date,
          "pr_payment_method": payment_method,
          "pr_remaining_amount": remaining_amount,
          "pr_advance_file_id": advance_file_id,
          "payment_proposal_purpose": payment_proposal_purpose,
          'pr_payments': pr_payments,
          'pr_advance_payments': pr_advance_payments,
        })
      }
    } else {
      inParams.push({
        "id": 0,
        "name": name,
        "employee_request": employee_request,
        "user_creator": user[0].id,
        "company_id": user[0].company_id[0],
        "document_detail": document_detail,
      })
    }
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

export async function getResPartner(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      // ["company_id", "=", user[0].company_id[0]],
    ]);
    inParams.push([
      'id',
      'name',
      'email',
      'user_id',
      'phone',
      'display_name',
      'company_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("res.partner", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function updateAdvancePaymentRequest(odoo, id, amount, advance_payment_description, advance_payment_method, partner_id, advance_file_id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    inParams.push({
      "partner_id": partner_id,
      "advance_payment_description": advance_payment_description,
      "advance_payment_method": advance_payment_method,
      "amount": amount,
      "advance_file_id": advance_file_id,
    })
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payment.request", 'write', params, (err, assets) => {
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

export async function getAccountPaymentResFile(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", '=', user[0].company_id[0]]
    ]);
    inParams.push([
      'id',
      'name',
      'code',
      'partner_id',
      'description',
      'company_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("account.payment.res.file", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getResPartnerBank(odoo, user) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["company_id", '=', user[0].company_id[0]]
    ]);
    inParams.push([
      'id',
      'acc_number',
      'sanitized_acc_number',
      'acc_holder_name',
      'partner_id',
      'bank_id',
      'company_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("res.partner.bank", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function createSignPayments(odoo, payment_contract, payment_bill, amount, date, sea_sign_document_id, payment_request_id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    console.log("payment_request_id:" + payment_request_id)
    if (date == '') {
      inParams.push({
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "amount": amount,
        'sea_sign_document_id': sea_sign_document_id,
        "payment_request_id": payment_request_id,
      })
    } else {
      inParams.push({
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "amount": amount,
        "date": date,
        'sea_sign_document_id': sea_sign_document_id,
        "payment_request_id": payment_request_id,
      })
    }
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.payments", 'create', params, (err, assets) => {
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

export async function updateSignPayments(odoo, id, payment_contract, payment_bill, amount, date) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id])
    if (date === '') {
      inParams.push({
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "amount": amount,
        "date": null
      })
    } else {
      inParams.push({
        "payment_contract": payment_contract,
        "payment_bill": payment_bill,
        "amount": amount,
        "date": date,
      })
    }
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.payments", 'write', params, (err, assets) => {
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

export async function deleteSignPayments(odoo, id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.payments", 'unlink', params, (err, assets) => {
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

export async function createAdvancePayments(odoo, name, amount, date, sea_sign_document_id, payment_request_id) {
  return new Promise((resolve, reject) => {
    console.log("payment_request_id:" + payment_request_id)
    var inParams = [];
    if (date == '') {
      inParams.push({
        "amount": amount,
        'sea_sign_document_id': sea_sign_document_id,
        'payment_request_id': payment_request_id,
      })
    } else {
      inParams.push({
        "amount": amount,
        "date": date,
        'sea_sign_document_id': sea_sign_document_id,
        'payment_request_id': payment_request_id,
      })
    }
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payments", 'create', params, (err, assets) => {
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

export async function updateAdvancePayments(odoo, id, name, amount, date) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id])
    if (date == '') {
      inParams.push({
        "name": name,
        "amount": amount,
        "date": null
      })
    } else {
      inParams.push({
        "name": name,
        "amount": amount,
        "date": date,
      })
    }
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payments", 'write', params, (err, assets) => {
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
export async function deleteAdvancePayments(odoo, id) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payments", 'unlink', params, (err, assets) => {
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

export async function getPaymentRequest(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    inParams.push([
      ["sea_sign_document_id.id", '=', id]
    ]);
    inParams.push([
      'id',
      'name',
      'advance_file_id',
      'remaining_amount',
      'sea_sign_document_id',
      'company_id',
      'pay_content',
      'payment_method',
      'expire_date',
      'payment_date',
      'acc_holder_name',
      'partner_account_address',
      'account_number',
      'bank_name',
      'bank_address',
      'bank_ids',
      'partner_id',
      'payment_proposal_purpose',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.payment.request", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignPayments(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    console.log(id)
    inParams.push([
      ["payment_request_id.sea_sign_document_id.id", '=', id]
    ]);
    inParams.push([
      'id',
      'name',
      'payment_contract',
      'payment_bill',
      'amount',
      'date',
      'sea_sign_document_id',
      'payment_request_id',
      'expire_date',
      'payment_date',
      'acc_holder_name',
      'partner_account_address',
      'account_number',
      'bank_name',
      'bank_address',
      'bank_ids',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.payments", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function getSignAdvancePayments(odoo, id) {
  return new Promise((resolve, reject) => {
    const inParams = []
    console.log('aaa: ', id)
    inParams.push([
      ['payment_request_id.sea_sign_document_id.id', '=', id]
    ]);
    inParams.push([
      'id',
      'name',
      'amount',
      'date',
      'payment_request_id',
      'sea_sign_document_id',
    ]);
    inParams.push(0);
    const params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.advance.payments", 'search_read', params, (err, assets) => {
      if (err) {
        reject(err);
      } else {
        resolve(assets);
      }
    });
  })
}

export async function updatePaymentRequest(odoo, id, advance_file_id, remaining_amount, pay_content, payment_method, expire_date, bank_ids, partner_id, payment_proposal_purpose) {
  return new Promise((resolve, reject) => {
    var inParams = [];
    inParams.push([id]);
    if (payment_method == 'bank') {
      inParams.push({
        "partner_id": partner_id,
        "pr_pay_content": pay_content,
        "pr_expire_date": expire_date ? expire_date : null,
        "pr_payment_method": payment_method,
        "pr_remaining_amount": remaining_amount,
        "pr_bank_ids": bank_ids,
        "pr_advance_file_id": advance_file_id,
        "payment_proposal_purpose": payment_proposal_purpose
      })
    } else {
      inParams.push({
        "partner_id": partner_id,
        "pr_pay_content": pay_content,
        "pr_expire_date": expire_date ? expire_date : null,
        "pr_payment_method": payment_method,
        "pr_remaining_amount": remaining_amount,
        "pr_advance_file_id": advance_file_id,
        "payment_proposal_purpose": payment_proposal_purpose
      })
    }
    var params = [];
    params.push(inParams);
    odoo.execute_kw("sea.sign.document", 'write', params, (err, assets) => {
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


