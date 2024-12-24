// import { FileOutlined, SettingOutlined, VerticalLeftOutlined, VerticalRightOutlined } from "@ant-design/icons";
// import { Menu } from "antd";
// import { SearchProps } from "antd/es/input";
// import useAsyncAction from "hooks/useAsyncAction";
// import { ICompany } from "interfaces";
// import DrawerSelection from "pages/asset/components/assetDetail/Drawer";
// import { useEffect, useState } from "react";
// import { FaBuilding } from "react-icons/fa";
// import { GrLogout } from "react-icons/gr";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { post_asset } from "stores/actions/asset";
// import { change_company, get_company } from "stores/actions/companies";
// import { get_document_arrive, get_document_away, get_sign_document } from "stores/actions/sign_document";
// import { get_users, logout_user } from "stores/actions/user";
// import { RootState } from "stores/reducers";
// import PageLoading from "widgets/PageLoading";
// import QRScanner from "widgets/qr/QRScanner";

// const MenuApp = () => {
//     const companies = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
//     const user = useSelector((state: RootState) => state.users?.data) as any;
//     const [myCurrentCompanyShortName, setMyCurrentCompanyShortName] = useState<string>('');
//     const [openDrawer, setOpenDrawer] = useState(false);
//     // const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const [isOpen, setOpen] = useState(false);
//     const { executeAction, loading } = useAsyncAction();
//     const [isChange, setIsChange] = useState(false);
//     const [title, setTitle] = useState<string>('Asset');

//     const fetchSignDocument = async () => {
//         await executeAction(() => get_sign_document(), true)
//     }
//     const fetchDocumentAway = async () => {
//         await executeAction(() => get_document_away(), true)
//     }
//     const fetchDocumentArrive = async () => {
//         await executeAction(() => get_document_arrive(), true)
//     }

//     const handleChangeCompany = async (id: number) => {
//         setIsChange(true)
//         await executeAction(() => change_company(id), true);
//         getMyCurrentCompanyShortName()
//         await fetchSignDocument()
//         setIsChange(false)
//         setOpenDrawer(false)
//     }
//     const handleLogout = async () => {
//         if (window.confirm("Bạn có muốn đăng xuất?")) {
//             await executeAction(() => logout_user(), true);
//             localStorage.removeItem('asset_u')
//             window.location.href = '/login'
//         }
//     }
//     const handleGetAsset: SearchProps['onSearch'] = async (value) => {
//         executeAction(() => post_asset(value), true)
//     }
//     const handleOpenCompanySelection = () => {
//         setOpenDrawer(true);
//     }

//     const handleClose = () => {
//         setOpenDrawer(false);
//     };


//     const getMyCurrentCompanyShortName = () => {
//         if (companies != null) {
//             if (user != null) {
//                 if (user!.company_id != null) {
//                     const currentOne = companies!.find((com) => com.id === user!.company_id[0]);
//                     if (currentOne != null) {
//                         setMyCurrentCompanyShortName(currentOne.short_name);
//                         return
//                     }
//                 }
//             }
//         }
//         setMyCurrentCompanyShortName("Không tồn tại");
//     }


//     const fetchUser = async () => {
//         await executeAction(() => get_users(), true)
//     }
//     const fetchCompanies = async () => {
//         await executeAction(() => get_company(), true)
//     }

//     useEffect(() => {
//         fetchCompanies();
//     }, [])

//     useEffect(() => {
//         fetchUser();
//     }, [isChange])

//     useEffect(() => {
//         getMyCurrentCompanyShortName();
//     }, [user, companies, isChange])

//     const gotoSignDocument = async () => {
//         navigate(`/sign_document`);
//         await fetchSignDocument()
//     }

//     const gotoDocumentAway = async () => {
//         navigate(`/document_away`);
//         await fetchDocumentAway()
//         setTitle('Sign Document Away')
//     }
//     const gotoDocumentArrive = async () => {
//         navigate(`/document_arrive`);
//         await fetchDocumentArrive()
//         setTitle('Sign Document Arrive')
//     }
//     const gotoAsset = () => {
//         navigate(`/`);
//         setTitle('Asset')
//     }

//     if (loading || isChange) return (<PageLoading />);

//     return (
//         <>
//             <div style={{
//                 position: 'sticky', top: 0, zIndex: 1,
//                 paddingBottom: 10, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
//             }}>

//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//                     <Menu mode="horizontal" style={{ padding: '1rem', width: '100%', justifyContent: 'space-between', }}>
//                         {title}
//                         <div>
//                             <Menu.Item key="mail" icon={<FileOutlined />} onClick={gotoAsset}>
//                                 Asset
//                             </Menu.Item>
//                             <Menu.SubMenu key="SubMenuSignDocument" title='Sign Document' icon={<FileOutlined />}>
//                                 <Menu.Item key="away" title="Sign document away" icon={<VerticalLeftOutlined />} onClick={gotoDocumentAway}>
//                                     Sign document away
//                                 </Menu.Item>
//                                 <Menu.Item key="arrive" title="Sign document arrive" icon={<VerticalRightOutlined />} onClick={gotoDocumentArrive}>
//                                     Sign document arrive
//                                 </Menu.Item>
//                             </Menu.SubMenu>
//                             <Menu.Item key="company" icon={<FaBuilding />} onClick={handleOpenCompanySelection}>
//                                 {myCurrentCompanyShortName}
//                             </Menu.Item>
//                             <Menu.SubMenu key="SubMenuSetting" title={user?.name} icon={<SettingOutlined />}>
//                                 <Menu.Item key="logout" title="Đăng xuất" icon={<GrLogout style={{ color: 'red' }} />} onClick={handleLogout}>
//                                     Đăng xuất
//                                 </Menu.Item>
//                             </Menu.SubMenu>
//                         </div>
//                     </Menu>

//                     {/* <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
//                         <FaBuilding style={{ fontSize: 13, color: 'white' }} />
//                         <span style={{ fontSize: 11.5, color: 'white' }}>{myCurrentCompanyShortName}</span>
//                     </div>
//                     <Button type="primary" onClick={gotoSignDocument}>Primary Button</Button>
//                     <Dropdown menu={{ items }} placement="bottomRight" arrow>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             <span style={{ color: 'white', fontSize: 13 }}>{user?.name}</span>
//                             <FaCaretDown style={{ fontSize: 14, color: 'white' }} />
//                         </div>
//                     </Dropdown> */}
//                 </div>
//             </div>
//             {openDrawer && <DrawerSelection open={openDrawer} handleClose={handleClose} handleChangeCompany={handleChangeCompany} />}
//             {isOpen && <QRScanner isOpen={isOpen} setOpen={setOpen} setDecodedText={handleGetAsset} />}

//         </>
//     )
// }
// export default MenuApp;

