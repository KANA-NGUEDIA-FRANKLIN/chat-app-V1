import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { contact } from 'src/app/models/contact.model';
import { sms } from 'src/app/models/sms.model';
import { ContactManageService } from 'src/app/services/contact/contact-manage.service';
import { DiscussManageService } from 'src/app/services/discus/discuss-manage.service';
import { HttpClient } from '@angular/common/http';
import { discussion } from '../models/discuss.model';
import { AuthService } from '../services/log/auth.service';

@Component({
  selector: 'app-goo-main',
  templateUrl: './goo-main.component.html',
  styleUrls: ['./goo-main.component.css']
})
export class GooMainComponent implements OnInit {

  sendForm!: FormGroup;
  mySms!:sms;
  sms_content!:string;
  sms_received!:false;
  sms_sent!:false
  IsSending=false;
  isSent=false;

  public roomId!: string;
 
  public messageArray: { user: string, message: string }[] = [];
  private storageArray = [];

  public showScreen = false;


  public currentUser!:any;
  public selectedUser!:any;
  public contactListForuser!:any;
  public messageText!: any[];
  public uid?:string;
  myDiscuss!: discussion;
  myContact!:contact;
  userList!:contact[];
  discussSubscription!: Subscription; 
  public date_sent = formatDate(Date.now(), 'yyyy-mm-dd hh:mm:ss','en-US');
  constructor( private formBuilder: FormBuilder,
              public contactsService: ContactManageService,
              private authService : AuthService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router ) { 

              }
  
  ngOnInit(): void {
      this.myContact = new contact('','',0,'','',undefined);
      const id = this.route.snapshot.params['id'];
   
      this.discussSubscription = this.contactsService.contactSub.subscribe(
        (contacts : contact[])=>{
          this.userList = contacts; 
          console.log(this.userList);
        }
      );
      this.contactsService.getContacts(); 
      this.contactsService.emitContacts(); 
      this.contactsService.getId();
    this.mySms= new sms(this.sms_content,this.sms_received,this.sms_sent,formatDate(Date.now(), 'yyyy-mm-dd hh:mm:ss','en-US'));
    console.log('liste de contact', this.userList)
    console.log("mon uid", this.authService.idUser )
    // this.discusService.getSms(this.mySms);
    // console.log(this.discusService.getSms(this.mySms));
    this.initform();
  }
            
  initform() {
    this.sendForm= this.formBuilder.group(
      {
        textsend:['',[Validators.required]],
      });
  }

  onSaveSms( ){
    const textsend = this.sendForm.get('textsend')?.value;
    

    if( textsend !='' && this.selectedUser){
    this.mySms= new sms(textsend,false,true,this.date_sent);
    this.messageText.push(this.mySms)
    this.myDiscuss = new discussion( this.date_sent , this.messageText);
    this.selectedUser.discuss = this.myDiscuss
    console.log('ici', this.mySms);
    
    this.http
    .put<any>('http://localhost:3000/contacts/' + this.selectedUser._id, this.selectedUser)
    .subscribe(
      (reponse) => {
        console.log(reponse);
      },
      (error) => {
        console.log('Erreur sur enregistrement de la discussion ! : ' + error);
      }
    )


  }
 }

 newConversation(){

  
 }



 selectUserHandler(phone: number): void {
 
  const textsend = this.sendForm.get('textsend')?.value;
  const date_sent = formatDate(Date.now(), 'yyyy-mm-dd hh:ii:ss','en-US');
  this.selectedUser = this.userList.find(user => user.phonenumber === phone);
  // this.contactListForuser = this.selectedUser.find( (user:any) => user.idUser === this.uid);
  // console.log('liste de contact par utilisateur', this.contactListForuser);
  
  this.messageText = this.selectedUser.discuss.sms;
  console.log('contact particulier', this.selectedUser);
  console.log('je cherche sms ******  ', this.messageText);
  //console.log('liste de disc',this.selectedUser.discuss.sms[0].content)
  console.log('je veux id ',this.selectedUser._id);
 
}


}
