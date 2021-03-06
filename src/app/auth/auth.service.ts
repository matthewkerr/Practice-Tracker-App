import { User } from './user.model';
import { AuthData } from './auth.data.module';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import *  as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {
    isAuthenticated = false;

    constructor( private router:Router, 
        private aFauth: AngularFireAuth, 
        private trainingService:TrainingService, 
        private uiService:UIService,
        private store: Store<fromRoot.State>){}

    initAuthListener() {
        this.aFauth.authState.subscribe(
            (user)=> {
                if ( user ) {
                    this.store.dispatch( new Auth.SetAuthenticated());
                    this.router.navigate(['/training']);
                } else {
                    this.store.dispatch( new Auth.SetUnAunthenticated());
                    this.trainingService.cancelSubscriptions();
                    this.router.navigate(['/']);
                }
            }
        )
    }

    registerUser( authData: AuthData ) {
        //this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.aFauth.auth.createUserWithEmailAndPassword( authData.email, authData.password ).then(
            (result)=> {
                //console.log('result', result )
                //this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            }).catch((error)=> {
                this.uiService.showSnackBar( error.message, null, 3000);
                //this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            })
    }

    login( authData ) {
        //this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.aFauth.auth.signInWithEmailAndPassword( authData.email, authData.password ).then(
            (result)=> {
                //console.log('result', result )
                //this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            }).catch((error)=> {
                this.uiService.showSnackBar( error.message, null, 3000);
                //this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            })
    }

    logout() {
        this.aFauth.auth.signOut();
    }

    getUser() {
        //return {...this.user};
    }
}