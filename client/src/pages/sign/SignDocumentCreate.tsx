import { CheckOutlined, DeleteOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, DatePicker, Divider, GetProp, Input, InputNumber, message, Row, Select, Table, TableProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import MainLayout from "components/app/MainLayout"
import { colors } from "constants/color";
import { ICompany, IEmployeeMultiCompany, IResPartner, ISignDetail, ITemporaryLeave, ITemporaryLeaveLine, ITemporaryLeaveType } from "interfaces";
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
import { IAccountPaymentResFile } from "interfaces/account_payment_res_file";
import { IResPartnerBank } from "interfaces/partner_bank";
import { create_payments } from "stores/actions/sign_payments";
import { create_advance_payments } from "stores/actions/sign_advance_payments";
import { get_payment_request, update_payment_request } from "stores/actions/payment_request";

interface DataTemporaryLeaveLine {
    leaveType?: ITemporaryLeaveType,
    rangeDate?: Date[],
    dateType?: string,
    num_date?: number
}
const { RangePicker } = DatePicker;

interface DataPayment {
    payment_contact?: string,
    payment_bill?: string,
    payment_date?: Date,
    payment_amount?: number,
    purcharse_order?: string,
}

interface DataAdvancePayment {
    name?: string,
    advanve_date?: Date,
    advance_amount?: number,
}
const SignDocumentCreate = () => {
    const navigate = useNavigate()
    const employee_multi_company = useSelector((state: RootState) => state.employee_multi_company?.data) as IEmployeeMultiCompany[] | null;
    const temporary_leave_type = useSelector((state: RootState) => state.temporary_leave_type?.data) as ITemporaryLeaveType[] | null;
    const sign_detail = useSelector((state: RootState) => state.sign_detail?.data) as ISignDetail[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as IUser[] | null;
    const company = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
    const res_partner = useSelector((state: RootState) => state.res_partner?.data) as IResPartner[] | null;
    const account_payment_res_file = useSelector((state: RootState) => state.account_payment_res_file?.data) as IAccountPaymentResFile[] | null;
    const partner_bank = useSelector((state: RootState) => state.partner_bank?.data) as IResPartnerBank[] | null;
    const { executeAction, loading } = useAsyncAction();

    const [selectEmployee, setSelectEmployee] = useState<IEmployeeMultiCompany>()
    const [template, setTemplate] = useState(0)
    const [data, setData] = useState<DataTemporaryLeaveLine[]>()
    const [reasonLeave, setReasonLeave] = useState('')
    var temporary_leave = useSelector((state: RootState) => state.temporary_leave?.data) as ITemporaryLeave[] | null;
    var temporary_leave_line = useSelector((state: RootState) => state.temporary_leave_line?.data) as ITemporaryLeaveLine[] | null;

    const [messageApi, contextHolder] = message.useMessage();

    const [partner_id, setPartnerId] = useState<IResPartner>()
    const [ap_amount, setPaymentAmount] = useState(0)
    const [advance_payment_description, setAdvancePaymentDescription] = useState('')
    const [payment_method, setPaymentMethod] = useState('cash')
    const [advance_file_id, setAdvanceFileId] = useState<IAccountPaymentResFile>()
    const [listAccount, setListAccount] = useState<IAccountPaymentResFile[] | null>(null)

    const [payment_content, setPaymentContent] = useState('')
    const [bank_id, setBankId] = useState<IResPartnerBank>()
    const [expire_date, setExpireDate] = useState<Date | undefined>(moment().toDate())
    const [remaining_amount, setRemainingAmount] = useState(0)
    const [payment_proposal_purpose, setPaymentProposalPurpose] = useState('dept_payment')
    const [payment_row, setPaymentRow] = useState<DataPayment[]>([{
        payment_contact: undefined,
        payment_bill: undefined,
        payment_date: undefined,
        payment_amount: 0,
    }])

    const [advance_row, setAdvanceRow] = useState<DataAdvancePayment[]>([{
        name: undefined,
        advanve_date: undefined,
        advance_amount: 0,
    }])

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

    const columns_payment: ColumnsType<DataPayment> = [
        {
            title: 'Số hợp đồng',
            dataIndex: 'payment_contact',
            key: 'payment_contact',
            render(value, record, index) {
                return <>
                    <Input
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
        {
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
                    }}></Button>
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
        //                 onChange={(e) => {
        //                     console.log(e.target.value)
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
        {
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
        payment_row.map((item) => {
            paid += (item.payment_amount ? item.payment_amount : 0)
        })
        advance_row.map((item) => {
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

    const fetchDocumentAway = async () => {
        console.log('load away')
        await executeAction(() => get_document_away(), true)
    }
    const fetchTemporaryLine = async (id: number) => {
        const res = await executeAction(() => get_temporary_leave_line(id), true)
        console.log('line')
        console.log(res)
    }

    const handleCreateDocument = async () => {
        if (checkValid()) {
            let id = 0
            const detail = sign_detail?.find((item) => item.id === template) as ISignDetail
            const company_short_name = company?.find((item) => item.id === selectEmployee?.company_id[0])?.short_name
            const name = detail.name + ' - ' + company_short_name + ' - ' + selectEmployee?.name[1]
            let pr_payment = [] as any[]
            let pr_advance_payment = [] as any[]
            if (template === 10) {
                payment_row.map((item) => {
                    pr_payment.push([0, 'virtual_786',
                        {
                            'partner_id': partner_id ? partner_id.id : 0,
                            'name': '',
                            'payment_contract': item.payment_contact ? item.payment_contact : '',
                            'payment_bill': item.payment_bill ? item.payment_bill : '',
                            'date': item.payment_date ? convertDateToString(item.payment_date) : null,
                            'amount': item.payment_amount ? item.payment_amount : 0,
                            // 'purchase_order': ''
                        }
                    ])
                })

                advance_row.map((item) => {
                    pr_advance_payment.push([0, 'virtual_786', {
                        'date': item.advanve_date ? convertDateToString(item.advanve_date) : null,
                        'amount': item.advance_amount,
                    }])
                })
            }


            const res = await executeAction(() => create_sign_document(name, selectEmployee ? selectEmployee.id : 0, template,
                reasonLeave, partner_id ? partner_id.id : 0, ap_amount, advance_payment_description, payment_method, advance_file_id ? advance_file_id.id : undefined,
                payment_content ? payment_content : '', expire_date ? convertDateToString(expire_date) : '', bank_id ? bank_id.id : 0, remaining_amount ? remaining_amount : 0,
                payment_proposal_purpose ? payment_proposal_purpose : '', pr_payment, pr_advance_payment
            ), true)
            if (res?.data) {
                id = res?.data
                if (template === 7) {
                    const resLeave = await executeAction(() => get_temporary_leave(res.data), true)
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
                if (template === 9) {
                    console.log('tạm ứng')
                }
                if (template === 10) {
                    console.log('đề nghị thanh toán')
                    const res_payment_request = await executeAction(() => get_payment_request(res.data), true)
                    console.log(res_payment_request)
                    if (res_payment_request?.data) {
                        // payment_row.map(async (item) => {
                        //     await executeAction(() => create_payments(item.payment_contact ? item.payment_contact : '',
                        //         item.payment_bill ? item.payment_bill : '',
                        //         item.payment_date ? convertDateToString(item.payment_date) : '',
                        //         item.payment_amount ? item.payment_amount : 0,
                        //         id,
                        //         res_payment_request.data[0].id), true)
                        // })

                        // advance_row.map(async (item) => {
                        //     await executeAction(() => create_advance_payments(
                        //         item.name ? item.name : '',
                        //         item.advanve_date ? convertDateToString(item.advanve_date) : '',
                        //         item.advance_amount ? item.advance_amount : 0,
                        //         id,
                        //         res_payment_request.data[0].id
                        //     ), true)
                        // })
                        // calRemainingAmount()
                        // await executeAction(() => update_payment_request(res_payment_request.data[0].id, partner_id ? partner_id.id : 0, remaining_amount, payment_method, payment_proposal_purpose, advance_file_id ? advance_file_id.id : undefined, payment_content, expire_date ? convertDateToString(expire_date) : '', bank_id ? bank_id.id : undefined), true)
                    }
                }
            }
            setReasonLeave('')
            setData(undefined)
            setSelectEmployee(undefined)
            setTemplate(0)
            fetchDocumentAway()
            fetchTemporaryLine(id)
            setPartnerId(undefined)
            setPaymentContent('')
            setExpireDate(moment().toDate())
            setBankId(undefined)
            setPaymentRow([
                {
                    payment_contact: undefined,
                    payment_bill: undefined,
                    payment_date: undefined,
                    payment_amount: 0,
                }
            ])
            setAdvanceRow([
                {
                    name: undefined,
                    advanve_date: undefined,
                    advance_amount: 0,
                }
            ])
            setRemainingAmount(0)
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
        if (template === 9) {
            if (partner_id === undefined) {
                showErrorMessage('Vui lòng chọn đối tác')
                return false
            }
            if (ap_amount === 0) {
                showErrorMessage('Vui lòng nhập số tiền')
                return false
            }
            if (advance_payment_description === '') {
                showErrorMessage('Vui lòng nhập lý do tạm ứng')
                return false
            }
        }
        if (template === 10) {
            if (partner_id === undefined) {
                showErrorMessage('Vui lòng chọn đối tác')
                return false
            }
            if (payment_proposal_purpose === '') {
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

    const handleChangeResPartner = (value: number) => {
        const partner = res_partner?.find((item) => item.id === value) as IResPartner || null
        setPartnerId(partner)
        const list = account_payment_res_file?.filter((item) => item.partner_id[0] === value) as IAccountPaymentResFile[] || null
        setListAccount(list)
    }
    return (
        <>
            {contextHolder}
            <MainLayout title="Tạo văn bản">
                {loading ? <PageLoading /> : <>
                    <div style={{
                        paddingBottom: '20px'
                    }}>
                        <div style={{
                            paddingBottom: '24px',
                        }}>
                            <Row>
                                <Col xs={24} sm={6} md={6} lg={4} xl={3}>
                                    <Button title="Trở lại" icon={<LeftOutlined />} onClick={() => { navigate(-1) }} >Trở lại</Button>
                                </Col>
                                <Col xs={24} sm={6} md={6} lg={4} xl={3}>
                                    <Button type="primary" icon={<CheckOutlined />} onClick={handleCreateDocument}>Lưu</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Divider orientation="left" style={{ borderColor: colors.border }}>
                                <b style={{ fontSize: 20 }}>INFORMATION</b>
                            </Divider>
                            <div style={{ paddingBottom: '10px' }}>
                                <Row>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <b>Người đề nghị:</b>
                                    </Col>
                                    <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                                        <Select
                                            showSearch
                                            placeholder="Select a employee"
                                            optionFilterProp="label"
                                            style={{ width: '100%' }}
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
                                    <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                                        <Select
                                            showSearch
                                            placeholder="Select a template"
                                            optionFilterProp="label"
                                            style={{ width: '100%' }}
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
                        </div>
                        {/* đơn xin phép nghỉ id=7*/}
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
                        {/* tạm ứng id=9 */}
                        {template === 9 ?
                            <>
                                <Divider orientation="left" style={{ borderColor: colors.border }}>
                                    <b style={{ fontSize: 20 }}>Đề Nghị Tạm Ứng</b>
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
                                                showSearch
                                                optionFilterProp="label"
                                                style={{ width: '100%' }}
                                                onChange={(value: number) => { handleChangeResPartner(value) }}
                                                options={
                                                    res_partner?.map((item) => {
                                                        return {
                                                            value: item.id,
                                                            label: item.name + (item.phone ? ' - ' + item.phone : ''),
                                                        }
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                            <b>Số tiền: </b>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                // required={true}
                                                value={ap_amount ?? 0}
                                                onChange={(value) => {
                                                    if (value === null) {
                                                        setPaymentAmount(0)
                                                    } else {
                                                        setPaymentAmount(value)
                                                    }
                                                }}
                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            // parser={value => value ? value.replace(/₫\s?|(,*)/g, '') : ''}
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                            <b>Lý do tạm ứng: </b>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <TextArea
                                                autoSize={{ minRows: 3, maxRows: 6 }}
                                                // style={{ width: '50%' }}
                                                value={advance_payment_description}
                                                onChange={(e) => {
                                                    setAdvancePaymentDescription(e.target.value)
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                            <b>Hình thức thanh toán: </b>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Select
                                                style={{ width: '100%' }}
                                                defaultValue={payment_method}
                                                onChange={(value: string) => { setPaymentMethod(value) }}
                                                options={[
                                                    { value: 'cash', label: 'Chuyển khoản' },
                                                    { value: 'bank', label: 'Tiền mặt' },
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                    {partner_id ? <>
                                        <Row style={{ paddingTop: '10px' }}>
                                            <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                <b>Hồ sơ: </b>
                                            </Col>
                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    // defaultValue={payment_method}
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
                                </div>
                            </>
                            : <></>}
                        {template === 10 ?
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
                                                onChange={(value: number) => { handleChangeResPartner(value); console.log(value) }}
                                                options={
                                                    res_partner?.map((item) => {
                                                        return {
                                                            value: item.id,
                                                            label: item.name + (item.phone ? ' - ' + item.phone : ''),
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
                                                defaultValue={payment_proposal_purpose}
                                                onChange={(value: string) => {
                                                    setPaymentProposalPurpose(value)
                                                    calRemainingAmount()
                                                }}
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
                                                defaultValue={expire_date ? moment(expire_date) : undefined}
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
                                                        defaultValue={bank_id ? bank_id.id : undefined}
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
                                        {/* <div style={{
                                            paddingBottom: '10px'
                                        }}>
                                            <Row>
                                                <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                    <b>Địa chỉ:</b>
                                                </Col>
                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                </Col>
                                            </Row>
                                        </div> */}
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
                                        {/* <div style={{
                                            paddingBottom: '10px'
                                        }}>
                                            <Row>
                                                <Col xs={20} sm={20} md={6} lg={6} xl={6}>
                                                    <b>Địa chỉ ngân hàng:</b>
                                                </Col>
                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                                                </Col>
                                            </Row>
                                        </div> */}
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
                                            <Button style={{
                                                borderRadius: '20px',
                                                marginTop: '5px',
                                            }} type="dashed" icon={<PlusCircleFilled />} onClick={() => {
                                                setPaymentRow((prev) => {
                                                    return [...(prev ? prev : []), {
                                                        payment_contact: undefined,
                                                        payment_bill: undefined,
                                                        payment_date: undefined,
                                                        payment_amount: undefined,
                                                    }]
                                                })
                                            }}>Thêm dòng</Button>

                                        </Col>
                                    </Row>
                                </div>
                                {payment_proposal_purpose === 'advance_payment' ? <></> : <div style={{
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
                                            <Button style={{
                                                borderRadius: '20px',
                                                marginTop: '5px',
                                            }} type="dashed" icon={<PlusCircleFilled />} onClick={() => {
                                                setAdvanceRow((prev) => {
                                                    return [...(prev ? prev : []), {
                                                        name: undefined,
                                                        advanve_date: undefined,
                                                        advance_amount: undefined,
                                                    }]
                                                })
                                            }}>Thêm dòng</Button>
                                        </Col>
                                    </Row>
                                </div>}

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
                                                // required={true}

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
                            : <></>}
                    </div>
                </>}
            </MainLayout>
        </>
    )
}

export default SignDocumentCreate;