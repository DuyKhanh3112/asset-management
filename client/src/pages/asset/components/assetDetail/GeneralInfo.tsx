import { myColor } from 'constants/color'
import location from '../../../../images/placeholder.png'
import moment from 'moment'
import _ from 'lodash';
import Empty from 'widgets/Empty';

const GeneralInfo = ({data}:{data:{[key:string]:any}}) => {
    const translateState = (text:string)=>{
        switch (text){
            case ('good'):
                return 'Tốt';
            case ('damaged_waiting_for_repair'):
                return 'Hư hỏng chờ sửa chữa';
            case ('damaged_waiting_for_liquidation'):
                return 'Hư hỏng chờ thanh lý';
            case ('self_destruct'):
                return 'Tự hư hỏng';
            case ('open'):
                return 'Đang sử dụng';
            case ('pending'):
                return 'Đang chờ';
            case ('draft'):
                return 'Nháp';
            case ('liquidation'):
                return 'Đã thanh lý'
            default:
                return text;
        }
    }

    if(_.isEmpty(data)) return <Empty/>

  return (
    <div style={{overflow:'auto',padding:'0.25rem 0.25rem 1.5rem'}}>
        <div style={{background:'white',padding:'0.5rem 1rem', borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Thông tin chung</h4>
            <hr/>
            <div>
                <h5 style={{fontWeight:500, fontSize:14,margin:'1rem 0 0.5rem'}}>{data.name}</h5>
                <div>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:'1.5rem'}}>
                        <img src={location} alt="" style={{width:20}}/>
                        <span style={{fontSize:12,margin:'0'}}>{data.sea_office_id ? data.sea_office_id[1] : 'Không xác định'}</span>
                    </div>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Mã tài sản:</span> {data.code}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Loại tài sản:</span> {data.asset_type[1]}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Danh mục:</span> {data.category_id[1]}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Nguyên giá: </span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.value)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Nhà cung cấp:</span> {data.vendor_name || ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Trạng thái:</span> {translateState(data.state)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ghi chú:</span> {data.note}</p>
                </div>
            </div>
        </div>
        <div style={{background:'white',padding:'0.5rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Nghiệm thu</h4>
            <hr/>
            <div>
                <div>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Số biên bản nghiệm thu:</span> {data.acceptance_number}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày biên bản nghiệm thu:</span> {data.acceptance_date && moment(data.acceptance_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Mô tả:</span> {data.description}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Số lượng: </span> {data.quantity}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Đơn vị đo lường:</span> {data.alt_unit}</p>
                </div>
            </div>
        </div>
        <div style={{background:'white',padding:'0.5rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Quản lý sử dụng</h4>
            <hr/>
            <div>
                <div>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Công ty sở hữu:</span> {data.company_id[1]}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Phòng ban sở hữu:</span> {data.dept_owner ? data.dept_owner[1] : ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Công ty sử dụng:</span> {data.company_using ? data.company_using[1]: ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Phòng ban sử dụng: </span> {data.management_dept ? data.management_dept[1]: ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Nhân viên QLTS:</span> {data.asset_management_dept_staff ? data.asset_management_dept_staff[1] : ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Người sử dụng:</span> {data.asset_user ? data.asset_user[1] : ''}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Bên giao:</span> {data.handover_party}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Bên nhận:</span> {data.receiver_handover_party}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Bên liên quan:</span> {data.related_handover_party}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Bên thu mua:</span> {data.procurement_staff ? data.procurement_staff[1] : ''}</p>
                </div>
            </div>
        </div>
        <div style={{background:'white',padding:'0.5rem 1rem', marginTop:16, borderRadius:5,boxShadow:'2px 2px 2px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:0,fontWeight:500, fontSize:14, color:myColor.buttonColor}}>Thông tin khác</h4>
            <hr/>
            <div>
                <div>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Tình trạng ban đầu:</span> {translateState(data.asset_status_start)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Tình trạng kiểm kê gần nhất:</span> {translateState(data.latest_inventory_status)}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày điều chuyển gần nhất:</span> {data.latest_asset_transfer_date && moment(data.latest_asset_transfer_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày nhận tài sản: </span> {data.asset_receive_date && moment(data.asset_receive_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày thanh lý tài sản:</span> {data.liquidation_date && moment(data.liquidation_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                    <p style={{fontSize:12,margin:'0.5rem 0'}}><span style={{fontWeight:500}}>Ngày sửa chữa:</span> {data.repair_date && moment(data.repair_date).add(7, 'hours').format("DD-MM-YYYY")}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GeneralInfo