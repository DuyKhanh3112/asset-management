/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Button, GetProp, Menu, MenuProps, Image, Flex } from "antd";
import Layout, { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import useAsyncAction from "hooks/useAsyncAction";
import { ICompany } from "interfaces";
import { FC, useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { change_company, get_company } from "stores/actions/companies";
import { get_document_arrive, get_document_away } from "stores/actions/sign_document";
import { get_users, logout_user } from "stores/actions/user";
import { RootState } from "stores/reducers";
import logo from 'images/seacorp-logo.png'
import PageLoading from "widgets/PageLoading";
import DrawerSelection from "pages/asset/components/assetDetail/Drawer";
import { colors } from "constants/color";
import { get_employee_temporary } from "stores/actions/employee_temporary";
import { get_employee_multi } from "stores/actions/employee_multi_company";
import { get_temporary_leave_type } from "stores/actions/temporary_leave_type";
import { get_sign_detail } from "stores/actions/sign_detail";
import asset from 'images/asset.png';
import document from 'images/documentation.png';
import document_away from 'images/document_away.png';
import document_arrive from 'images/document_arrive.png'


type MainLayoutProps = {
    title?: string,
    children?: React.ReactNode;
}
type MenuItem = GetProp<MenuProps, 'items'>[number];

const MainLayout: FC<MainLayoutProps> = ({
    title = '',
    children = <></>,
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { executeAction, loading } = useAsyncAction();
    const companies = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as any;
    const [myCurrentCompanyShortName, setMyCurrentCompanyShortName] = useState<string>('');
    const [isChange, setIsChange] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const location = useLocation()

    const getMyCurrentCompanyShortName = () => {
        if (companies != null) {
            if (user != null) {
                if (user!.company_id != null) {
                    const currentOne = companies!.find((com) => com.id === user!.company_id[0]);
                    if (currentOne != null) {
                        setMyCurrentCompanyShortName(currentOne.short_name);
                        return
                    }
                }
            }
        }
        setMyCurrentCompanyShortName("Không tồn tại");
    }
    const fetchEmployeeMultiCompany = async () => {
        await executeAction(() => get_employee_multi(), true)
    }

    const fetchUser = async () => {
        await executeAction(() => get_users(), true)
    }
    const fetchCompanies = async () => {
        await executeAction(() => get_company(), true)
    }

    const fetchDocumentAway = async () => {
        await executeAction(() => get_document_away(), true)
    }
    const fetchDocumentArrive = async () => {
        await executeAction(() => get_document_arrive(), true)
    }

    const fetchEmployeeTemporary = async () => {
        await executeAction(() => get_employee_temporary(), true)
    }
    const fetchTemporaryLeaveType = async () => {
        await executeAction(() => get_temporary_leave_type(), true)
    }

    const gotoAsset = () => {
        navigate(`/`);
    }
    const fetchSignDetail = async () => {
        await executeAction(() => get_sign_detail(), true)
    }
    const fetchDataDocument = async () => {
        await fetchTemporaryLeaveType()
        await fetchSignDetail()
    }
    const gotoDocumentAway = async () => {
        setIsChange(true)
        navigate(`/document_away`);
        await fetchDocumentAway()
        await fetchDataDocument()
        fetchEmployeeMultiCompany()
        setIsChange(false)

    }
    const gotoDocumentArrive = async () => {
        setIsChange(true)
        navigate(`/document_arrive`);
        await fetchDocumentArrive()
        await fetchDataDocument()
        setIsChange(false)
    }
    const handleLogout = async () => {
        if (window.confirm("Bạn có muốn đăng xuất?")) {
            await executeAction(() => logout_user(), true);
            localStorage.removeItem('asset_u')
            window.location.href = '/login'
        }
    }
    const handleOpenCompanySelection = () => {
        setOpenDrawer(true);
    }

    const handleClose = () => {
        setOpenDrawer(false);
    };
    const handleChangeCompany = async (id: number) => {
        setIsChange(true)
        await executeAction(() => change_company(id), true);
        fetchUser()
        fetchEmployeeMultiCompany()
        setIsChange(false)
        setOpenDrawer(false)
        if (location.pathname === '/document_away') {
            fetchDocumentAway()
        }
        if (location.pathname === '/document_arrive') {
            // fetchDocumentArrive()
        }
    }

    const items: MenuItem[] = [
        {
            key: 'asset',
            icon: <div style={{ width: '50px' }}>
                <Image src={asset} style={{ maxWidth: '32px' }} preview={false} alt="" />
            </div>,
            label: ' Tài sản',
            onClick: gotoAsset,
        },
        {
            key: 'sign_document',
            icon: <div style={{ width: '50px' }}>
                <Image src={document} style={{ maxWidth: '32px' }} preview={false} alt="" />
            </div>,
            label: 'Trình ký',
            children: [
                {
                    key: 'document_away',
                    icon: <div style={{ width: '50px' }}>
                        <Image src={document_away} style={{ maxWidth: '24px' }} preview={false} alt="" />
                    </div>,
                    label: 'Văn bản đi',
                    onClick: gotoDocumentAway,

                },
                {
                    key: 'document_arrive',
                    icon: <div style={{ width: '50px' }}>
                        <Image src={document_arrive} style={{ maxWidth: '24px' }} preview={false} alt="" />
                    </div>,
                    label: 'Văn bản đến',
                    onClick: gotoDocumentArrive,
                },
            ]
        },
        {
            key: 'company',
            icon: <FaBuilding />,
            label: myCurrentCompanyShortName,
            onClick: handleOpenCompanySelection,
        },
    ]

    const menuTrigger: MenuItem[] = [
        {
            key: 'setting',
            icon: <UserOutlined />,
            label: user?.name,
            children: [
                {
                    key: 'logout',
                    icon: <GrLogout style={{ color: 'red' }} />,
                    label: 'Đăng xuất',
                    onClick: handleLogout,
                },
                {
                    key: 'company',
                    icon: <FaBuilding />,
                    label: 'Đổi công ty',
                    onClick: handleOpenCompanySelection,
                },
            ],
        }
    ]
    useEffect(() => {
        fetchUser();
        fetchCompanies();
        getMyCurrentCompanyShortName();
        fetchEmployeeTemporary()
        fetchEmployeeMultiCompany()
    }, [])

    useEffect(() => {
        getMyCurrentCompanyShortName();
    }, [user, companies])

    if (isChange) return (<PageLoading />);

    return (
        <>
            <Layout style={{ height: '100vh' }} >
                <Sider width='250px' trigger={
                    <Menu
                        // style={{ backgroundColor: colors.white }}
                        theme="dark"
                        defaultSelectedKeys={['2']}
                        items={menuTrigger} />
                }
                    collapsible collapsed={collapsed} style={{ backgroundColor: colors.white }} >

                    <Image src={logo} style={{ maxHeight: '200px' }} preview={false} alt="" />
                    <Menu
                        style={{ backgroundColor: colors.white, fontWeight: "bold" }}
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={items} defaultOpenKeys={['sign_document']}
                    />
                </Sider>
                <Layout>
                    <Header style={{
                        padding: 0,
                    }}>
                        <Flex align="start" >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }} />
                            <div style={{
                                width: '90%',
                                overflow: 'hidden'
                            }}>
                                <b>{title}</b>
                            </div>
                        </Flex>
                    </Header>
                    <Content
                        style={{
                            margin: '16px 16px',
                            padding: 24,
                            minHeight: 280,
                            // maxHeight: '100%',
                            overflowY: 'auto',
                            backgroundColor: colors.white,
                            // borderRadius: '20px'
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout >
            {openDrawer && <DrawerSelection open={openDrawer} handleClose={handleClose} handleChangeCompany={handleChangeCompany} />}

        </>
    )
};
export default MainLayout;