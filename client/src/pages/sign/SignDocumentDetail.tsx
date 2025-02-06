/* eslint-disable react-hooks/exhaustive-deps */

import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Button, Col, Divider, Empty, GetProp, Row, Select, Steps, Table, TableProps, Tabs, Tag, DatePicker, message, InputNumber, Form, Input, } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import MainLayout from "components/app/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import useAsyncAction from "hooks/useAsyncAction";
import React, { useEffect, useState } from "react";
import { get_document_stage } from "stores/actions/document_stage";
import { IAdvancePaymentRequest, IDocumentStage, IDocumentStageAction, IEmployeeTemporary, IPaymentRequest, IResPartner, IResPartnerBank, ISignAdvancePayment, ISignDocument, ISignPayment, ITemporaryLeave, ITemporaryLeaveLine, ITemporaryLeaveType } from "interfaces";
import { colors } from "constants/color";
import { confirm_action, get_document_stage_action } from "stores/actions/document_stage_action";
import { get_current_stage_action } from "stores/actions/current_satge_action";
import PageLoading from "widgets/PageLoading";
import { get_document_away } from "stores/actions/sign_document";
import dayjs from 'dayjs';
import { differenceInDays } from "date-fns";
import { create_temporary_leave_line, delete_temporary_leave_line, get_temporary_leave_line, update_temporary_leave_line } from "stores/actions/temporary_leave_line";
import { get_temporary_leave, update_temporary_leave } from "stores/actions/temporary_leave";
import TextArea from "antd/es/input/TextArea";
import { get_advance_payment_request, update_advance_payment_request } from "stores/actions/advance_payment_request";
import { IAccountPaymentResFile } from "interfaces/account_payment_res_file";
import { get_payment_request, update_payment_request } from "stores/actions/payment_request";
import { create_payments, delete_payments, get_payments, update_payments } from "stores/actions/sign_payments";
import { create_advance_payments, delete_advance_payments, get_advance_payments, update_advance_payments } from "stores/actions/sign_advance_payments";
import moment from "moment";

const { RangePicker } = DatePicker;
interface DataType {
    key: number;
    name: string;
    action: React.ReactNode,
    next_step: React.ReactNode,
    send_to: React.ReactNode,
}
interface DataTemporaryLeaveLine {
    key: number,
    leave_type?: ITemporaryLeaveType,
    range_date?: Date[],
    date_type?: string,
    num_date?: number,
}


interface DataPayment {
    key: number,
    payment_contact?: string,
    payment_bill?: string,
    payment_date?: Date,
    payment_amount?: number,
}

