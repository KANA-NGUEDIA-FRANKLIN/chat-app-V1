import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { contact } from 'src/app/models/contact.model';
import { sms } from 'src/app/models/sms.model';

@Injectable({
  providedIn: 'root'
})
export class DiscussManageService {

  ListSms:sms[]= [];
  storeContact!:contact;
  contacts: contact[] = []; 
  contactSub = new Subject<contact[]>();
    constructor(private afdBase: AngularFireDatabase,
              public firestore : AngularFireStorage,
            ) { }

  saveDiscuss(){
    
  }

  getDiscuss(){
    return this.storeContact;
  }

  deleteDiscuss(){

  }
  
  getSms(mySms : sms ){
      this.ListSms.push(mySms);
      return this.ListSms;
    }
  
}
