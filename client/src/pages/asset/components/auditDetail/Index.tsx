import { myColor } from 'constants/color';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from 'helpers/getErrorMessage';
import app from 'axiosConfig';
import PageLoading from 'widgets/PageLoading';
import { IoArrowBackSharp } from 'react-icons/io5';
import Info from './Info';
import InventoriedList from './InventoriedList';
import { IAssetInventoriedDept, IAssetInventory, IAudit, ICommitee } from 'interface';
import { BsQrCode } from 'react-icons/bs';
import QRScanner from 'widgets/qr/QRScanner';

const AuditDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    
    const [loading,setLoading] = useState(true);
    const [active,setActive] = useState(1);

    const [auditData,setAuditData] = useState<IAudit | null>(null);
    const [commitee,setCommitee] = useState<ICommitee[]>([]);
    const [inventoriedDept,setInventoriedDept] = useState<IAssetInventoriedDept[]>([]);
    const [inventoryLines,setInventoryLines] = useState<IAssetInventory[]>([]);
    const [isOpen,setOpen] = useState(false);

    const [openEdit,setOpenEdit] = useState<any>(false);

    const handleGetAudit = async () => {
        try {
            setLoading(true);
            const {data:{data}} = await app.get(`/api/get-audit/${id}`);
            if(data.length > 0){
                setAuditData(data[0]);
            }
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    const handleGetInventoryCommitte = async () => {
        try {
            setLoading(true);
            const {data:{data}} = await app.get(`/api/get-asset-inventory-commitee/${id}`);
            if(data.length > 0){
                setCommitee(data)
            }
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    const handleGetInventoriedDept = async () => {
        try {
            setLoading(true);
            const {data:{data}} = await app.get(`/api/get-asset-inventoried-dept/${id}`);
            if(data.length > 0){
                setInventoriedDept(data)
            }
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    const handleGetAssetInventoryLines = async (noLoading?:boolean) => {
        try {
            if(noLoading){
                setLoading(false);
            } else {
                setLoading(true);
            }
            const {data:{data}} = await app.get(`/api/get-asset-inventory/${id}`);
            if(data.length > 0){
                setInventoryLines(data)
            }
        } catch (error) {
            const message = getErrorMessage(error);
            alert(message);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenQrCode = () => {
        setOpen(true);
    }

    const handleOpenInventoryLine = (id:string) => {
        const inventoriedAsset = [...inventoryLines].find(i => (i.asset_id as any)[0].toString() === id.toString())
        if(inventoriedAsset){
            setActive(2);
            setOpenEdit(inventoriedAsset);
            setOpen(false);
        } else {
            alert("Không tìm thấy tài sản trong danh sách kiểm kê")
        }
    }


    const handleViewContent = () => {
        switch (active){
            case 1:
                return <Info auditData = {auditData} commitee={commitee} inventoriedDept={inventoriedDept}/>
            case 2:
                return <InventoriedList 
                refetchAssetInventoryLines = {handleGetAssetInventoryLines}
                auditData = {auditData} inventoryLines={inventoryLines} 
                setOpenEdit={setOpenEdit} openEdit={openEdit}/>
            default:
                return <></>
        }
    }

    const handleGetData = async () => {
        await Promise.all([
            handleGetAudit(),
            handleGetInventoryCommitte(),
            handleGetInventoriedDept(),
            handleGetAssetInventoryLines(),
        ])
    }


    useEffect(()=>{
        handleGetData();
    },[])

    if(loading) return <PageLoading/>

  return (
    <div style={{
        background:myColor.backgroundColor,
        position:'fixed',top:0,width:'100vw',height:'100vh', zIndex:2,overflow:'auto'}}>
        <div style={{background:myColor.buttonColor,position:'sticky',top:0,zIndex:2}}>
            <header style={{display:'flex',position:'relative',alignItems:'center',justifyContent:'center',padding:'1rem 1rem 1rem',background:myColor.buttonColor}}>
                <div style={{display:'flex',justifyContent:'flex-start',position:'absolute',left:20}}>
                    <IoArrowBackSharp style={{margin:0, fontSize:20,color:'white'}} onClick={()=>navigate("/asset/audit",{ replace: true })}/>
                </div>
                <h5 style={{margin:0, fontSize:14,color:'white',fontWeight:500}}>Thông tin chi tiết</h5>
                {inventoryLines.length > 0 && <div style={{display:'flex',justifyContent:'flex-start',position:'absolute',right:20}} onClick={handleOpenQrCode}>
                    <BsQrCode style={{margin:0, fontSize:20,color:'white'}}/>
                </div>}
            </header>
            <div style={{
                borderTopLeftRadius:30,borderTopRightRadius:30,
                display:'flex', justifyContent:'space-evenly',background:myColor.backgroundColor,padding:'1rem 0.5rem'}}>
                <div onClick={()=>setActive(1)} style={{flex:1,display:'flex',justifyContent:'center'}}>
                    <span style={{fontSize:13, color:`${active===1 ? myColor.buttonColor : "grey"}`,
                    fontWeight: `${active === 1 ? '700': '500'}`
                    }}>Chung</span>
                </div>
                <div onClick={()=>setActive(2)} style={{flex:1,display:'flex',justifyContent:'center'}}>
                    <span style={{
                        fontWeight: `${active === 2 ? '700': '500'}`,
                        fontSize:13, color:`${active===2 ? myColor.buttonColor : "grey"}`}}>Danh sách kiểm kê</span>
                </div>
            </div>
        </div>
        <div style={{padding:'0.5rem 0rem',background:myColor.backgroundColor, overflow:'auto'}}>
        {handleViewContent()}
        </div>
        {isOpen && <QRScanner isOpen={isOpen} setOpen={setOpen} setDecodedText = {handleOpenInventoryLine}/>}
    </div>
  )
}

export default AuditDetail