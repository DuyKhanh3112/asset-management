import instance from "./instance";

export function getCompaniesApi() {
    return instance.get("/api/get-companies");
}

export function changeCompanyApi(id: number) {
    return instance.patch("/api/change-company", { companyId: id });
}

// const handleChangeCompany = async (id: number) => {
//     try {
//         setFetchData(true);
//         await app.patch("/api/change-company", { companyId: id })
//         await fetchAllNecessaryData();
//         setAssetList([]);
//     } catch (error) {
//         const message = getErrorMessage(error);
//         alert(message);
//         setFetchData(false);
//     }
// }