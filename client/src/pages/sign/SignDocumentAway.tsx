/* eslint-disable react-hooks/exhaustive-deps */
import { ISignDetail, ISignDocument } from "interfaces";
import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Badge, Button, Card, Col, Form, List, Row, Select } from "antd";
import { IUser } from "interfaces/user";
import MainLayout from "components/app/MainLayout";
import { get_document_away } from "stores/actions/sign_document";
import useAsyncAction from "hooks/useAsyncAction";
import PageLoading from "widgets/PageLoading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

const SignDocumentAway = () => {
    const signDocument = useSelector((state: RootState) => state.sign_document?.data) as ISignDocument[] | null;
    const signDetail = useSelector((state: RootState) => state.sign_detail?.data) as ISignDetail[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as IUser | null;
    const { executeAction, loading } = useAsyncAction();
    const navigate = useNavigate()
    const [status, setStatus] = useState('all')
    const [template, setTempalte] = useState(0)
    const [optionDetail, setOptionDetail] = useState([{ value: 0, label: 'Tất cả' }])


    const chooseDocument = async (id: number) => {
        navigate(`/document_detail/${id}`)
    }

    const capitalizeFirstLetter = (string: String) => {
        if (!string) return ''; // Tránh lỗi nếu chuỗi rỗng hoặc null
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };


    const gotoCreate = () => {
        navigate('/document_create')
    }
    const handleChooseStatus = (value: string) => {
        setStatus(value)
    }
    const fetchDocumentAway = async () => {
        await executeAction(() => get_document_away(), true)
    }


    useEffect(() => {
        fetchDocumentAway()
        setOptionDetail(prev => {
            return [...prev, ...signDetail === null ? [] : signDetail.map((doc) => ({ value: doc.id, label: doc.name }))]
        })
    }, [])

    return (
        <>
            <MainLayout title="Văn bản đi">
                {loading ? <PageLoading /> : <>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        {/* <Row style={{ justifyContent: 'space-between' }}>
                            <Col xs={20} sm={20} md={12} lg={10} xl={10} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    paddingBottom: '5px',
                                }}>
                                    <Select
                                        defaultValue={status}
                                        style={{ width: '100%' }}
                                        onChange={(value: string) => { handleChooseStatus(value) }}
                                        options={[
                                            { value: 'all', label: 'Tất cả' },
                                            { value: 'draft', label: 'Nháp' },
                                            { value: 'process', label: 'Đang trình ký' },
                                            { value: 'completed', label: 'Hoàn thành', },
                                            { value: 'canceled', label: 'Đã bị hủy', },
                                        ]}
                                    />
                                </div>
                            </Col>
                            <Col xs={6} sm={6} md={8} lg={6} xl={6}>
                                <Button type="primary" onClick={() => { gotoCreate() }} icon={<PlusCircleOutlined />}>
                                    Tạo văn bản
                                </Button>
                            </Col>
                        </Row> */}
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Col xs={20} sm={10} md={8} lg={8} xl={8}>
                                <div style={{
                                    paddingBottom: '5px',
                                    width: '100%', alignContent: 'center', justifyContent: 'center', display: 'flex'
                                }}>
                                    <Form layout="vertical" style={{ width: '100%' }}>
                                        <Form.Item label="Trạng thái">
                                            <Select
                                                defaultValue={status}
                                                style={{ width: '90%' }}
                                                onChange={(value: string) => { handleChooseStatus(value) }}
                                                options={[
                                                    { value: 'all', label: 'Tất cả' },
                                                    { value: 'draft', label: 'Nháp' },
                                                    { value: 'process', label: 'Đang trình ký' },
                                                    { value: 'completed', label: 'Hoàn thành', },
                                                    { value: 'canceled', label: 'Đã bị hủy', },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Col>
                            <Col xs={20} sm={10} md={8} lg={8} xl={8}>
                                <div style={{
                                    paddingBottom: '5px',
                                    width: '100%', alignContent: 'center', justifyContent: 'center', display: 'flex'
                                }}>
                                    <Form layout="vertical" style={{ width: '100%' }}>
                                        <Form.Item label="Mẫu đơn">
                                            <Select
                                                defaultValue={template}
                                                style={{ width: '90%' }}
                                                onChange={(value: number) => {
                                                    setTempalte(value)
                                                }}
                                                options={optionDetail}
                                            // options={
                                            // { value: 0, label: 'Tất cả' },
                                            // signDetail === null ? [] : signDetail.map((doc) => ({ value: doc.id, label: doc.name },))
                                            // }
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Col>
                            <Col xs={20} sm={20} md={8} lg={8} xl={8} style={{ alignItems: 'end', justifyContent: 'end' }}>
                                <div style={{ width: '100%', alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                                    <Form layout="vertical" style={{ width: '100%' }}>
                                        <Form.Item label=" ">
                                            <Button type="primary" onClick={() => { gotoCreate() }} icon={<PlusCircleOutlined />}>
                                                Tạo văn bản
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <List
                        itemLayout="horizontal"
                        dataSource={signDocument?.filter((doc) => (status === 'all' || doc.status === status) && (template === 0 || doc.document_detail[0] === template)) || []}
                        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}
                        renderItem={(item) => (
                            <div style={{ padding: '20px' }}>
                                <Card title={
                                    <div style={{
                                        // display: 'flex', 
                                        justifyContent: 'space-between', alignItems: 'center',
                                    }} >
                                        <Row>
                                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                                <div style={{
                                                    width: '100%',
                                                    overflow: 'hidden'
                                                }}> <b>{item.name}</b></div>
                                            </Col>
                                            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                                <div style={{ width: '100%', justifyContent: 'end', display: 'flex' }}>
                                                    <Badge status={item.status === 'draft' ? 'default'
                                                        : item.status === 'process' ? 'processing'
                                                            : item.status === 'completed' ? 'success'
                                                                : 'error'}
                                                        text={capitalizeFirstLetter(item.status)} size="default" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                } bordered={false} style={{
                                    borderRadius: '40px',
                                }} onClick={() => { chooseDocument(item.id) }}>
                                    <div><b>Người đề xuất:</b> {item.employee_request[1]}</div>
                                    <div><b>Công ty:</b> {user?.company_id[1]}</div>
                                    {/* <div><b>Status:</b> {item.status}</div> */}
                                    <div><b>Ngày gửi:</b> {item.sent_date}</div>
                                </Card>
                            </div>
                        )} />
                </>}
            </MainLayout>
        </>
    )

}

export default SignDocumentAway;