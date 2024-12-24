import { colors, myColor } from "constants/color";
import { ISignDocument } from "interfaces";
import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Avatar, Badge, Card, Col, Empty, List, Menu, Select, Tabs } from "antd";
import { IUser } from "interfaces/user";
import MainLayout from "components/app/MainLayout";
import useAsyncAction from "hooks/useAsyncAction";
import { get_document_arrive, get_document_arrive_await, get_document_arrive_done, get_document_arrive_process } from "stores/actions/sign_document";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_document_stage } from "stores/actions/document_stage";
import { get_document_stage_action } from "stores/actions/document_stage_action";
import { get_current_stage_action } from "stores/actions/current_satge_action";
import PageLoading from "widgets/PageLoading";
import TabPane from "antd/es/tabs/TabPane";
import { get_temporary_leave } from "stores/actions/temporary_leave";
import { get_temporary_leave_line } from "stores/actions/temporary_leave_line";

const SignDocumentArrive = () => {
    const signDocument = useSelector((state: RootState) => state.sign_document?.data) as ISignDocument[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as IUser | null;
    const { executeAction, loading } = useAsyncAction();
    const navigate = useNavigate()
    const [status, setStatus] = useState('all');
    const [listSign, setListSign] = useState<ISignDocument[] | null>([])

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
    }, [user])
    // if (loading) return (<PageLoading />)
    return (
        <>
            <MainLayout title="Văn bản đến">
                <Select
                    defaultValue={status}
                    style={{ width: '30%' }}
                    onChange={(value: string) => { handleChooseStatus(value) }}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'process', label: 'Đang chờ xét duyệt' },
                        { value: 'done', label: 'Đã được xét duyệt' },
                        { value: 'await', label: 'Đề xuất liên quan', },
                    ]}
                />

                {/* <Tabs defaultActiveKey="1">
                    <TabPane tab="Tất cả" key="all" >
                    </TabPane>
                    <TabPane tab="Đang chờ xét duyệt" key="process">
                    </TabPane>
                    <TabPane tab="Đã được xét duyệt" key="done">
                    </TabPane>
                    <TabPane tab="Đề xuất liên quan" key="await">
                    </TabPane>
                </Tabs> */}
                <List
                    itemLayout="horizontal"
                    dataSource={signDocument || []}
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}
                    renderItem={(item) => (
                        <div style={{ padding: '20px' }}>
                            <Card title={
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }} >
                                    <div style={{
                                        width: '85%',
                                        overflow: 'hidden'
                                    }}> <b>{item.name}</b></div>
                                    <Badge status={item.status === 'draft' ? 'default'
                                        : item.status === 'process' ? 'processing'
                                            : item.status === 'completed' ? 'success'
                                                : 'error'}
                                        text={capitalizeFirstLetter(item.status)} size="default" />

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

            </MainLayout>
        </>
    )

}

export default SignDocumentArrive;