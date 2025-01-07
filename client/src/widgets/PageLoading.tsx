import React, { FC } from 'react';
import { Spin } from 'antd';
import { myColor } from 'constants/color';

const PageLoading: FC = () => {
  return (
    <div style={{ background: myColor.backgroundColor, zIndex: 99 }}>
      <Spin
        tip={<div style={{ marginTop: '10px', fontSize: 14, color: myColor.buttonColor }}>Đang tải dữ liệu...Vui lòng đợi</div>}
        size="large" style={{ position: "fixed", maxHeight: "100vh" }}
      >
        <></>
      </Spin>
    </div>
  );
};

export default PageLoading;