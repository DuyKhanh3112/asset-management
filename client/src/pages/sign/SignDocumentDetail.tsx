/* eslint-disable react-hooks/exhaustive-deps */

import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Button, Col, Divider, Empty, GetProp, Row, Select, Steps, Table, TableProps, Tabs, Tag, DatePicker, message, InputNumber, Form, } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import MainLayout from "components/app/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import useAsyncAction from "hooks/useAsyncAction";
import React, { useEffect, useState } from "react";
import { get_document_stage } from "stores/actions/document_stage";
import { IAdvancePaymentRequest, IDocumentStage, IDocumentStageAction, IEmployeeTemporary, IResPartner, ISignDocument, ITemporaryLeave, ITemporaryLeaveLine, ITemporaryLeaveType } from "interfaces";
import { colors } from "constants/color";
import { confirm_action, get_document_stage_action } from "stores/actions/document_stage_action";
import { get_current_stage_action } from "stores/actions/current_satge_action";
import PageLoading from "widgets/PageLoading";
import { get_document_by_id } from "stores/actions/sign_document";
import dayjs from 'dayjs';
import { differenceInDays } from "date-fns";
import { create_temporary_leave_line, delete_temporary_leave_line, get_temporary_leave_line, update_temporary_leave_line } from "stores/actions/temporary_leave_line";
import { get_temporary_leave, update_temporary_leave } from "stores/actions/temporary_leave";
import TextArea from "antd/es/input/TextArea";
import { get_advance_payment_request, update_advance_payment_request } from "stores/actions/advance_payment_request";
import { set } from "lodash";

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
    const signDocument = listSignDocument?.find((item) => item.id.toString() === id) as ISignDocument || null;
    const advance_payment_request = useSelector((state: RootState) => state.advance_payment_request?.data) as IAdvancePaymentRequest[] | null;
    const res_partner = useSelector((state: RootState) => state.res_partner?.data) as IResPartner[] | null;
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
        await executeAction(() => get_document_by_id(signDocument.id), true)
    }
    const showErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    }

    const checkValid = () => {
        if (signDocument.document_detail[0] === 7) {
            if (reasonLeave === '') {
                showErrorMessage('Vui lòng nhập lý do nghỉ việc')
                return false
            }
            let valid = true
            dataDetail?.map((item) => {
                if (item.date_type && item.leave_type && item.range_date) {
                    return true
                } else {
                    valid = false
                    return false
                }
            })
            if (!valid) {
                showErrorMessage('Vui lòng nhập đầy đủ thông tin chi tiết')
                return false
            }
        }
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
        return true
    }

    const handleConfirmAction = async (id: number) => {
        // console.log(dataDetail.length)
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
            } else {
                await executeAction(() => confirm_action(id), true)
                fetchDocumentById()
                fetchDocumentStage()
                fetchCurrentStageAction()
            }
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
                        const dataItem = dataDetail?.find((item) => item.key === line.id) as DataTemporaryLeaveLine || null
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
                        await executeAction(() => update_advance_payment_request(advance_payment_request[0].id, partner_id ? partner_id.id : 0, amount, advance_payment_description, payment_method), true)
                        fetchAdvancePaymentRequest(signDocument.id)
                    }
                }
            }
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

    const convertDateToString = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
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

    useEffect(() => {
        if (signDocument !== null) {
            fetchDocumentStage()
            fetchDocumentStageAction()
            fetchCurrentStageAction()
            if (signDocument.document_detail[0] === 7) {
                fetchTemporaryLeave(signDocument.id)
                fetchTemporaryLeaveLine(signDocument.id)
            }
            if (signDocument.document_detail[0] === 9) {
                fetchAdvancePaymentRequest(signDocument.id)
            }
        }
    }, [id])

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
        if (advance_payment_request !== null) {
            if (advance_payment_request.length > 0) {
                const partner = res_partner?.find((item) => item.id === advance_payment_request[0].partner_id[0])
                console.log(advance_payment_request[0])
                console.log(partner)
                setPartnerId(partner)
                setAmount(advance_payment_request[0].amount)
                setAdvancePaymentDescription(advance_payment_request[0].advance_payment_description)
                setPaymentMethod(advance_payment_request[0].advance_payment_method)
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
    }, [advance_payment_request, loading, res_partner, id])


    useEffect(() => {
        getCurrentStageAction()
    }, [current_satge_action_ids])

    return (
        <>
            {contextHolder}
            <MainLayout title={signDocument === null ? '' : signDocument.name}>
                {loading ? <PageLoading /> :
                    signDocument == null
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
                                                                readOnly={!editting}
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
                                                                defaultValue={payment_method}
                                                                onChange={(value: string) => { setPaymentMethod(value) }}
                                                                options={[
                                                                    { value: 'bank', label: 'Chuyển khoản' },
                                                                    { value: 'cash', label: 'Tiền mặt' },
                                                                ]}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Form> : <></>}

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