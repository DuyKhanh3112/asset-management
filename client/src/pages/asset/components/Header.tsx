import { Button, Dropdown, Form, Input, MenuProps } from "antd";
import { myColor } from "constants/color";
import { ICompany } from "interfaces";
import { useEffect, useState } from "react";
import { FaBuilding, FaCaretDown, FaExchangeAlt } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { useSelector } from "react-redux";
import { RootState } from "stores/reducers";
import DrawerSelection from "./assetDetail/Drawer";
import { debounce } from "lodash";
import { GiNotebook } from "react-icons/gi";
import { BsQrCode } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import QRScanner from "widgets/qr/QRScanner";

const Header = ({ handleChangeCompany, handleGetAsset, handleLogout }:
    {
        handleChangeCompany: (i: number) => void,
        handleGetAsset: (i: string) => void,
        handleLogout: () => void,

    }) => {
    const companies = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
    const user = useSelector((state: RootState) => state.users?.data) as any;
    const [myCurrentCompanyShortName, setMyCurrentCompanyShortName] = useState<string>('');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const openScanQR = () => {
        setOpen(true);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleGetAsset(e.target.value)
    };

    const handleOpenCompanySelection = () => {
        setOpenDrawer(true);
    }

    const handleClose = () => {
        setOpenDrawer(false);
    };

    const items: MenuProps['items'] = [
        {
            label: <span style={{ fontSize: 13 }}>Đổi công ty</span>,
            key: '1',
            icon: <FaExchangeAlt />,
            onClick: () => handleOpenCompanySelection()
        },
        {
            label: <span style={{ color: 'red', fontSize: 13 }}>Đăng xuất</span>,
            key: '2',
            icon: <GrLogout style={{ color: 'red' }} />,
            onClick: () => handleLogout()
        },
    ];

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

    useEffect(() => {
        getMyCurrentCompanyShortName();
    }, [user, companies])

    const gotoSignDocument = () => {
        navigate(`/sign_document`);
    }

    return (
        <>
            <div style={{
                position: 'sticky', top: 0, zIndex: 1,
                paddingBottom: 10, backgroundColor: myColor.buttonColor, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
                        <FaBuilding style={{ fontSize: 13, color: 'white' }} />
                        <span style={{ fontSize: 11.5, color: 'white' }}>{myCurrentCompanyShortName}</span>
                    </div>
                    <Button type="primary" onClick={gotoSignDocument}>Primary Button</Button>
                    <Dropdown menu={{ items }} placement="bottomRight" arrow>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: 'white', fontSize: 13 }}>{user?.name}</span>
                            <FaCaretDown style={{ fontSize: 14, color: 'white' }} />
                        </div>
                    </Dropdown>
                </div>

                {/* <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem 0.5rem', gap: 8 }}>
                    <Form
                        form={form}
                        style={{ width: "100%" }}
                    >
                        <Form.Item name="name" style={{ margin: 0 }}>
                            <Input placeholder="Nhập mã tài sản hoặc tên tài sản" allowClear onChange={debounce(onChange, 500)} />
                        </Form.Item>
                    </Form>
                </div> */}

                {/* <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'center', gap: 25 }}>
                    <Button onClick={() => navigate("/asset/audit")} style={{ padding: '0.25rem', }} type="text">
                        <GiNotebook style={{ color: 'white', fontSize: 16 }} />
                        <span style={{ fontSize: 12, color: 'white' }}>Kiểm kê tài sản</span>
                    </Button>
                    <Button onClick={openScanQR} style={{ padding: '0.25rem' }} type="text">
                        <div
                            style={{ display: 'flex', width: '17px', height: '17px', borderRadius: 3, background: 'white', padding: 2, overflow: 'hidden' }}>
                            <BsQrCode style={{ width: '100%', height: '100%' }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'white' }}>Quét mã QR</span>
                    </Button>
                </div> */}
            </div>
            {openDrawer && <DrawerSelection open={openDrawer} handleClose={handleClose} handleChangeCompany={handleChangeCompany} />}
            {isOpen && <QRScanner isOpen={isOpen} setOpen={setOpen} setDecodedText={handleGetAsset} />}
        </>
    );
}
export default Header

