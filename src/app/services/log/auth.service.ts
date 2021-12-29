import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { 

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
          window.alert(result.user);
          console.log(result.user);
          resolve();
        },
        (error)=>{
          window.alert(error);
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
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }
  
  signOutUser(){  
    this.afAuth.signOut();
  }

}
