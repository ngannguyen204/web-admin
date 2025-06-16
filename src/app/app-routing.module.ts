import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { OrderComponent } from './order/order.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromotionAddComponent } from './promotions/promotion-add/promotion-add.component';
import { BlogComponent } from './blog/blog.component';
import { BlogAddComponent } from './blog/blog-add/blog-add.component';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product/product-add/product-add.component';
import { AdminAccountComponent } from './admin-account/admin-account.component';
import { AdminAccountAddComponent } from './admin-account/admin-account-add/admin-account-add.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './login/confirm-code/confirm-code.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect mặc định
  { path: 'header', component: AdminHeaderComponent }, // Header cố định
  { path: 'sidebar', component: SlideBarComponent }, // Sidebar cố định
  { path: 'dashboard', component: DashboardComponent }, // Trang dashboard
  { path: 'promotions', component: PromotionsComponent }, // Trang promotions
  { path: 'order', component: OrderComponent },
  { path: 'promotion-add', component: PromotionAddComponent },
  { path: 'promotion-add/:id', component: PromotionAddComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-add', component: BlogAddComponent },
  { path: 'blog-add/:id', component: BlogAddComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product-add', component: ProductAddComponent },
  { path: 'product-add/:id', component: ProductAddComponent },
  { path: 'admin-account', component: AdminAccountComponent },
  { path: 'admin-account-add', component: AdminAccountAddComponent },
  
  { path: '', redirectTo: 'admin-account', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-code', component: ConfirmCodeComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
