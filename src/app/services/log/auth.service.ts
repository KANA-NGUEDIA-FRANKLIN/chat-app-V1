import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { users } from 'src/app/models/users.model';
import { ContactManageService } from '../contact/contact-manage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public idUser?:string;

  constructor(public afAuth: AngularFireAuth,
    public contactService: ContactManageService) { 

  }

createNewUser(email:string , password:string){
    return new Promise<void>(
      (resolve, reject) => {
       this.afAuth.createUserWithEmailAndPassword(email,password).then(
         (result)=>{
          window.alert("You have been successfully registered!");
          console.log(result.user);
          resolve();
         },
         (error)=>{
          window.alert(error.message);
           reject(error);
         }
       );
    }
  );
}

signInUser(email:string , password:string){
  return new Promise<void>(
    (resolve,reject)=>{
      this.afAuth.signInWithEmailAndPassword(email,password).then(
        (result)=>{
      
          console.log(result.user?.uid);
          this.contactService.uid = result.user?.uid;
          this.idUser= result.user?.uid;
          resolve();
        },
        (error)=>{
        
          console.log(error);
          reject(error);
        }
      );
    }
  );
}
  ForgotPassword(passwordResetEmail:string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      console.log('Password reset email sent, check your inbox.');;
      
    }).catch((error) => {
      console.log("eror can't do this forget password");;
    })
  }
  
  signOutUser(){  
    this.afAuth.signOut();
  }

}
