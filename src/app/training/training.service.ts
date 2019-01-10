import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubscriptions: Subscription[] = [];

  constructor( private db: AngularFirestore, private uiService:UIService, private store:Store<fromTraining.State>) { }

  fetchAvailableExercises() {
    this.fbSubscriptions.push( this.db.collection('availableExercises').snapshotChanges().pipe(map( docArray=> {
      return docArray.map( doc => {
        return {
          id:doc.payload.doc.id,
          ...doc.payload.doc.data()
        }
      })
    })).subscribe(
      (exercises: Exercise[])=> {
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.uiService.showSnackBar('Fetching exercises failed. Please try again later', null, 3000)
      }
    ))
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDataBase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch( new Training.StopTraining());
      }
    )
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDataBase({
          ...ex,
          duration: ex.duration * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch( new Training.StopTraining());
      }
    )
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(
      this.db
        .collection('finsihedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          console.log('exercises', exercises)
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  private addDataToDataBase( exercise: Exercise) {
    this.db.collection('finsihedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach( sub => sub.unsubscribe() )
  }
}
