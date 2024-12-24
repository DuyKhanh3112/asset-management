import React from 'react'
import { Drawer } from 'antd';

import { Typography } from 'antd';
import { ICompany } from 'interface';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/reducers';

const { Text } = Typography;


const DrawerSelection = ({ open, handleClose, handleChangeCompany }: { open: boolean, handleClose: () => void, handleChangeCompany: (i: number) => void }) => {
  const companies = useSelector((state: RootState) => state.companies?.data) as ICompany[] | null;
  const user = useSelector((state: RootState) => state.users?.data) as any;
  const auth = useSelector((state: RootState) => state.auth) as any;

  const isCurrentCompany = (id: number) => {
    if (companies != null) {
      if (user != null) {
        if (user!.company_id != null) {
          if (user!.company_id[0] === id) {
            return true
          }
        }
      }
    }
    return false
  }

  return (
    <Drawer
      title="Thay đổi công ty"
      placement="bottom"
      closable={false}
      onClose={handleClose}
      open={open}
      key="bottom"
    >
      {companies!.map((company: ICompany, index) => {
        return (
          <div key={index} onClick={() => handleChangeCompany(company.id)} style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'center' }}>
            <Text style={{ color: `${isCurrentCompany(company.id) && 'crimson'}`, fontWeight: `${isCurrentCompany(company.id) && '700'}` }}>{company.short_name}</Text>
          </div>
        );
      })}
    </Drawer>
  )
}

export default DrawerSelection