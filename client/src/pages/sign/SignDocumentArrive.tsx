/* eslint-disable react-hooks/exhaustive-deps */
import { ISignDocument } from "interfaces";
import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Badge, Card, Col, List, Row, Select } from "antd";
import MainLayout from "components/app/MainLayout";
import useAsyncAction from "hooks/useAsyncAction";
import { get_document_arrive, get_document_arrive_await, get_document_arrive_done, get_document_arrive_process } from "stores/actions/sign_document";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_document_stage } from "stores/actions/document_stage";
import { get_document_stage_action } from "stores/actions/document_stage_action";
import { get_current_stage_action } from "stores/actions/current_satge_action";
import PageLoading from "widgets/PageLoading";
import { get_temporary_leave } from "stores/actions/temporary_leave";
import { get_temporary_leave_line } from "stores/actions/temporary_leave_line";

const SignDocumentArrive = () => {
    const signDocument = useSelector((state: RootState) => state.sign_document?.data) as ISignDocument[] | null;
    // const user = useSelector((state: RootState) => state.users?.data) as IUser | null;
    const { executeAction, loading } = useAsyncAction();
    const navigate = useNavigate()
    const [status, setStatus] = useState('all');

    const fetchDocumentStage = async (id: number) => {
        await executeAction(() => get_document_stage(id), true)
    }

    const fetchDocumentStageAction = async (id: number) => {
        await executeAction(() => get_document_stage_action(id), true)
    }

    const fetchCurrentStageAction = async (id: number) => {
        await executeAction(() => get_current_stage_action(id), true)
    }
    const fetchTemporaryLeave = async (id: number) => {
        await executeAction(() => get_temporary_leave(id), true)
    }
    const fetchTemporaryLeaveLine = async (id: number) => {
        await executeAction(() => get_temporary_leave_line(id), true)
    }
    const chooseDocument = async (id: number) => {
        // fetchDocumentArrive()
        fetchTemporaryLeave(id)
        fetchTemporaryLeaveLine(id)
        fetchDocumentStage(id)
        fetchDocumentStageAction(id)
        fetchCurrentStageAction(id)

        navigate(`/document_detail/${id}`)
    }
    const capitalizeFirstLetter = (string: String) => {
        if (!string) return ''; // Tránh lỗi nếu chuỗi rỗng hoặc null
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    const fetchDocumentArrive = async () => {
        await executeAction(() => get_document_arrive(), true)
    }
    const fetchDocumentArriveDone = async () => {
        await executeAction(() => get_document_arrive_done(), true)
    }
    const fetchDocumentArriveProcess = async () => {
        await executeAction(() => get_document_arrive_process(), true)
    }
    const fetchDocumentArriveAwait = async () => {
        await executeAction(() => get_document_arrive_await(), true)
    }
    const handleChooseStatus = (value: string) => {
        setStatus(value)
        if (value === 'all') {
            fetchDocumentArrive()
            return
        }
        if (value === 'done') {
            fetchDocumentArriveDone()
            return
        }
        if (value === 'process') {
            fetchDocumentArriveProcess()
            return
        }
        if (value === 'await') {
            fetchDocumentArriveAwait()
            return
        }

    }
    useEffect(() => {
        setStatus('all')
        fetchDocumentArrive()
    }, [])
    // if (loading) return (<PageLoading />)
    return (
        <>
            <MainLayout title="Văn bản đến">
                {loading ? <PageLoading /> : <>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Select
                                    defaultValue={status}
                                    style={{ width: '100%' }}
                                    onChange={(value: string) => { handleChooseStatus(value) }}
                                    options={[
                                        { value: 'all', label: 'Tất cả' },
                                        { value: 'process', label: 'Đang chờ xét duyệt' },
                                        { value: 'done', label: 'Đã được xét duyệt' },
                                        { value: 'await', label: 'Đề xuất liên quan', },
                                    ]}
                                />
                            </div>
                        </Col>
                    </Row>
                    <List
                        itemLayout="horizontal"
                        dataSource={signDocument || []}
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
                                    <div><b>Công ty:</b> {item.company_id[1]}</div>
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

export default SignDocumentArrive;