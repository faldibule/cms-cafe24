import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardTemplate from '../components/DashboardTemplate'
import Login from '../views/auth/Login'
import Dashboard from '../views/dashboard'
import Attribute from '../views/MasterData/Attribute/Attribute'
import AddOptionsForm from '../views/MasterData/Attribute/AddOptionsForm'
import EditOptionsForm from '../views/MasterData/Attribute/EditOptionsForm'
import FormKategori from '../views/MasterData/Kategori/FormKategori'
import SubKategori from '../views/MasterData/Kategori/SubKategori'
import Kategori from '../views/MasterData/Kategori/Kategori'
import FormSize from '../views/MasterData/Size Pack/FormSize'
import Size from '../views/MasterData/Size Pack/Size'
import * as Middleware from '../Middleware/App'
import FormKategoriUpdateParent from '../views/MasterData/Kategori/FormKategoriUpdateParent'
import FormKategoriUpdateChild from '../views/MasterData/Kategori/FormKategoriUpdateChild'
import AddProduct from '../views/Product/AddProduct'
import EditProduct from '../views/Product/EditProduct'
import Pelanggan from '../views/Pelanggan/Pelanggan/Pelanggan'
import FormPelanggan from '../views/Pelanggan/Pelanggan/FormPelanggan'
import FormEditPelanggan from '../views/Pelanggan/Pelanggan/FormEditPelanggan'
import Alamat from '../views/Pelanggan/Address/Alamat'
import FormAlamat from '../views/Pelanggan/Address/FormAlamat'
import FormEditAlamat from '../views/Pelanggan/Address/FormEditAlamat'
import FormProfil from '../views/Profil/FormProfil'
import ListProduct from '../views/Product/ListProduct'
import Order from '../views/Order/Order'
import Transaksi from '../views/Order/Transaksi'
import FormEditStatus from '../views/Order/FormEditStatus'
import Diskon from '../views/Pelanggan/Diskon/Diskon'
import FormDiskon from '../views/Pelanggan/Diskon/FormDiskon'
import SiteSetting from '../views/Setting/SiteSetting'
import LaporanPenjualan from '../views/Administrasi/LaporanPenjualan'
import Staff from '../views/Administrasi/Staff'
import FormStaff from '../views/Administrasi/FormStaff'
import DiskonByRole from '../views/Pelanggan/Diskon/DiskonByRole'
import ProductPromo from '../views/Product/ProductPromo'
import FormPromo from '../views/Product/FormPromo'
import DiskonOngkir from '../views/Pelanggan/DiskonOngkir/DiskonOngkir'
import FormDiskonOngkir from '../views/Pelanggan/DiskonOngkir/FormDiskonOngkir'
import BannerUtama from '../views/Setting/BannerUtama/BannerUtama'
import BannerSecond from '../views/Setting/BannerSecond/BannerSecond'
import BannerFooter from '../views/Setting/BannerFooter/BannerFooter'
import AddAttrForm from '../views/MasterData/Attribute/AddAttrForm'
import EditAttrForm from '../views/MasterData/Attribute/EditAttrForm'
import FormBanner from '../views/Setting/BannerUtama/FormBanner'
import FormEditBanner from '../views/Setting/BannerUtama/FormEditBanner'
import FormEditSize from '../views/MasterData/Size Pack/FormEditSize'
import FormEditStaff from '../views/Administrasi/FormEditStaff'
import FormDiskonUser from '../views/Pelanggan/Diskon/FormDiskonUser'
import FormEditDiskonUser from '../views/Pelanggan/Diskon/FormEditDiskonUser'
import FormEditDiskon from '../views/Pelanggan/Diskon/FormEditDiskon'
import FormSubKategori from '../views/MasterData/Kategori/FormSubKategori'
import Article from '../views/Article/Article'
import FormArticle from '../views/Article/FormArticle'
import FormEditArticle from '../views/Article/FormEditArticle'
import FormEditResi from '../views/Order/FormEditResi'
import Kurir from '../views/Ekspedisi/Kurir'
import { authentication } from '../Recoil/Authentication'
import { useRecoilState } from 'recoil'
import DetailUserAnda from '../views/Administrasi/DetailUserAnda'
import FormUserAnda from '../views/Administrasi/FormUserAnda'
import FormEditStatusPayment from '../views/Order/FormEditStatusPayment'
import EditTransaksi from '../views/Order/EditTransaksi'
import PromoBanner from '../views/MasterData/Promo-Banner'
import AddPromoBanner from '../views/MasterData/Promo-Banner/Add'
import EditPromoBanner from '../views/MasterData/Promo-Banner/Edit'

