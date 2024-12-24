
import { myColor } from 'constants/color'
import { useState } from 'react'
import useAsyncAction from 'hooks/useAsyncAction'
import { post_asset } from 'stores/actions/asset'
import Input, { SearchProps } from 'antd/es/input'
import { Button, Empty, Form } from 'antd'
import AssetList from './components/AssetList'
import { useNavigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import MenuApp from 'pages/apps/MenuApp'
import { debounce } from 'lodash'
import { GiNotebook } from 'react-icons/gi'
import { BsQrCode } from 'react-icons/bs'
import QRScanner from 'widgets/qr/QRScanner'
import MainLayout from 'components/app/MainLayout'

const Asset = () => {
  const { executeAction, loading } = useAsyncAction();
  const [assetList,] = useState<any[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isOpen, setOpen] = useState(false);

  const handleGetAsset: SearchProps['onSearch'] = async (value) => {
    executeAction(() => post_asset(value), true)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleGetAsset(e.target.value)
  };
  const openScanQR = () => {
    setOpen(true);
  }


  const handelChosenAsset = (id: number) => {
    navigate(`/asset/${id}`)
  }

  return (
    <>
      <MainLayout title='Asset'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <Form
            form={form}
            style={{ width: "80%" }}
          >
            <Form.Item name="name" style={{ margin: 0 }}>
              <Input placeholder="Nhập mã tài sản hoặc tên tài sản" allowClear onChange={debounce(onChange, 500)} />
            </Form.Item>
          </Form>
          <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'center', gap: 25, width: '20%' }}>
            <Button onClick={() => navigate("/asset/audit")} style={{ padding: '0.25rem', }} type="text">
              <GiNotebook style={{ color: 'black', fontSize: 16 }} />
              <span style={{ fontSize: 12, color: 'black' }}>Kiểm kê tài sản</span>
            </Button>
            <Button onClick={openScanQR} style={{ padding: '0.25rem' }} type="text">
              <div
                style={{ display: 'flex', width: '17px', height: '17px', borderRadius: 3, background: 'white', padding: 2, overflow: 'hidden' }}>
                <BsQrCode style={{ width: '100%', height: '100%' }} />
              </div>
              <span style={{ fontSize: 12, color: 'black' }}>Quét mã QR</span>
            </Button>
          </div>
        </div>
        {
          loading
            ?
            <div style={{ padding: '1rem' }}>
              <Skeleton count={5} height={100} borderRadius={5} style={{ marginBottom: 6 }} />
            </div>
            :
            assetList.length === 0
              ?
              <div style={{ padding: '1rem 0' }}><Empty /></div>
              :
              <AssetList data={assetList} handelChosenAsset={handelChosenAsset} />}
        {isOpen && <QRScanner isOpen={isOpen} setOpen={setOpen} setDecodedText={handleGetAsset} />}

      </MainLayout>
    </>
  )
}

export default Asset

