import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingDialogComponent } from '../stop-training-dialog/stop-training-dialog.component';
import { TrainingService } from '../training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: any;

  constructor( private dialog: MatDialog, private trainingService: TrainingService, private store:Store<fromTraining.State>) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  OnStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open( StopTrainingDialogComponent, 
      { data: 
        { progress: this.progress }
      } 
    );

    dialogRef.afterClosed().subscribe(
      (result) => {
        if ( result ) {
          this.trainingService.cancelExercise( this.progress );
        } else {
          this.startOrResumeTimer();
        }
      })
  }

  startOrResumeTimer() {
    this.store.select( fromTraining.getActiveTraining).pipe(take(1)).subscribe( 
      ex=> { const step  = ex.duration / 100 * 1000;
      this.timer = setInterval(()=> {
        this.progress = this.progress + 1;
        if ( this.progress >= 100 ) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step)
    });
  }
}
