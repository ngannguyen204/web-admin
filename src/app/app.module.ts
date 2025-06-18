import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromotionAddComponent } from './promotions/promotion-add/promotion-add.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product/product-add/product-add.component';
import { AdminAccountComponent } from './admin-account/admin-account.component';
import { AdminAccountAddComponent } from './admin-account/admin-account-add/admin-account-add.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './login/confirm-code/confirm-code.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

import { QuillModule } from 'ngx-quill';
import { LucideAngularModule, icons } from 'lucide-angular';



@NgModule({
  declarations: [
    AppComponent,
    PromotionsComponent,
    PromotionAddComponent,
    DashboardComponent,
    OrderComponent,
    ProductComponent,
    ProductAddComponent,
    AdminAccountComponent,
    AdminAccountAddComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ConfirmCodeComponent,
    ResetPasswordComponent,
    SlideBarComponent,
    AdminHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    QuillModule.forRoot(),
    LucideAngularModule.pick(icons),

   
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
