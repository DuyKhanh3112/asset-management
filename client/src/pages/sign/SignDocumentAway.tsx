import { IEmployeeMultiCompany, ISignDocument } from "interfaces";
import { RootState } from "stores/reducers";
import { useSelector } from "react-redux";
import { Avatar, Badge, Button, Card, List } from "antd";
import { IUser } from "interfaces/user";
import MainLayout from "components/app/MainLayout";
import { get_document_away } from "stores/actions/sign_document";
import useAsyncAction from "hooks/useAsyncAction";
import PageLoading from "widgets/PageLoading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_current_stage_action } from "stores/actions/current_satge_action";
import { get_document_stage_action } from "stores/actions/document_stage_action";
import { get_document_stage } from "stores/actions/document_stage";
import { PlusCircleOutlined } from "@ant-design/icons";
import { get_temporary_leave } from "stores/actions/temporary_leave";
import { get_temporary_leave_line } from "stores/actions/temporary_leave_line";

const SignDocumentAway = () => {
    const signDocument = useSelector((state: RootState) => state.sign_document?.data) as ISignDocument[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as IUser | null;
    const { executeAction, loading } = useAsyncAction();
    const navigate = useNavigate()
    // const employee_multi_company = useSelector((state: RootState) => state.employee_multi_company?.data) as IEmployeeMultiCompany[] | null;


    // const fetchDocumentAway = async () => {
    //     console.log('load away')
    //     await executeAction(() => get_document_away(), true)
    // }
    // useEffect(() => {
    // fetchDocumentAway()
    // }, [])

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
        fetchDocumentStage(id)
        fetchDocumentStageAction(id)
        fetchCurrentStageAction(id)
        fetchTemporaryLeave(id)
        fetchTemporaryLeaveLine(id)

        navigate(`/document_detail/${id}`)
    }

    const capitalizeFirstLetter = (string: String) => {
        if (!string) return ''; // Tránh lỗi nếu chuỗi rỗng hoặc null
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // if (loading) return (<PageLoading />)

    const gotoCreate = () => {
        navigate('/document_create')
    }

    return loading ? <PageLoading /> : (
        <>
            <MainLayout title="Văn bản đi">
                <div style={{ paddingLeft: '20px' }}>
                    <Button type="primary" onClick={() => { gotoCreate() }} icon={<PlusCircleOutlined />}>
                        Tạo văn bản
                    </Button>
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={signDocument || []}
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}
                    renderItem={(item) => (
                        <div style={{ padding: '20px' }}>
                            <Card title={
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <b>{item.name}</b>
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
                                <div><b>Công ty:</b> {user?.company_id[1]}</div>
                                {/* <div><b>Status:</b> {item.status}</div> */}
                                <div><b>Ngày gửi:</b> {item.sent_date}</div>
                            </Card>
                        </div>
                    )} />

            </MainLayout>
        </>
    )

}

export default SignDocumentAway;