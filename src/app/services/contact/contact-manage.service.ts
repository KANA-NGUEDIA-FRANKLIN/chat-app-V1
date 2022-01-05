import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { contact } from 'src/app/models/contact.model';
import {AngularFireDatabase} from '@angular/fire/database'
import { AngularFireStorage} from "@angular/fire/storage";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactManageService {

  contacts: contact[] = []; 
  uid?:string;
  contactSub = new Subject<contact[]>();
  contactSelected = new Subject<contact>();

  constructor(private afdBase: AngularFireDatabase,
              public firestore : AngularFireStorage,
              private http : HttpClient
            ) { 
              this.getId()
              console.log(this.uid)
            }

  emitContacts(){
    this.contactSub.next(this.contacts); 
  }

saveContacts(){
  /* this.afdBase.database.ref("/contacts").set(this.contacts); */

  let contact
  for(let i = 0; i<this.contacts.length;i++){
    contact = this.contacts[i]
    if(contact._id){
     this.http
     .put<any>('http://localhost:3000/contacts/' + i , contact)
     .subscribe(
       (reponse) => {
         console.log(reponse);
       },
       (error) => {
         console.log('Erreur ! : ' + error);
       }
     )

     console.log('tous les contacts',contact);
     
   }
    if(true){
     this.http
     .post<any>('http://localhost:3000/contacts', contact )
     .subscribe(
       (reponse) => {
         console.log(reponse);
       },
       (error) => {
         console.log('Erreur ! : ' + error);
       }
     )
    }
  }
 // console.log( this.afdBase.database.ref('/contacts').set(this.contacts));

}
postContact(contact:contact){
  if(this.uid){
    console.log("uid aue je recuperer", this.uid);
  }
   contact.idUser = this.uid;
    this.http
    .post<any>('http://localhost:3000/contacts', contact )
    .subscribe(
      (reponse) => {
        console.log(reponse);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    )
    this.getContacts()
   
}

getContacts(){ //recupeerer la liste des contacts
 /* this.afdBase.database.ref('/contacts').on('value',(data)=>{
   this.contacts=data.val() ? data.val() : [];
   this.emitContacts();
 }); */
 this.http
     .get<any>('http://localhost:3000/contacts')
     .subscribe(
       (reponse) => {
         this.contacts = reponse;
         this.emitContacts()
       },
       (error) => {
         console.log('Erreur ! : ' + error);
       }
     )

}

//retourner un seul contact 
getSingleContact(id: number){
 
 this.getContacts()
 return this.contacts[id]

 /* return new Promise(
   (resolve,reject)=>{
     this.afdBase.database.ref('/contacts/'+ id).once('value').then(
       (data)=>{
         resolve(data.val());
       },(error)=>{
         reject(error);
       }
     );
   }
 ); */

}

//creation d'un contact
createNewContact(newContact: contact){
 this.contacts.push(newContact);
 this.postContact(newContact)
 this.emitContacts();
 this.getId();
//  console.log(this.saveContacts());
}

removeContact(contact: contact){
 
 /* const contactIndexToRemove = this.contacts.findIndex(
   (contactEl):any =>{
       if(contactEl === contact){
         return true;
       }
   }
 );  */
 this.http
     .request('delete','http://localhost:3000/contacts/' + contact._id)
     .subscribe(
       (reponse) => {
         console.log(reponse)
       },
       (error) => {
         console.log('Erreur ! : ' + error);
       }
     )

 
 /* this.contacts.splice(contactIndexToRemove,1);*/
//  this.saveContacts();
 this.emitContacts();
 this.getContacts() 
}

uploadFile(file : File){
 return new Promise(
   (resolve,reject)=>{
     const almostUniqueFileName= Date.now().toString();
     const upload = this.firestore.storage.ref().child('images/'+ almostUniqueFileName+file.name).put(file);
     
     upload.on('state_changed', 
       ()=>{
         console.log('chargement');
       },(error)=>{
           console.log('Erreur de chargement:' +error);
           reject()
       },
       ()=>{
         resolve(upload.snapshot.ref.getDownloadURL())
       }
     )
  
   })
}

getId():any{
 if (this.uid){
   return this.uid;
 }

}

}
