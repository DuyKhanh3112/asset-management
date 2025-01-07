import { CheckOutlined, DeleteOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, Collapse, DatePicker, DatePickerProps, Divider, Form, GetProp, List, message, Row, Select, Table, TablePaginationConfig, TableProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import MainLayout from "components/app/MainLayout"
import { colors } from "constants/color";
import { ICompany, IEmployeeMultiCompany, ISignDetail, ISignDocument, ITemporaryLeave, ITemporaryLeaveLine, ITemporaryLeaveType } from "interfaces";
import { IUser } from "interfaces/user";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "stores/reducers";
import { differenceInDays, set } from 'date-fns';
import useAsyncAction from "hooks/useAsyncAction";
import PageLoading from "widgets/PageLoading";
import { create_sign_document, get_document_away } from "stores/actions/sign_document";
import { get_temporary_leave } from "stores/actions/temporary_leave";
import { create_temporary_leave_line, get_temporary_leave_line } from "stores/actions/temporary_leave_line";

interface DataTemporaryLeaveLine {
    leaveType?: ITemporaryLeaveType,
    rangeDate?: Date[],
    dateType?: string,
    num_date?: number
}
const { RangePicker } = DatePicker;
const SignDocumentCreate = () => {
    const navigate = useNavigate()
    const employee_multi_company = useSelector((state: RootState) => state.employee_multi_company?.data) as IEmployeeMultiCompany[] | null;
    const temporary_leave_type = useSelector((state: RootState) => state.temporary_leave_type?.data) as ITemporaryLeaveType[] | null;
    const sign_detail = useSelector((state: RootState) => state.sign_detail?.data) as ISignDetail[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as IUser[] | null;
    const company = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
    const { executeAction, loading } = useAsyncAction();

    const [selectEmployee, setSelectEmployee] = useState<IEmployeeMultiCompany>()
    const [template, setTemplate] = useState(0)
    const [data, setData] = useState<DataTemporaryLeaveLine[]>()
    const [reasonLeave, setReasonLeave] = useState('')
    var temporary_leave = useSelector((state: RootState) => state.temporary_leave?.data) as ITemporaryLeave[] | null;
    var temporary_leave_line = useSelector((state: RootState) => state.temporary_leave_line?.data) as ITemporaryLeaveLine[] | null;

    const [messageApi, contextHolder] = message.useMessage();

    const onChangeEmployee = (id: number) => {
        const emp = employee_multi_company?.find((item) => item.id === id) as IEmployeeMultiCompany || null;
        setSelectEmployee(emp)
    }

    const onChangeTemplate = (value: number) => {
        setTemplate(value)
    }

    const handleChangeLeaveType = (index: number, value: number) => {
        const type = temporary_leave_type?.find((item) => item.id === value) as ITemporaryLeaveType || null
        const rowIndex = data?.at(index) as DataTemporaryLeaveLine
        rowIndex.leaveType = type;
        data?.map((item) => data.indexOf(item) === index ? rowIndex : item)
        setData(data)
    }

    const handleChangeDateType = (index: number, value: string) => {
        let dataCoppy = [...(data || [])]
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        rowIndex.dateType = value;
        rowIndex.num_date = calNumDateRow(index, dataCoppy)
        dataCoppy = dataCoppy?.map((item) => dataCoppy.indexOf(item) === index ? rowIndex : item)
        setData(dataCoppy)
    }
    const handelAddRow = () => {
        setData((prev) => {
            return [...(prev ? prev : []), {
                // key: data?.length
                dateType: undefined,
                leaveType: undefined,
                rangeDate: undefined,
            }]
        })
    }
    const calNumDateRow = (index: number, dataCoppy: DataTemporaryLeaveLine[] | null) => {
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        if (rowIndex.rangeDate && rowIndex.dateType) {
            if (rowIndex.dateType === 'ca_ngay') {
                return differenceInDays(rowIndex.rangeDate[1], rowIndex.rangeDate[0]) + 1
            }
            if (rowIndex.dateType === 'nua_ngay') {
                return (differenceInDays(rowIndex.rangeDate[1], rowIndex.rangeDate[0]) + 1) / 2
            }
        } else {
            return undefined
        }
    }
    const handleChageRangeDate = (index: number, dates: any, dateStrings: string[]) => {
        let dataCoppy = [...(data || [])]
        const dateMoment = dates as moment.Moment[]
        const rowIndex = dataCoppy?.at(index) as DataTemporaryLeaveLine
        rowIndex.rangeDate = [dateMoment[0].toDate(), dateMoment[1].toDate()];
        rowIndex.num_date = calNumDateRow(index, dataCoppy)
        dataCoppy = dataCoppy?.map((item) => dataCoppy.indexOf(item) === index ? rowIndex : item)

        setData(dataCoppy)
    }

    const deleteRow = (index: number) => {
        if (window.confirm("Bạn có xóa dòng này?")) {
            const dataCoppy = data?.filter((item) => item !== data.at(index))
            setData(dataCoppy)
        }
    }

    useEffect(() => {
        setSelectEmployee(undefined)
    }, [user])

    type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
    const columns: ColumnsType<DataTemporaryLeaveLine> = [
        {
            title: 'Hình thức nghỉ',
            dataIndex: 'leave_type',
            key: 'leave_type',
            render(value, record, index) {
                return <>
                    <Select
                        showSearch
                        placeholder="Select a employee"
                        optionFilterProp="label"
                        style={{ width: '100%' }}
                        onChange={(value: number) => { handleChangeLeaveType(index, value) }}
                        onSearch={() => { }}
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
            key: 'range_date',
            render(value, record, index) {
                return <>
                    <RangePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        onChange={(dates, stringDate) => { handleChageRangeDate(index, dates, stringDate) }} />
                </>
            },
        },
        {
            title: 'Cả ngày/nữa ngày',
            dataIndex: 'date_type',
            key: 'date_type',
            render(value, record, index) {
                return <>
                    <Select
                        style={{ width: '100%' }}
                        options={[
                            { value: 'ca_ngay', label: "Cả ngày" },
                            { value: 'nua_ngay', label: "Nửa ngày" },
                        ]}
                        onChange={(value: string) => { handleChangeDateType(index, value) }}
                    />
                </>
            },
        },
        {
            title: 'Số ngày',
            dataIndex: 'num_date',
            key: 'num_day',
            render(value, record, index) {
                return <>{data?.at(index)?.num_date}</>
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render(value, record, index) {
                return <>
                    <Button title="Delete" icon={<DeleteOutlined />} onClick={() => { deleteRow(index) }}></Button>
                </>
            },
        },
    ];
    const fetchDocumentAway = async () => {
        console.log('load away')
        await executeAction(() => get_document_away(), true)
    }
    const fetchTemporaryLine = async (id: number) => {
        const res = await executeAction(() => get_temporary_leave_line(id), true)
        console.log('line')
        console.log(res)
    }

    const handleSubmit = async () => {
        if (checkValid()) {
            let id = 0
            const detail = sign_detail?.find((item) => item.id === template) as ISignDetail
            const company_short_name = company?.find((item) => item.id === selectEmployee?.company_id[0])?.short_name
            const name = detail.name + ' - ' + company_short_name + ' - ' + selectEmployee?.name[1]
            const res = await executeAction(() => create_sign_document(name, selectEmployee ? selectEmployee.id : 0, template, reasonLeave), true)
            if (res?.data) {
                id = res?.data
                // fetchTemporary(res.data)
                const resLeave = await executeAction(() => get_temporary_leave(res.data), true)
                // const document_temporary_leave = temporary_leave?.find((item) => item.sea_sign_document_id[0] === res.data) as ITemporaryLeave || null
                // console.log(document_temporary_leave)
                if (resLeave?.data) {
                    data?.map(async (line) => {
                        console.log(line)
                        await executeAction(() => create_temporary_leave_line(
                            line.rangeDate ? convertDateToString(line.rangeDate[0]) : '',
                            line.rangeDate ? convertDateToString(line.rangeDate[1]) : '',
                            line.num_date ? line.num_date : 0,
                            line.leaveType ? line.leaveType.id : 0,
                            line.dateType ? line.dateType : '',
                            resLeave?.data[0].id,
                            res?.data,
                        ), true)
                    })
                }
            }
            setReasonLeave('')
            setData(undefined)
            setSelectEmployee(undefined)
            setTemplate(0)
            fetchDocumentAway()
            fetchTemporaryLine(id)
            messageApi.open({
                type: 'success',
                content: 'Tạo văn bản thành công',
            });
            console.log(temporary_leave)
            console.log(temporary_leave_line)
        }
    }
    const checkValid = () => {
        if (selectEmployee === undefined) {
            showErrorMessage('Vui lòng chọn người đề nghị')
            return false
        }
        if (template === 0) {
            showErrorMessage('Vui lòng mẫu tài liệu')
            return false
        }
        if (template === 7) {
            if (reasonLeave === '') {
                showErrorMessage('Vui lòng nhập lý do nghỉ việc')
                return false
            }
            let valid = true
            data?.map((item) => {
                if (item.dateType && item.leaveType && item.rangeDate) {
                    return true
                } else {
                    valid = false
                    return false
                }
            })
            if (!valid) {
                showErrorMessage('Vui lòng nhập đầy đủ chi tiết')
                return false
            }
        }
        return true
    }

    const showErrorMessage = (content: string) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    }
    const convertDateToString = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
    const handleChangeReasonLeave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReasonLeave(e.target.value)
    }
    return (
        <>
            {contextHolder}
            <MainLayout title="Tạo văn bản">
                {loading ? <PageLoading /> : <>
                    <div style={{
                        paddingBottom: '20px'
                    }}>
                        <Row>
                            <Col span={2}>
                                <Button title="Trở lại" icon={<LeftOutlined />} onClick={() => { navigate(-1) }} >Trở lại</Button>
                            </Col>
                            <Col span={2}>
                                <Button type="primary" icon={<CheckOutlined />} onClick={handleSubmit}>Lưu</Button>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Divider orientation="left" style={{ borderColor: colors.border }}>
                            <b style={{ fontSize: 20 }}>INFORMATION</b>
                        </Divider>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Người đề nghị:</b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    <Select
                                        showSearch
                                        placeholder="Select a employee"
                                        optionFilterProp="label"
                                        style={{ width: '50%' }}
                                        onChange={(value: number) => { onChangeEmployee(value) }}
                                        options={employee_multi_company === null ? [] :
                                            employee_multi_company?.map((item) => {
                                                return {
                                                    value: item.id,
                                                    label: item.s_identification_id + ' - ' + item.name[1],
                                                }
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Mã SC: </b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    {selectEmployee === undefined || selectEmployee === undefined ? '' : selectEmployee.s_identification_id}
                                </Col>
                            </Row>
                        </div>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Phòng/Ban: </b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    {selectEmployee === undefined || selectEmployee === undefined ? '' : selectEmployee.department_id[1]}
                                </Col>
                            </Row>
                        </div>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Chức vụ: </b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    {selectEmployee === undefined || selectEmployee === undefined ? '' : selectEmployee.job_id[1]}
                                </Col>
                            </Row>
                        </div>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Công ty: </b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    {selectEmployee === undefined || selectEmployee === undefined ? '' : selectEmployee.company_id[1]}
                                </Col>
                            </Row>
                        </div>
                        <div style={{ paddingBottom: '10px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <b>Mẫu Tài liệu: </b>
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                    <Select
                                        showSearch
                                        placeholder="Select a template"
                                        optionFilterProp="label"
                                        style={{ width: '50%' }}
                                        onChange={(value: number) => { onChangeTemplate(value) }}
                                        onSearch={() => { }}
                                        options={
                                            sign_detail?.map((item) => {
                                                return {
                                                    label: item.name,
                                                    value: item.id,
                                                }
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>
                        {template === 7 ?
                            <>
                                <Divider orientation="left" style={{ borderColor: colors.border }}>
                                    <b style={{ fontSize: 20 }}>ĐƠN XIN PHÉP NGHỈ</b>
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
                                                // style={{ width: '50%' }}
                                                value={reasonLeave}
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
                                        <Col xs={24} sm={24} md={24} lg={24} xl={18}>
                                            <Table columns={columns}
                                                dataSource={data}
                                                pagination={false}
                                                style={{ width: '100%' }} />
                                            <Button style={{
                                                borderRadius: '20px',
                                                marginTop: '5px',
                                            }} type="dashed" icon={<PlusCircleFilled />} onClick={handelAddRow}>Thêm dòng</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </>
                            : <></>}
                    </div>
                </>}
            </MainLayout>
        </>
    )
}

export default SignDocumentCreate;