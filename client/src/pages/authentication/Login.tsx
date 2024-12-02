import { Suspense, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Image, App } from 'antd';
import {myColor} from 'constants/color.ts'
import logo from 'images/seacorp-logo.png'
import { ILoginData } from 'interfaces';
import { getErrorMessage } from 'helpers/getErrorMessage';
import { authLoginApi } from 'services/auth';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import Loading from 'components/loading/Loading';

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {message}             = App.useApp()
  const [form]                = useForm()
  const navigate              = useNavigate()
  
  const onFinish: FormProps<ILoginData>['onFinish'] = async ({username,password}) => {
    setLoading(true)
    try {
      await form.validateFields()
      const response = await authLoginApi({username,password})
      if(response.status === 200) {
        localStorage.setItem("asset_u", response.data?.data?.[0]?.id); 
        message.success(response.data?.msg)
        navigate('/')
      }
    } catch (error) {
      const msg = getErrorMessage(error)
      message.error(msg || 'Lỗi máy chủ')
      return;
    } finally {
      setLoading(false)
    }
  };
  
  
  
  return (
    <Suspense fallback={<Loading />}>
      <div style={{
        backgroundColor :myColor.backgroundColor,
        display:'fixed',
        height:'100vh',
        top:0,
        bottom:0,
        left:0,
        right:0,
      }}>
        <div
          style={{
            display:'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}  
        >
          <Form
            name="basic"
            style = {{width:'100%',padding:30}}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >

            <div style={{display:'flex',justifyContent:'center'}}>
              <Image src = {logo} style={{maxWidth:200}} preview = {false} alt=""/>
            </div>

            <Form.Item<ILoginData>
              label="Tên đăng nhập"
              name="username"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input size='large' style ={{fontSize:14}} disabled = {loading}/>
            </Form.Item>

            <Form.Item<ILoginData>
              label="Mật khẩu"
              name="password"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password size='large' style ={{fontSize:14}} disabled = {loading}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              <Button type="primary" htmlType="submit" size='large' loading = {loading}
              style = {{background: myColor.buttonColor, width:'100%', marginTop:10, fontSize:14}}>
                {loading ? 'Đang xác thực' : 'Đăng nhập'} 
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Suspense>
  );
} 

export default Login;