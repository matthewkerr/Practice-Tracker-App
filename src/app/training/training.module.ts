import { NgModule } from '@angular/core';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingDialogComponent } from './stop-training-dialog/stop-training-dialog.component';
import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TraingingRouteModule } from './training-route.module';
import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './training.reducer';


@NgModule({
    declarations: [
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        TrainingComponent,
        StopTrainingDialogComponent
    ],
    imports: [
        SharedModule,
        TraingingRouteModule,
        StoreModule.forFeature('training', trainingReducer)
    ],
    entryComponents: [StopTrainingDialogComponent]
})
export class TrainingModule {

}