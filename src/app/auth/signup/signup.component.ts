import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate;
  minDate = new Date(1972, 9, 28);
  isLoading$: Observable<boolean>;

  constructor( private authService: AuthService, private store:Store<fromRoot.State>) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading)
  }

  OnSubmit( form: NgForm) {
    this.authService.registerUser( {
      email: form.value.email,
      password: form.value.password
    })
  }
}
