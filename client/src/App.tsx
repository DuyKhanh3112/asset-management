import { Suspense, useEffect, useState } from "react";
import Loading from "components/loading/Loading.tsx";
import { ThemeProvider } from "contexts/useThemeContext.tsx";
import { AuthProvider } from "contexts/useAuthContext.tsx";
import RouteWithSubRoutes from "routes/RouteWithSubRoutes.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  // const dispatch = useDispatch();
  // const auth = useSelector((state: RootState) => state.auth);
  // const [fetchingData,setFetchingData] = useState(false);

  // const checkAuth = async () => {
  //   try {
  //     setFetchingData(true);
  //     const {data}:any = await app.get("/api/check-auth");
  //     if(data?.data?.length>0){
  //       dispatch(addAuth(data.data[0]))
  //     }
  //   } catch (error:any) {
  //     alert(getErrorMessage(error))
  //   } finally {
  //     setFetchingData(false);
  //   }
  // }

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  return (
    <>
      {/* {
        fetchingData 
        ?
        <PageLoading/>
        :
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={auth ? <Navigate to="/" /> : <Login/>}/>
            <Route path="/" element={<PrivateRoute><Asset/></PrivateRoute>}/>
            <Route path="/asset/:id" element={<PrivateRoute><AssetDetail/></PrivateRoute>}/>
            <Route path="/asset/audit" element={<PrivateRoute><AssetAudit/></PrivateRoute>}/>
            <Route path="/asset/audit/:id" element={<PrivateRoute><AuditDetail/></PrivateRoute>}/>
          </Routes>
        </BrowserRouter>
      } */}
      <Suspense fallback={<Loading />}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <RouteWithSubRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </Suspense>
    </>
  );
}

export default App;