interface DataAdvancePayment {
    key: number,
    name?: string,
    advanve_date?: Date,
    advance_amount?: number,
}
const SignDocumentDetail = () => {
    const { id } = useParams();
    const listSignDocument = useSelector((state: RootState) => state.sign_document?.data) as ISignDocument[] | null
    const navigate = useNavigate();
    const document_stage = useSelector((state: RootState) => state.document_stage?.data) as IDocumentStage[] | null;
    const document_stage_action = useSelector((state: RootState) => state.document_stage_action?.data) as IDocumentStageAction[] | null;
    const employee_temporary = useSelector((state: RootState) => state.employeeTemporary?.data) as IEmployeeTemporary[] | null;
    const current_satge_action_ids = useSelector((state: RootState) => state.currentStageAction?.data) as number[] | null;
    const temporary_leave = useSelector((state: RootState) => state.temporary_leave?.data) as ITemporaryLeave[] | null;
    const temporary_leave_line = useSelector((state: RootState) => state.temporary_leave_line?.data) as ITemporaryLeaveLine[] | null;
    const temporary_leave_type = useSelector((state: RootState) => state.temporary_leave_type?.data) as ITemporaryLeaveType[] | null;
    const signDocument = listSignDocument?.find((item) => item.id.toString() === id) as ISignDocument;
    const advance_payment_request = useSelector((state: RootState) => state.advance_payment_request?.data) as IAdvancePaymentRequest[] | null;
    const res_partner = useSelector((state: RootState) => state.res_partner?.data) as IResPartner[] | null;
    const account_payment_res_file = useSelector((state: RootState) => state.account_payment_res_file?.data) as IAccountPaymentResFile[] | null;

    const payment_request = useSelector((state: RootState) => state.payment_request?.data) as IPaymentRequest[] | null
    const sign_payment = useSelector((state: RootState) => state.sign_payments?.data) as ISignPayment[] | null
    const sign_advance_payment = useSelector((state: RootState) => state.sign_advance_payments?.data) as ISignAdvancePayment[] | null
    const partner_bank = useSelector((state: RootState) => state.partner_bank?.data) as IResPartnerBank[] | null;

    const [current_satge_action, setCurrentStageAction] = useState<IDocumentStageAction[]>([]);
    const [dataDetail, setDataDetail] = useState<DataTemporaryLeaveLine[]>()
    const [editting, setEditting] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const { executeAction, loading } = useAsyncAction();
    const [reasonLeave, setReasonLeave] = useState('')

    // tam ung
    const [partner_id, setPartnerId] = useState<IResPartner>();
    const [amount, setAmount] = useState<number>(0);
    const [advance_payment_description, setAdvancePaymentDescription] = useState<string>('');
    const [payment_method, setPaymentMethod] = useState<string>('')
    const [advance_file_id, setAdvanceFileId] = useState<IAccountPaymentResFile>();

    // de nghi thanh toan
    const [listAccount, setListAccount] = useState<IAccountPaymentResFile[] | null>(null)
    const [payment_content, setPaymentContent] = useState('')
    const [bank_id, setBankId] = useState<IResPartnerBank>()
    const [expire_date, setExpireDate] = useState<Date | undefined>(moment().toDate())
    const [remaining_amount, setRemainingAmount] = useState(0)
    const [payment_proposal_purpose, setPaymentProposalPurpose] = useState('')

    const [payment_row, setPaymentRow] = useState<DataPayment[]>()

    const [advance_row, setAdvanceRow] = useState<DataAdvancePayment[]>()



    const fetchDocumentStage = async () => {
        await executeAction(() => get_document_stage(signDocument.id), true)
    }

    const fetchDocumentStageAction = async () => {
        await executeAction(() => get_document_stage_action(signDocument.id), true)
    }

    const fetchCurrentStageAction = async () => {
        await executeAction(() => get_current_stage_action(signDocument.id), true)
    }
    const getCurrentStageAction = () => {
        const action = document_stage_action?.filter((item) => current_satge_action_ids?.includes(item.id)) as IDocumentStageAction[] || null;
        if (action === null) {
            setCurrentStageAction([])
        } else {
            setCurrentStageAction(action)
        }
    }
    const fetchDocumentById = async () => {
        // await executeAction(() => get_document_by_id(signDocument.id), true)
        await executeAction(() => get_document_away(), true)
    }
    const showErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    }

    const checkValid = () => {
        if (signDocument.document_detail[0] === 9) {
            if (partner_id === undefined) {
                showErrorMessage('Vui lòng chọn người tạm ứng')
                return false
            }
            if (amount === 0) {
                showErrorMessage('Vui lòng nhập số tiền')
                return false
            }
            if (advance_payment_description === '') {
                showErrorMessage('Vui lòng nhập lý do tạm ứng')
                return false
            }
        }
        if (signDocument.document_detail[0] === 10) {
            if (partner_id === undefined) {
                showErrorMessage('Vui lòng chọn đối tác')
                return false
            }
            if (payment_proposal_purpose === undefined || payment_proposal_purpose === '' || !payment_proposal_purpose) {
                showErrorMessage('Vui lòng nhập mục đích đề nghị thanh toán')
                return false
            }
            if (payment_method !== 'bank' && payment_method !== 'cash') {
                showErrorMessage('Vui lòng chọn hình thức thanh toán')
                return false
            }
            if (payment_method === 'bank') {
                if (bank_id === undefined) {
                    showErrorMessage('Vui lòng chọn tài khoản ngân hàng')
                    return false
                }
            }
        }
        return true
    }

    const handleConfirmAction = async (id: number) => {
        //// console.log(dataDetail.length)
        if (checkValid()) {
            if (signDocument.document_detail[0] === 7) {
                if (dataDetail?.length === 0) {
                    showErrorMessage('Vui lòng nhập đầy đủ thông tin chi tiết trước khi gửi văn bản.')
                    return false;
                } else {
                    await executeAction(() => confirm_action(id), true)
                    fetchDocumentById()
                    fetchDocumentStage()
                    fetchCurrentStageAction()
                }
            } else if (signDocument.document_detail[0] === 10) {
                if (payment_content === '') {
                    showErrorMessage('Vui lòng nhập nội dung thanh toán')
                    return false
                }
                // if (expire_date === undefined) {
                //     showErrorMessage('Vui lòng nhập thời hạn thanh toán')
                //     return false
                // }
                if (remaining_amount <= 0) {
                    showErrorMessage('Số tiền đề nghị thanh toán phải lớn hơn 0')
                    return false
                }

                let flag_payment = true
                let flag_advance = true
                // eslint-disable-next-line array-callback-return
                payment_row?.map((item) => {
                    if (item.payment_contact === undefined || item.payment_contact === '') {
                        flag_payment = false;
                    }
                    if (item.payment_bill === undefined || item.payment_bill === '') {
                        flag_payment = false;
                    }
                    if (item.payment_date === undefined) {
                        flag_payment = false;
                    }
                    if (item.payment_amount === undefined || item.payment_amount <= 0) {
                        flag_payment = false;
                    }
                })
                // eslint-disable-next-line array-callback-return
                advance_row?.map((item) => {
                    if (item.name === undefined || item.name === '') {
                        flag_advance = false;
                    }
                    if (item.advanve_date === undefined) {
                        flag_advance = false;
                    }
                    if (item.advance_amount === undefined || item.advance_amount <= 0) {
                        flag_advance = false;
                    }
                })

                if (!flag_payment) {
                    showErrorMessage('Hãy nhập đầy đủ thông tin số tiền cần thanh toán')
                    return false
                }
                if (!flag_advance) {
                    showErrorMessage('Hãy nhập đầy đủ thông tin số tiền đã tạm ứng')
                    return false
                }
            }
            await executeAction(() => confirm_action(id), true)
            fetchDocumentById()
            fetchDocumentStage()
            fetchCurrentStageAction()

            messageApi.open({
                type: 'success',
                content: 'Gửi văn bản thành công',
            });
        } else {
            showErrorMessage('Vui lòng nhập đầy đủ thông tin chi tiết trước khi gửi văn bản.')
        }
    }
    type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

    const columns: ColumnsType<DataType> = [
        {
            title: '',
            dataIndex: 'action',
        },
        {
            title: 'Mô tả',
            dataIndex: 'name',
        },
        {
            title: ' Bước kế tiếp',
            dataIndex: 'next_step',
        },
        {
            title: 'Gửi đến',
            dataIndex: 'send_to',
        },
    ];
    const data = current_satge_action.map<DataType>((action) => ({
        key: action.id,
        action: <><Button type="primary" value={action.name} title={action.name} onClick={() => { handleConfirmAction(action.id) }}>{action.name}</Button>  </>,
        name: action.description,
        next_step: <>{action.next_stage_id[1]}</>,
        send_to: <>{employee_temporary?.filter((emp) => action.send_to_list_employee.includes(emp.id)).map((emp) => {
            return <Tag key={emp.id}>
                {emp.name}
            </Tag>
        })}</>
    }))

    const columnsDetail: ColumnsType<DataTemporaryLeaveLine> = [
        {
            title: 'Hình thức nghỉ',
            dataIndex: 'leave_type',
            render(value, record, index) {
                return <>
                    <Select
                        showSearch
                        placeholder="Select a employee"
                        optionFilterProp="label"
                        style={{ width: '100%' }}
                        value={record.leave_type?.id}
                        onChange={(val: number) => { handleChangeLeaveType(index, val) }}
                        disabled={signDocument.status !== 'draft' || !editting}
                        options={temporary_leave_type === null ? [] :
                            temporary_leave_type?.map((item) => {
                                return {
                                    value: item.id,
                                    label: item.name,
                                }
                            })
                        }
                    />
                </>
            },
        },
        {
            title: 'Từ ngày - Đến ngày',
            dataIndex: 'range_date',
            render(value, record, index) {
                return <>
                    <RangePicker style={{ width: '100%' }}
                        value={record.range_date ? [dayjs(record.range_date[0].toString()), dayjs(record.range_date[1].toString())] : null}
                        format="DD/MM/YYYY"
                        disabled={signDocument.status !== 'draft' || !editting}
                        onChange={(dates, stringDate) => { handleChageRangeDate(index, dates, stringDate) }}
                    />
                </>
            },
        },
        {
            title: 'Cả ngày/nữa ngày',
            dataIndex: 'date_type',
            render(value, record, index) {
                return <>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'ca_ngay', label: "Cả ngày" },
                            { value: 'nua_ngay', label: "Nửa ngày" },
                        ]}
                        value={record.date_type}
                        disabled={signDocument.status !== 'draft' || !editting}
                        onChange={(value: string) => { handleChangeDateType(index, value) }}
                    />
                </>
            },
        },
        {
            title: 'Số ngày',
            dataIndex: 'num_date',
        },
        signDocument !== null ?
            signDocument.status === 'draft' && editting ? {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render(value, record, index) {
                    return <>
                        <Button title="Delete" icon={<DeleteOutlined />} onClick={() => { deleteRow(index) }}></Button>
                    </>
                },
            } : {}
            : {},
    ];

    const columns_payment: ColumnsType<DataPayment> = [
        {
            title: 'Số hợp đồng',
            dataIndex: 'payment_contact',
            key: 'payment_contact',
            render(value, record, index) {
                return <>
                    <Input
                        defaultValue={record.payment_contact}
                        readOnly={!editting || signDocument.status !== 'draft'}
                        onChange={(e) => {
                            if (e.target.value === null) {
                                record.payment_contact = undefined
                            } else {
                                record.payment_contact = e.target.value
                            }
                        }}
                    />
                </>
            },
        },
        {
            title: 'Số hóa đơn',
            dataIndex: 'payment_bill',
            key: 'payment_bill',
            render(value, record, index) {
                return <>
                    <Input
                        defaultValue={record.payment_bill}
                        readOnly={!editting || signDocument.status !== 'draft'}
                        onChange={(e) => {
                            if (e.target.value === null) {
                                record.payment_bill = undefined
                            } else {
                                record.payment_bill = e.target.value
                            }
                        }}
                    />
                </>
            },
        },
        {
            title: 'Ngày',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render(value, record, index) {
                return <>
                    <DatePicker
                        // value={record.payment_date}
                        defaultValue={record.payment_date ? moment(record.payment_date) : undefined}
                        disabled={!editting || signDocument.status !== 'draft'}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) => {
                            if (date === null) {
                                record.payment_date = undefined
                            } else {
                                record.payment_date = date.toDate()
                            }
                        }}
                    />
                </>
            },
        },
        {
            title: 'Số tiền',
            dataIndex: 'payment_amount',
            key: 'payment_amount',
            render(value, record, index) {
                return <>
                    <InputNumber
                        disabled={!editting || signDocument.status !== 'draft'}
                        style={{ width: '100%' }}
                        defaultValue={record ? record.payment_amount ? record.payment_amount : 0 : 0}
                        onChange={(value) => {
                            if (value === null) {
                                record.payment_amount = undefined
                            } else {
                                record.payment_amount = value
                            }
                            calRemainingAmount()
                        }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </>
            },
        },
        !editting || signDocument.status !== 'draft' ? {} : {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render(value, record, index) {
                return <>
                    <Button title="Delete" icon={<DeleteOutlined />} onClick={() => {
                        if (window.confirm("Bạn có xóa dòng này?")) {
                            const dataCoppy = payment_row?.filter((item) => item !== payment_row.at(index))
                            setPaymentRow(dataCoppy)
                        }
                    }} ></Button>
                </>
            },
        },
    ];
    const columns_advance: ColumnsType<DataAdvancePayment> = [
        // {
        //     title: 'Đợt',
        //     dataIndex: 'name',
        //     key: 'name',
        //     render(value, record, index) {
        //         return <>
        //             <Input
        //                 defaultValue={record.name}
        //                 readOnly={!editting || signDocument.status !== 'draft'}
        //                 onChange={(e) => {
        //                     // console.log(e.target.value)
        //                     if (e.target.value === null) {
        //                         record.name = undefined
        //                     } else {
        //                         record.name = e.target.value
        //                     }
        //                 }}
        //             />
        //         </>
        //     },
        // },
        {
            title: 'Ngày',
            dataIndex: 'advance_date',
            key: 'advance_date',
            render(value, record, index) {
                return <>
                    <DatePicker
                        defaultValue={record.advanve_date ? moment(record.advanve_date) : undefined}
                        disabled={!editting || signDocument.status !== 'draft'}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) => {
                            if (date === null) {
                                record.advanve_date = undefined
                            } else {
                                record.advanve_date = date.toDate()
                            }
                        }}
                    />
                </>
            },
        },
        {
            title: 'Số tiền',
            dataIndex: 'advance_amount',
            key: 'advance_amount',
            render(value, record, index) {
                return <>
                    <InputNumber
                        disabled={!editting || signDocument.status !== 'draft'}
                        style={{ width: '100%' }}
                        defaultValue={record ? record.advance_amount ? record.advance_amount : 0 : 0}
                        onChange={(value) => {
                            if (value === null) {
                                record.advance_amount = undefined
                            } else {
                                record.advance_amount = value
                            }
                            calRemainingAmount()
                        }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </>
            },
        },
        !editting || signDocument.status !== 'draft' ? {} : {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render(value, record, index) {
                return <>
                    <Button title="Delete" icon={<DeleteOutlined />} onClick={() => {
                        if (window.confirm("Bạn có xóa dòng này?")) {
                            const dataCoppy = advance_row?.filter((item) => item !== advance_row.at(index))
                            setAdvanceRow(dataCoppy)
                        }
                    }}></Button>
                </>
            },
        },
    ];
    const calRemainingAmount = () => {
        let advance = 0
        let paid = 0
        // eslint-disable-next-line array-callback-return
        payment_row?.map((item) => {
            paid += (item.payment_amount ? item.payment_amount : 0)
        })
        // eslint-disable-next-line array-callback-return
        advance_row?.map((item) => {
            advance += (item.advance_amount ? item.advance_amount : 0)
        })

        let amount = 0
        if (payment_proposal_purpose === 'dept_payment') {
            // setRemainingAmount(paid - advance)
            if (advance < paid) {
                amount = paid - advance
            }
        } else {
            amount = paid
        }

        setRemainingAmount(amount)
    }
    const deleteRow = (index: number) => {
        if (window.confirm("Bạn có xóa dòng này?")) {
            //console.log(index)
            const dataCoppy = dataDetail?.filter((_, i) => i !== index)
            //console.log(dataCoppy)
            setDataDetail(dataCoppy)
        }
    }
    const handelAddRow = () => {
        setDataDetail((prev) => {
            return [...(prev ? prev : []), {
                key: data?.length,
                dateType: undefined,
                leaveType: undefined,
                rangeDate: undefined,
            }]
        })
    }
    const handleChangeLeaveType = (index: number, value: number) => {
        //console.log(temporary_leave_type)
        const type = temporary_leave_type?.find((item) => item.id === value) as ITemporaryLeaveType || undefined
        const rowIndex = dataDetail?.at(index) as DataTemporaryLeaveLine

        rowIndex.leave_type = type;

        dataDetail?.map((item) => dataDetail.indexOf(item) === index ? rowIndex : item)
        setDataDetail(dataDetail)
    }

    const handleChangeDateType = (index: number, value: string) => {
        let dataCoppy = [...(dataDetail || [])]
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        rowIndex.date_type = value;
        rowIndex.num_date = calNumDateRow(index, dataCoppy)
        dataCoppy = dataCoppy?.map((item) => dataCoppy.indexOf(item) === index ? rowIndex : item)
        setDataDetail(dataCoppy)
    }

    const handleChageRangeDate = (index: number, dates: any, dateStrings: string[]) => {
        let dataCoppy = [...(dataDetail || [])]
        const dateMoment = dates as moment.Moment[]
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        rowIndex.range_date = [dateMoment[0].toDate(), dateMoment[1].toDate()];
        rowIndex.num_date = calNumDateRow(index, dataCoppy)
        dataCoppy = dataCoppy?.map((item) => dataCoppy.indexOf(item) === index ? rowIndex : item)
        setDataDetail(dataCoppy)
    }
    const calNumDateRow = (index: number, dataCoppy: DataTemporaryLeaveLine[] | null) => {
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        if (rowIndex.range_date && rowIndex.date_type) {
            if (rowIndex.date_type === 'ca_ngay') {
                return differenceInDays(rowIndex.range_date[1], rowIndex.range_date[0]) + 1
            }
            if (rowIndex.date_type === 'nua_ngay') {
                return (differenceInDays(rowIndex.range_date[1], rowIndex.range_date[0]) + 1) / 2
            }
        } else {
            return undefined
        }
    }

    const handleUpdate = async () => {
        if (checkValid()) {
            if (signDocument.document_detail[0] === 7) {
                if (temporary_leave) {
                    if (reasonLeave !== temporary_leave[0].reason_leaving) {
                        //update
                        await executeAction(() => update_temporary_leave(temporary_leave[0].id, reasonLeave), true)
                    }
                }
                //console.log(dataDetail?.map((item) => item.key))
                if (temporary_leave_line) {
                    temporary_leave_line?.map(async (line) => {
                        const dataItem = dataDetail?.find((item) => item.key === line.id) as DataTemporaryLeaveLine | null
                        if (dataItem === null) {
                            //console.log('delete' + line.id)
                            await executeAction(() => delete_temporary_leave_line(line.id), true)
                        }
                        else {
                            //console.log('update' + line.id)
                            await executeAction(() => update_temporary_leave_line(
                                dataItem.key,
                                dataItem.range_date ? convertDateToString(dataItem.range_date[0]) : '',
                                dataItem.range_date ? convertDateToString(dataItem.range_date[1]) : '',
                                dataItem.num_date ? dataItem.num_date : 0,
                                dataItem.leave_type ? dataItem.leave_type.id : 0,
                                dataItem.date_type ? dataItem.date_type : ''), true)
                        }
                    })
                }

                if (dataDetail && temporary_leave) {
                    dataDetail.map(async (item) => {
                        const dataItem = temporary_leave_line?.find((line) => line.id === item.key) as ITemporaryLeaveLine || null
                        if (dataItem === null) {
                            await executeAction(() => create_temporary_leave_line(
                                item.range_date ? convertDateToString(item.range_date[0]) : '',
                                item.range_date ? convertDateToString(item.range_date[1]) : '',
                                item.num_date ? item.num_date : 0,
                                item.leave_type ? item.leave_type.id : 0,
                                item.date_type ? item.date_type : '',
                                temporary_leave[0].id,
                                signDocument.id,
                            ), true)
                        }
                    })
                }
                await fetchTemporaryLeave(signDocument.id)
                await fetchTemporaryLeaveLine(signDocument.id)
            }

            if (signDocument.document_detail[0] === 9) {
                if (advance_payment_request !== null) {
                    if (advance_payment_request.length > 0) {
                        await executeAction(() => update_advance_payment_request(advance_payment_request[0].id, partner_id ? partner_id.id : 0, amount, advance_payment_description, payment_method, advance_file_id ? advance_file_id.id : undefined), true)
                        fetchAdvancePaymentRequest(signDocument.id)
                    }
                }
            }

            if (signDocument.document_detail[0] === 10) {
                if (payment_request !== null) {
                    if (payment_proposal_purpose === 'advance_payment') {
                        setAdvanceRow(undefined)
                    }
                    if (payment_request.length > 0) {
                        if (expire_date === undefined) {
                            console.log(3)
                            await executeAction(() => update_payment_request(signDocument.id, partner_id ? partner_id.id : 0, remaining_amount, payment_method, payment_proposal_purpose, advance_file_id ? advance_file_id.id : undefined, payment_content, undefined, bank_id ? bank_id.id : undefined), true)
                        } else {
                            if ((typeof expire_date) === 'string') {
                                console.log(2)
                                await executeAction(() => update_payment_request(signDocument.id, partner_id ? partner_id.id : 0, remaining_amount, payment_method, payment_proposal_purpose, advance_file_id ? advance_file_id.id : undefined, payment_content, expire_date ? expire_date.toString() : '', bank_id ? bank_id.id : undefined), true)
                            } else {
                                console.log(1)
                                await executeAction(() => update_payment_request(signDocument.id, partner_id ? partner_id.id : 0, remaining_amount, payment_method, payment_proposal_purpose, advance_file_id ? advance_file_id.id : undefined, payment_content, expire_date ? convertDateToString(expire_date) : '', bank_id ? bank_id.id : undefined), true)
                            }
                        }

                        sign_payment?.map(async (item) => {
                            const data_item = payment_row?.find((r) => r.key === item.id) as DataPayment | undefined
                            if (data_item === undefined) {
                                // delete
                                console.log('delete')
                                await executeAction(() => delete_payments(item.id), true)
                            } else {
                                // update
                                if (data_item.payment_date === undefined) {
                                    await executeAction(() => update_payments(data_item.key, data_item.payment_contact ? data_item.payment_contact : '', data_item.payment_bill ? data_item.payment_bill : '', '', data_item.payment_amount ? data_item.payment_amount : 0), true)
                                } else {
                                    if ((typeof data_item.payment_date) === 'string') {
                                        await executeAction(() => update_payments(data_item.key, data_item.payment_contact ? data_item.payment_contact : '', data_item.payment_bill ? data_item.payment_bill : '', data_item.payment_date ? data_item.payment_date.toString() : '', data_item.payment_amount ? data_item.payment_amount : 0), true)
                                    } else {
                                        await executeAction(() => update_payments(data_item.key, data_item.payment_contact ? data_item.payment_contact : '', data_item.payment_bill ? data_item.payment_bill : '', data_item.payment_date ? convertDateToString(data_item.payment_date) : '', data_item.payment_amount ? data_item.payment_amount : 0), true)
                                    }
                                }
                                // await executeAction(() => update_payments(data_item.key, data_item.payment_contact ? data_item.payment_contact : '', data_item.payment_bill ? data_item.payment_bill : '', data_item.payment_date ? convertDateToString(data_item.payment_date) : '', data_item.payment_amount ? data_item.payment_amount : 0), true)
                            }
                        })
                        payment_row?.map(async (item) => {
                            const data_item = sign_payment?.find((s) => s.id === item.key) as ISignPayment | undefined
                            payment_request?.map(async (pr) => {
                                if (data_item === undefined) {
                                    await executeAction(() => create_payments(item.payment_contact ? item.payment_contact : '', item.payment_bill ? item.payment_bill : '', item.payment_date ? convertDateToString(item.payment_date) : '', item.payment_amount ? item.payment_amount : 0, signDocument.id, pr.id), true)
                                }
                            })
                        })


                        sign_advance_payment?.map(async (item) => {
                            const data_item = advance_row?.find((r) => r.key === item.id) as DataAdvancePayment | undefined
                            if (data_item === undefined) {
                                // delete
                                console.log('delete')
                                await executeAction(() => delete_advance_payments(item.id), true)
                            } else {
                                // update
                                if (data_item.advanve_date === undefined) {
                                    await executeAction(() => update_advance_payments(data_item.key, data_item.name ? data_item.name : '', '', data_item.advance_amount ? data_item.advance_amount : 0), true)
                                } else {
                                    if ((typeof data_item.advanve_date) === 'string') {
                                        await executeAction(() => update_advance_payments(data_item.key, data_item.name ? data_item.name : '', data_item.advanve_date ? data_item.advanve_date.toString() : '', data_item.advance_amount ? data_item.advance_amount : 0), true)
                                    } else {
                                        await executeAction(() => update_advance_payments(data_item.key, data_item.name ? data_item.name : '', data_item.advanve_date ? convertDateToString(data_item.advanve_date) : '', data_item.advance_amount ? data_item.advance_amount : 0), true)
                                    }
                                }
                                // await executeAction(() => update_advance_payments(data_item.key, data_item.name ? data_item.name : '', data_item.advanve_date ? convertDateToString(data_item.advanve_date) : '', data_item.advance_amount ? data_item.advance_amount : 0), true)
                            }
                        })
                        advance_row?.map(async (item) => {
                            const data_item = sign_advance_payment?.find((s) => s.id === item.key) as ISignAdvancePayment | undefined
                            if (data_item === undefined) {
                                // create 
                                payment_request?.map(async (pr) => {
                                    await executeAction(() => create_advance_payments(item.name ? item.name : '', item.advanve_date ? convertDateToString(item.advanve_date) : '', item.advance_amount ? item.advance_amount : 0, signDocument.id, pr.id), true)
                                })
                            }
                        })

                        await fetchPaymentRequest()
                        await fetchSignPayment()
                        await fetchAdvancePayment()
                    }
                }
            }
            fetchDocumentById();
            setEditting(false)
            messageApi.open({
                type: 'success',
                content: 'Cập nhật văn bản thành công',
            });
        }
    }
    const fetchTemporaryLeave = async (id: number) => {
        await executeAction(() => get_temporary_leave(id), true)
    }
    const fetchTemporaryLeaveLine = async (id: number) => {
        await executeAction(() => get_temporary_leave_line(id), true)
    }

    const fetchAdvancePaymentRequest = async (id: number) => {
        await executeAction(() => get_advance_payment_request(id), true)
    }

    const convertDateToString = (d: Date) => {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }
    const btnCancel = () => {
        const lines = temporary_leave_line !== null ? temporary_leave_line?.map((item) => {
            return {
                key: item.id,
                leave_type: temporary_leave_type?.find((type) => type.id === item.leave_reason_type[0]) as ITemporaryLeaveType || null,
                range_date: [new Date(item.leave_date_from), new Date(item.leave_date_to)],
                date_type: item.leave_date_type,
                num_date: item.num_leave_date_to,
            }
        })
            : []
        setDataDetail(lines)
        setEditting(false)
    }
    const handleChangeReasonLeave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReasonLeave(e.target.value)
    }
    const fetchPaymentRequest = async () => {
        await executeAction(() => get_payment_request(signDocument.id), true)
    }
    const fetchSignPayment = async () => {
        await executeAction(() => get_payments(signDocument.id), true)
    }
    const fetchAdvancePayment = async () => {
        await executeAction(() => get_advance_payments(signDocument.id), true)
    }

    useEffect(() => {
        if (signDocument !== null) {
            fetchDocumentStage()
            fetchDocumentStageAction()
            fetchCurrentStageAction()
            if (signDocument.document_detail[0] === 7) {
                fetchTemporaryLeave(signDocument.id)
                fetchTemporaryLeaveLine(signDocument.id)
            } else if (signDocument.document_detail[0] === 9) {
                fetchAdvancePaymentRequest(signDocument.id)
            } else if (signDocument.document_detail[0] === 10) {
                fetchPaymentRequest()
                fetchSignPayment()
                fetchAdvancePayment()
            } else {

            }
        }
    }, [id])

    useEffect(() => {
        if (signDocument.document_detail[0] === 10) {
            if (payment_request !== null) {
                if (payment_request.length > 0) {
                    if (payment_request[0].pay_content) {
                        setPaymentContent(payment_request[0].pay_content)
                    } else {
                        setPaymentContent('')
                    }
                    if (payment_request[0].bank_ids) {
                        const bank = partner_bank?.find((item) => item.id === (payment_request[0].bank_ids?.at(0))) as IResPartnerBank | undefined
                        setBankId(bank)
                    } else {
                        setBankId(undefined)
                    }

                    setPaymentProposalPurpose(payment_request[0].payment_proposal_purpose)

                    if (signDocument.partner_id) {
                        const partner = res_partner?.find((item) => item.id === signDocument.partner_id?.at(0)) as IResPartner | undefined
                        setPartnerId(partner)
                    } else {
                        setPartnerId(undefined)
                    }

                    setExpireDate(payment_request[0].expire_date)
                    setRemainingAmount(payment_request[0].remaining_amount)
                    setPaymentMethod(payment_request[0].payment_method)
                }
            }
        }
    }, [payment_request, loading])

    useEffect(() => {
        const list = sign_payment?.map((item) => {
            return {
                key: item.id,
                payment_contact: item.payment_contract,
                payment_bill: item.payment_bill,
                payment_date: item.date,
                payment_amount: item.amount ? item.amount : 0,
            }
        })
        setPaymentRow(list)
    }, [sign_payment, loading])

    useEffect(() => {
        const list = sign_advance_payment?.map((item) => {
            return {
                key: item.id,
                name: item.name,
                advanve_date: item.date,
                advance_amount: item.amount,
            }
        })
        setAdvanceRow(list)
        // console.log(list)
    }, [sign_advance_payment, loading])

    useEffect(() => {
        const lines =
            temporary_leave_line !== null ? temporary_leave_line?.map<DataTemporaryLeaveLine>((item) => {
                return {
                    key: item.id,
                    leave_type: temporary_leave_type?.find((type) => type.id === item.leave_reason_type[0]) as ITemporaryLeaveType || null,
                    range_date: [new Date(item.leave_date_from), new Date(item.leave_date_to)],
                    date_type: item.leave_date_type,
                    num_date: item.num_leave_date_to,
                }
            })
                : undefined
        setDataDetail(lines)
    }, [temporary_leave_line, loading])

    useEffect(() => {
        if (temporary_leave) {
            if (temporary_leave.length > 0) {
                setReasonLeave(temporary_leave[0].reason_leaving)
            }
        } else {
            setReasonLeave('')
        }
    }, [temporary_leave])

    useEffect(() => {
        if (signDocument.document_detail[0] === 9) {
            if (advance_payment_request !== null) {
                console.log(advance_payment_request)
                if (advance_payment_request.length > 0) {
                    const partner = res_partner?.find((item) => item.id === advance_payment_request[0].partner_id[0])
                    const file = account_payment_res_file?.find((item) => item.id === (advance_payment_request[0].advance_file_id ? advance_payment_request[0].advance_file_id[0] : 0))
                    const list = account_payment_res_file?.filter((item) => item.partner_id[0] === advance_payment_request[0].partner_id[0]) as IAccountPaymentResFile[] || null
                    setListAccount(list)
                    setPartnerId(partner)
                    setAmount(advance_payment_request[0].amount)
                    setAdvancePaymentDescription(advance_payment_request[0].advance_payment_description)
                    setPaymentMethod(advance_payment_request[0].advance_payment_method)
                    setAdvanceFileId(file)
                } else {
                    setPartnerId(undefined)
                    setAmount(0)
                    setAdvancePaymentDescription('')
                    setPaymentMethod('')
                }
            } else {
                setPartnerId(undefined)
                setAmount(0)
                setAdvancePaymentDescription('')
                setPaymentMethod('')
            }
        }
    }, [advance_payment_request, loading, res_partner, id])


    useEffect(() => {
        getCurrentStageAction()
    }, [current_satge_action_ids])
    console.log(payment_request)
    return (
        <>
            {contextHolder}
            <MainLayout title={signDocument === undefined ? '' : signDocument.name}>
                {loading ? <PageLoading /> :
                    signDocument === undefined
                        ? <Empty /> :
                        <>
                            <div style={{
                                paddingBottom: '24px',
                            }}>
                                <Row>
                                    <Col xs={24} sm={4} md={2} lg={2} xl={2}>
                                        <Button title="Trở về" icon={<LeftOutlined />} onClick={async () => { navigate(-1) }} />
                                    </Col>
                                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                                        {signDocument.name}
                                    </Col>
                                </Row>
                            </div>
                            <div style={{
                                paddingBottom: '24px',
                            }}>
                                <Row>
                                    {editting ?
                                        <Row style={{ justifyContent: 'space-between' }}>
                                            <Col xs={24} sm={10} md={10} lg={5} xl={5}>
                                                <Button onClick={handleUpdate} icon={<CheckOutlined />} color="primary" variant="solid" style={{ marginBottom: '5px' }}>Lưu</Button>
                                            </Col>
                                            <Col xs={24} sm={10} md={10} lg={5} xl={5}>
                                                <Button onClick={btnCancel} icon={<CloseOutlined />} color="danger" variant="solid">Hủy bỏ</Button>
                                            </Col>
                                        </Row>
                                        :
                                        signDocument.status === 'draft' ? <>
                                            <Button onClick={() => {
                                                setEditting(true)
                                            }} icon={<EditOutlined />} color="primary" variant="solid">Cập nhật</Button>
                                        </> : <></>
                                    }
                                </Row>
                            </div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Thực hiện" key="1">
                                    <>
                                        <Divider orientation="left" style={{ borderColor: colors.border }}>
                                            <b style={{ fontSize: 24 }}>Information</b>
                                        </Divider>
                                        <div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Mã:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.name_seq}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Trạng thái:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.status}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Ngày gửi:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.sent_date}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Công ty: </b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.company_id[1]}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Người đề nghị:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.employee_request[1]}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Phòng/Ban:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.department_employee_request[1]}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Chức vụ:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.job_position_employee_request[1]}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{ paddingBottom: '10px' }}>
                                                <Row>
                                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                        <b>Mẫu tài liệu:</b>
                                                    </Col>
                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                        {signDocument.document_detail[1]}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>

                                        {signDocument.document_detail[0] === 7 ?
                                            <>
                                                <Divider orientation="left" style={{ borderColor: colors.border }}>
                                                    <b style={{ fontSize: 24 }}>ĐƠN XIN PHÉP NGHỈ</b>
                                                </Divider>

                                                <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Lý do nghỉ việc: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <TextArea
                                                                autoSize={{ minRows: 3, maxRows: 6 }}
                                                                // style={{  }}
                                                                value={reasonLeave}
                                                                readOnly={!editting || signDocument.status !== 'draft'}
                                                                onChange={(e) => {
                                                                    handleChangeReasonLeave(e)
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{ paddingBottom: '10px' }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <div style={{ paddingTop: '24px' }}>
                                                                <b>Chi tiết: </b>
                                                            </div>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                                            <Table columns={columnsDetail} dataSource={dataDetail} pagination={false} />
                                                            {signDocument.status === 'draft' && editting ?
                                                                <Button style={{
                                                                    borderRadius: '24px',
                                                                    marginTop: '5px',
                                                                }} type="dashed" icon={<PlusCircleFilled />} onClick={handelAddRow}>Thêm dòng</Button>
                                                                : <></>}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </> : <></>}
                                        {signDocument.document_detail[0] === 9 ?
                                            <Form>
                                                <Divider orientation="left" style={{ borderColor: colors.border }}>
                                                    <b style={{ fontSize: 24 }}>Đề Nghị Tạm Ứng</b>
                                                </Divider>
                                                <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Thanh toán cho: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <Select
                                                                style={{ width: '100%' }}
                                                                value={partner_id?.id}
                                                                onChange={(value: number) => {
                                                                    const partner = res_partner?.find((item) => item.id === value)
                                                                    setPartnerId(partner)
                                                                    const list = account_payment_res_file?.filter((item) => item.partner_id[0] === value) as IAccountPaymentResFile[] || null
                                                                    setListAccount(list)
                                                                    setAdvanceFileId(undefined)
                                                                }}
                                                                disabled={!editting || signDocument.status !== 'draft'}
                                                                options={
                                                                    res_partner?.map((item) => {
                                                                        return {
                                                                            value: item.id,
                                                                            label: item.name,
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Số tiền: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <InputNumber
                                                                style={{ width: '100%' }}
                                                                // required={true}
                                                                value={amount ?? 0}
                                                                disabled={!editting || signDocument.status !== 'draft'}
                                                                onChange={(value) => {
                                                                    if (value === null) {
                                                                        setAmount(0)
                                                                    } else {
                                                                        setAmount(value)
                                                                    }
                                                                }}
                                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            // parser={value => value ? value.replace(/₫\s?|(,*)/g, '') : ''}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Lý do tạm ứng: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <TextArea
                                                                autoSize={{ minRows: 3, maxRows: 6 }}
                                                                // style={{ width: '50%' }}
                                                                disabled={!editting || signDocument.status !== 'draft'}
                                                                value={advance_payment_description}
                                                                onChange={(e) => {
                                                                    setAdvancePaymentDescription(e.target.value)
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Hình thức thanh toán	: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <Select
                                                                style={{ width: '100%' }}
                                                                disabled={!editting || signDocument.status !== 'draft'}
                                                                value={payment_method}
                                                                onChange={(value: string) => { setPaymentMethod(value) }}
                                                                options={[
                                                                    { value: 'bank', label: 'Chuyển khoản' },
                                                                    { value: 'cash', label: 'Tiền mặt' },
                                                                ]}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                                {partner_id ? <div style={{
                                                    paddingBottom: '10px'
                                                }}>
                                                    <Row>
                                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                            <b>Hồ sơ: </b>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                            <Select
                                                                style={{ width: '100%' }}
                                                                disabled={!editting || signDocument.status !== 'draft'}
                                                                // defaultValue={advance_file_id ? advance_file_id.id : undefined}
                                                                value={advance_file_id?.id}
                                                                onChange={(value: number) => {
                                                                    const file = account_payment_res_file?.find((item) => item.id === value)
                                                                    setAdvanceFileId(file)
                                                                }}
                                                                options={
                                                                    listAccount !== null ? listAccount.map((ac) => {
                                                                        return {
                                                                            value: ac.id,
                                                                            label: ac.name,
                                                                        }
                                                                    }) : []
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div> : <></>}
                                            </Form> : <></>}

                                        {
                                            signDocument.document_detail[0] === 10 ?
                                                <>
                                                    <Divider orientation="left" style={{ borderColor: colors.border }}>
                                                        <b style={{ fontSize: 20 }}>ĐỀ NGHỊ THANH TOÁN</b>
                                                    </Divider>
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Thanh toán cho: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    value={partner_id ? partner_id.id : undefined}
                                                                    disabled={!editting || signDocument.status !== 'draft'}
                                                                    onChange={(value: number) => {
                                                                        const partner = res_partner?.find((item) => item.id === value)
                                                                        setPartnerId(partner)
                                                                    }}
                                                                    options={
                                                                        res_partner?.map((item) => {
                                                                            return {
                                                                                value: item.id,
                                                                                label: item.name,
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Mục đích đề nghị thanh toán: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    value={payment_proposal_purpose ? payment_proposal_purpose : ''}
                                                                    disabled={!editting || signDocument.status !== 'draft'}
                                                                    defaultValue={payment_proposal_purpose}
                                                                    onChange={(value: string) => { setPaymentProposalPurpose(value) }}
                                                                    options={[
                                                                        { value: 'advance_payment', label: 'Advance Payment' },
                                                                        { value: 'dept_payment', label: 'Dept Payment' },
                                                                    ]}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Nội dung thanh toán: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <TextArea
                                                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                                                    // style={{ width: '50%' }}
                                                                    readOnly={!editting || signDocument.status !== 'draft'}
                                                                    value={payment_content}
                                                                    onChange={(e) => {
                                                                        setPaymentContent(e.target.value)
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Thời hạn thanh toán: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <DatePicker style={{ width: '100%' }}
                                                                    value={expire_date ? moment(expire_date) : undefined}
                                                                    readOnly={!editting || signDocument.status !== 'draft'}
                                                                    format={['DD/MM/YYYY']}
                                                                    onChange={(date: moment.Moment, dateString: string | string[]) => {
                                                                        if (date === null) {
                                                                            setExpireDate(undefined)
                                                                        } else {
                                                                            setExpireDate(date.toDate())
                                                                        }
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Hình thức thanh toán: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    value={payment_method}
                                                                    disabled={!editting || signDocument.status !== 'draft'}
                                                                    onChange={(value: string) => {
                                                                        setPaymentMethod(value)
                                                                        calRemainingAmount()
                                                                    }}
                                                                    options={[
                                                                        { value: 'bank', label: 'Chuyển khoản' },
                                                                        { value: 'cash', label: 'Tiền mặt' },
                                                                    ]}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {payment_method === 'bank' ?
                                                        <>
                                                            <div style={{
                                                                paddingBottom: '10px'
                                                            }}>
                                                                <Row>
                                                                    <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                        <b>Tài khoản ngân hàng: </b>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                        <Select
                                                                            style={{ width: '100%' }}
                                                                            value={bank_id ? bank_id.id : undefined}
                                                                            onChange={(value: number) => {
                                                                                const bank = partner_bank?.find((item) => item.id === value) as IResPartnerBank || undefined
                                                                                setBankId(bank)
                                                                            }}
                                                                            options={partner_bank === null ? [] : partner_bank.map((item) => {
                                                                                return {
                                                                                    value: item.id,
                                                                                    label: item.acc_number,
                                                                                }
                                                                            })}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{
                                                                paddingBottom: '10px'
                                                            }}>
                                                                <Row>
                                                                    <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                        <b>Chủ tài khoản:</b>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                        <Input
                                                                            readOnly={true}
                                                                            value={bank_id ? bank_id.acc_holder_name ? bank_id.acc_holder_name : '' : ''} />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{
                                                                paddingBottom: '10px'
                                                            }}>
                                                                <Row>
                                                                    <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                        <b>Số tài khoản:</b>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                        <Input
                                                                            readOnly={true}
                                                                            value={bank_id ? bank_id.acc_number : ''} />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{
                                                                paddingBottom: '10px'
                                                            }}>
                                                                <Row>
                                                                    <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                        <b>Tên ngân hàng:</b>
                                                                    </Col>
                                                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                        <Input
                                                                            readOnly={true}
                                                                            value={bank_id ? bank_id.bank_id[1] : ''} />
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                        </> : <></>}
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Số tiền cần thanh toán:</b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Table columns={columns_payment}
                                                                    dataSource={payment_row}
                                                                    pagination={false}
                                                                    style={{ width: '100%' }} />
                                                                {!editting || signDocument.status !== 'draft' ? <></> :
                                                                    <Button style={{
                                                                        borderRadius: '20px',
                                                                        marginTop: '5px',
                                                                    }} type="dashed" icon={<PlusCircleFilled />} onClick={() => {
                                                                        setPaymentRow((prev) => {
                                                                            return [...(prev ? prev : []), {
                                                                                key: prev ? prev.length > 0 ? prev[prev.length - 1].key + 1 : 0 : 0,
                                                                                payment_contact: undefined,
                                                                                payment_bill: undefined,
                                                                                payment_date: undefined,
                                                                                payment_amount: undefined,
                                                                            }]
                                                                        })
                                                                        // console.log(payment_row)
                                                                    }}>Thêm dòng</Button>}

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {payment_proposal_purpose === 'advance_payment' ? <></> :
                                                        <div style={{
                                                            paddingBottom: '10px'
                                                        }}>
                                                            <Row>
                                                                <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                    <b>Số tiền đã tạm ứng:</b>
                                                                </Col>
                                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                    <Table columns={columns_advance}
                                                                        dataSource={advance_row}
                                                                        pagination={false}
                                                                        style={{ width: '100%' }} />
                                                                    {
                                                                        !editting || signDocument.status !== 'draft' ?
                                                                            <></> :
                                                                            <Button style={{
                                                                                borderRadius: '20px',
                                                                                marginTop: '5px',
                                                                            }} type="dashed" icon={<PlusCircleFilled />} onClick={() => {
                                                                                setAdvanceRow((prev) => {
                                                                                    return [...(prev ? prev : []), {
                                                                                        key: prev ? prev.length > 0 ? prev[prev.length - 1].key + 1 : 0 : 0,
                                                                                        name: undefined,
                                                                                        advanve_date: undefined,
                                                                                        advance_amount: undefined,
                                                                                    }]
                                                                                })
                                                                            }}>Thêm dòng</Button>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    }
                                                    <div style={{
                                                        paddingBottom: '10px'
                                                    }}>
                                                        <Row>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Số tiền đề nghị thanh toán:</b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    // disabled={!editting || signDocument.status !== 'draft'}
                                                                    value={remaining_amount}
                                                                    onChange={(value) => {
                                                                        if (value === null) {
                                                                            setRemainingAmount(0)
                                                                        } else {
                                                                            setRemainingAmount(value)
                                                                        }
                                                                    }}
                                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                // parser={value => value ? value.replace(/₫\s?|(,*)/g, '') : ''}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    {partner_id ? <>
                                                        <Row style={{ paddingTop: '10px' }}>
                                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                                <b>Hồ sơ: </b>
                                                            </Col>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Select
                                                                    disabled={!editting || signDocument.status !== 'draft'}
                                                                    style={{ width: '100%' }}
                                                                    onChange={(value: number) => {
                                                                        const account = listAccount?.find((item) => item.id === value) as IAccountPaymentResFile || undefined
                                                                        setAdvanceFileId(account)
                                                                    }}
                                                                    options={listAccount === null ? []
                                                                        : listAccount.map((item) => {
                                                                            return {
                                                                                value: item.id,
                                                                                label: item.name,
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </> : <></>}
                                                </>
                                                : <></>
                                        }

                                        {current_satge_action.length !== 0 && !editting ? <div style={{
                                            paddingTop: '24px'
                                        }}>
                                            <Table
                                                columns={columns}
                                                dataSource={data}
                                                pagination={false}
                                            />
                                        </div> : <></>}
                                    </>
                                </TabPane>
                                <TabPane tab="Quy trình" key="2">
                                    <Steps
                                        direction="vertical"
                                        // current={5}
                                        items={document_stage == null
                                            ? []
                                            : document_stage.map((item) => {
                                                return {
                                                    title: item.name,
                                                    description: <>
                                                        {
                                                            item.status === 'done' ?
                                                                <>
                                                                    Nhân viên thực hiện: {item.user_do_action[1]}<br />
                                                                    Ngày xác nhận: {item.confirm_date}<br />
                                                                </>
                                                                : <></>
                                                        }

                                                        Nhân viên tiếp nhận văn bản:
                                                        {
                                                            employee_temporary?.filter((emp) => item.process_list_employee.includes(emp.id)).map((emp) => {
                                                                return emp === employee_temporary?.filter((emp) => item.process_list_employee.includes(emp.id))[employee_temporary?.filter((emp) => item.process_list_employee.includes(emp.id)).length - 1] ?
                                                                    emp.name : emp.name + ', '
                                                            })
                                                        }
                                                        <br />
                                                        Ý kiến: {item.comment}
                                                    </>,
                                                    subTitle: item.stage_status,
                                                    status: item.status === 'waiting' ? 'wait'
                                                        : item.status === 'done' ? 'finish'
                                                            : item.status === 'process' ? 'process'
                                                                : 'error',
                                                }
                                            }
                                            )
                                        }
                                    />
                                </TabPane>
                            </Tabs>
                        </>
                }
            </MainLayout>
        </>
    )

}

export default SignDocumentDetail;