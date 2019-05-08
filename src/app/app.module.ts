import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { ItemsService } from './shared/items.service';
import { AbvPipe } from './shared/abv.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayComponent } from './display/display.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitlecasePipe } from './shared/titlecase.pipe';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { APP_BASE_HREF } from '@angular/common';
import { DropdownDirective } from './shared/dropdown.directive';
import { IconNamePipe } from './shared/icon-name.pipe';
import { MenuComponent } from './menu/menu.component';
import { FacebookModule } from 'ngx-facebook';
import { PopupComponent } from './popup/popup.component';
import { TextComponent } from './text/text.component';
import { ContentManagerComponent } from './content-manager/content-manager.component';
import { FoodEditComponent } from './food/food-edit/food-edit.component';
import { UploadComponent } from './content-manager/upload/upload.component';
import { UploadFormComponent } from './content-manager/upload-form/upload-form.component';
import { MatInputModule, MatDialogModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatSnackBarModule, MatCheckboxModule, MatIconModule, MatAutocompleteModule,  } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ContentService } from './shared/content.service';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FoodFormComponent } from './food/food-form/food-form.component';
import { FoodItemComponent } from './food/food-item/food-item.component';
import { CatagoryFormComponent } from './food/catagory-form/catagory-form.component';
import { MenuService } from './shared/menu.service';
import { CategoryComponent } from './food/category/category.component';
import { CategoryEditComponent } from './food/category-edit/category-edit.component';
import { ImagesComponent } from './images/images.component';

const appRoutes: Routes = [
  {
    path: 'edit', component: MenuComponent, children: [
      { path: 'drafts', component: MainComponent },
      { path: 'menu', component: FoodEditComponent },
      { path: 'content', component: ContentManagerComponent },
      { path: 'output', component: TextComponent }
    ]
  },
  { path: 'display/:screen', component: DisplayComponent },
  { path: '**', redirectTo: 'edit/drafts', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    AbvPipe,
    DisplayComponent,
    ItemEditComponent,
    TitlecasePipe,
    IconNamePipe,
    MainComponent,
    DropdownDirective,
    MenuComponent,
    PopupComponent,
    TextComponent,
    ContentManagerComponent,
    FoodEditComponent,
    UploadComponent,
    UploadFormComponent,
    FoodFormComponent,
    FoodItemComponent,
    CatagoryFormComponent,
    CategoryComponent,
    CategoryEditComponent,
    ImagesComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot(),
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    ScrollDispatchModule,
    DragDropModule
  ],
  entryComponents: [
    UploadFormComponent,
    FoodFormComponent,
    CatagoryFormComponent,
    CategoryEditComponent
  ],
  providers: [ItemsService, ContentService, MenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