function Router() {
    const [auth, setAuth] = useRecoilState(authentication)

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Middleware.Guest>
                            <Login />
                        </Middleware.Guest>
                    } 
                />
                <Route 
                    path="/dashboard"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Dashboard />} 
                                title="Dashboard"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />

                {/* Edit Profile */}
                <Route 
                    path="/user/profil"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormProfil />} 
                                title="Edit Profil"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />

                {auth.user !== null && auth.user.role !== 'finance' && 
                <>
                {/* Kategori */}
                <Route 
                    path="/master-data/kategori"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Kategori />} 
                                title="Kategori"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/master-data/kategori/form"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormKategori />} 
                                title="Add Kategori"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                <Route 
                    path="/master-data/kategori/parent_update/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormKategoriUpdateParent />} 
                                title="Update Kategori"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />

                <Route 
                    path="/master-data/sub_kategori/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<SubKategori />} 
                                title="Edit Sub Kategori"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                <Route 
                    path="/master-data/sub_kategori_add/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormSubKategori />} 
                                title="Add Sub Kategori"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />

                <Route 
                    path="/master-data/kategori/child_update/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormKategoriUpdateChild />} 
                                title="Update Sub Kategori"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                
                {/* attr */}
                <Route 
                    path="/master-data/attr"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Attribute />} 
                                title="Attribute"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                <Route 
                    path="/master-data/attr_parent/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<AddAttrForm />} 
                                title="Attribute Add Form"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                <Route 
                    path="/master-data/attr_parent/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<EditAttrForm />} 
                                title="Attribute Edit Form"
                            />
                        </Middleware.Authenticated>
                        
                    } 
                />
                <Route 
                    path="/master-data/attr/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<EditOptionsForm />} 
                                title="Attribute"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/master-data/attr/:parent"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<AddOptionsForm />} 
                                title="Attribute"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                {/* Size */}
                <Route 
                    path="/master-data/size"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Size />} 
                                title="Size"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/master-data/size/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormSize />} 
                                title="Size"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/master-data/size/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditSize />} 
                                title="Size"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                <Route 
                    path="/master-data/promo-banner"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<PromoBanner />} 
                                title="Promo Banner"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                <Route 
                    path="/master-data/promo-banner/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<AddPromoBanner />} 
                                title="Tambah Promo Banner"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                <Route 
                    path="/master-data/promo-banner/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<EditPromoBanner />} 
                                title="Edit Promo Banner"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                
                {/* Pelanggan */}
                <Route 
                    path="/pelanggan"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Pelanggan />} 
                                title="Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/pelanggan/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormPelanggan />} 
                                title="Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/pelanggan/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditPelanggan />} 
                                title="Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/pelanggan/alamat_add/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormAlamat />} 
                                title="Alamat Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/pelanggan/alamat_edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditAlamat />} 
                                title="Alamat Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/pelanggan/alamat/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Alamat />} 
                                title="Alamat Pelanggan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Diskon />} 
                                title="Diskon"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon/add/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormDiskon />} 
                                title="Diskon"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditDiskon />} 
                                title="Diskon"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon/:role_id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<DiskonByRole />} 
                                title="Diskon"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                
                <Route 
                    path="/diskon_ongkir/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormDiskonOngkir />} 
                                title="Diskon Ongkir"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon_user/add/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormDiskonUser />} 
                                title="Diskon User"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon_user/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditDiskonUser />} 
                                title="Diskon User"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                

                {/* Product */}
                <Route 
                    path="/product/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<AddProduct />} 
                                title="Product"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/product/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<EditProduct />} 
                                title="Product"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/product"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<ListProduct />} 
                                title="Product"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/promo"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<ProductPromo />} 
                                title="Promo"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/promo/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormPromo />} 
                                title="Promo"
                            />
                        </Middleware.Authenticated>
                    } 
                />


                {/* Ekspedisi */}
                <Route 
                    path="/kurir"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Kurir />} 
                                title="Courier"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/diskon_ongkir"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<DiskonOngkir />} 
                                title="Diskon Ongkir"
                            />
                        </Middleware.Authenticated>
                    } 
                />


                {/* Article */}
                <Route 
                    path="/artikel"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Article />} 
                                title="Artikel dan Video"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/artikel/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormArticle />} 
                                title="Tambah Artikel/Video"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/artikel/edit/:slug"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditArticle />} 
                                title="Edit Artikel/Video"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                {/* Setting */}
                <Route 
                    path="/site_setting"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<SiteSetting />} 
                                title="Site Setting"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/banner/utama"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<BannerUtama />} 
                                title="Banner Utama"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/banner/utama/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormBanner />} 
                                title="Form Tambah Banner"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/banner/utama/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditBanner />} 
                                title="Form Edit Banner"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/banner/second"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<BannerSecond />} 
                                title="Banner Secondary"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/banner/footer"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<BannerFooter />} 
                                title="Banner Footer"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                {/* Role Admin  */}

                {/* Administrasi */}
                <Route 
                    path="/administrasi/report"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<LaporanPenjualan />} 
                                title="Laporan Penjualan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/administrasi/staff"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Staff />} 
                                title="Staff"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/administrasi/staff/add"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormStaff />} 
                                title="Staff"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/administrasi/staff/edit/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditStaff />} 
                                title="Staff"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                {/* DetailUserAnda */}
                <Route 
                    path="/admin/user/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<DetailUserAnda />} 
                                title="Detail Pelanggan Anda"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/admin/user_form/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormUserAnda />} 
                                title="Form User Anda"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                
                {/* Order */}
                <Route 
                    path="/order"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Order />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/order/edit_status/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditStatus />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/order/edit_resi/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditResi />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/order/edit_payment/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditStatusPayment />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/transaksi"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Transaksi />} 
                                title="Transaksi"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/transaksi/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<EditTransaksi />} 
                                title="Edit Status Transaksi"
                            />
                        </Middleware.Authenticated>
                    } 
                />

                <Route 
                    path="/administrasi/report"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<LaporanPenjualan />} 
                                title="Laporan Penjualan"
                            />
                        </Middleware.Authenticated>
                    } 
                />


                </>
                }
                
                {/* Role Finance */}
                {auth.user !== null && auth.user.role === 'finance' && 
                // {/* Order */}
                <>
                <Route 
                    path="/order"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<Order />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/order/edit_status/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditStatus />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/order/edit_resi/:id"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<FormEditResi />} 
                                title="Order"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                <Route 
                    path="/administrasi/report"
                    element={
                        <Middleware.Authenticated>
                            <DashboardTemplate
                                render={<LaporanPenjualan />} 
                                title="Laporan Penjualan"
                            />
                        </Middleware.Authenticated>
                    } 
                />
                </>
                }
                <Route 
                    path="*" 
                    element={
                        <Middleware.Guest>
                            <Login />
                        </Middleware.Guest>
                    } 
                />

                
                {/* Role Admin */}
                {/* {auth.user !== null && auth.user.role !== 'finance' && } */}
                
            </Routes>
        </BrowserRouter>
    )
}

export default Router
