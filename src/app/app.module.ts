import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromotionAddComponent } from './promotions/promotion-add/promotion-add.component';
import { OrderComponent } from './order/order.component';
import { BlogComponent } from './blog/blog.component';
import { BlogAddComponent } from './blog/blog-add/blog-add.component';
import { QuillModule } from 'ngx-quill';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product/product-add/product-add.component';
import { AdminAccountComponent } from './admin-account/admin-account.component';
import { AdminAccountAddComponent } from './admin-account/admin-account-add/admin-account-add.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './login/confirm-code/confirm-code.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

@NgModule({
  declarations: [ // Nơi khai báo các component
    AppComponent,PromotionsComponent,PromotionAddComponent,DashboardComponent, OrderComponent, BlogComponent, BlogAddComponent, ProductComponent, ProductAddComponent, AdminAccountComponent, AdminAccountAddComponent, LoginComponent, ForgotPasswordComponent, ConfirmCodeComponent, ResetPasswordComponent, SlideBarComponent,AdminHeaderComponent, 
  ],
  imports: [ // Chỉ để module ở đây
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    QuillModule.forRoot()
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
