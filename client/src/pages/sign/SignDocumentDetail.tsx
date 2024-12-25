/* eslint-disable react-hooks/exhaustive-deps */

import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Button, Col, Divider, Empty, GetProp, Row, Select, Steps, Table, TableProps, Tabs, Tag, DatePicker, message, } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import MainLayout from "components/app/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";
import useAsyncAction from "hooks/useAsyncAction";
import React, { useEffect, useState } from "react";
import { get_document_stage } from "stores/actions/document_stage";
import { IDocumentStage, IDocumentStageAction, IEmployeeTemporary, ISignDocument, ITemporaryLeave, ITemporaryLeaveLine, ITemporaryLeaveType } from "interfaces";
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

    const [current_satge_action, setCurrentStageAction] = useState<IDocumentStageAction[]>([]);

    const [dataDetail, setDataDetail] = useState<DataTemporaryLeaveLine[]>()
    const [editting, setEditting] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const { executeAction, loading } = useAsyncAction();
    const [reasonLeave, setReasonLeave] = useState('')

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
            setEditting(false)
        }
    }
    const fetchTemporaryLeave = async (id: number) => {
        await executeAction(() => get_temporary_leave(id), true)
    }
    const fetchTemporaryLeaveLine = async (id: number) => {
        await executeAction(() => get_temporary_leave_line(id), true)
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
            //console.log('load')
            fetchDocumentStage()
            fetchDocumentStageAction()
            fetchCurrentStageAction()
            fetchTemporaryLeave(signDocument.id)
            fetchTemporaryLeaveLine(signDocument.id)
        }
    }, [id])

    useEffect(() => {
        //console.log(temporary_leave_line)
        //console.log(temporary_leave)
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
                //console.log(temporary_leave)
                setReasonLeave(temporary_leave[0].reason_leaving)
            }
        } else {
            setReasonLeave('')
        }
    }, [temporary_leave])
    useEffect(() => {
        getCurrentStageAction()
    }, [current_satge_action_ids])

    return loading ? <PageLoading /> : (
        <>
            {contextHolder}
            <MainLayout title={signDocument === null ? '' : signDocument.name}>
                {
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