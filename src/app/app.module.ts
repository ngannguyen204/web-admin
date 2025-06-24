import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


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

// Firebase imports
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { firebaseConfig } from './firebase.config';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
    
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({
      projectId: "collabeyewears",
      appId: "1:996727863026:web:ad101d9df427462a6d026b",
      databaseURL: "https://collabeyewears-default-rtdb.firebaseio.com",
      storageBucket: "collabeyewears.firebasestorage.app",
      apiKey: "AIzaSyAei3EsRMBn1087E8Yu-A3c4sRzNKjZFJE",
      authDomain: "collabeyewears.firebaseapp.com",
      messagingSenderId: "996727863026",
      measurementId: "G-36D1DF3ND0"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
