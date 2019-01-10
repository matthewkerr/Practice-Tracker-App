import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule
    ]
})
export class SharedModule {

}