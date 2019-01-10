import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
    
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar){}

    showSnackBar( message, action , time ){
        this.snackbar.open( message, action, { duration: time})
    }
}