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
  public messageText!: any[];
  myDiscuss!: discussion;
  myContact!:contact;
  userList!:contact[];
  discussSubscription!: Subscription; 

  constructor( private formBuilder: FormBuilder,
              private contactsService: ContactManageService,
              private discusService : DiscussManageService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router ) { 

              }
  
  ngOnInit(): void {
      this.myContact = new contact('','',0,'','',undefined);
      const id = this.route.snapshot.params['id'];
      // this.contactsService.getSingleContact(+id).then(
      //   (myCont:any)=>{
      //     this.myContact = <contact> myCont;
          
      //     console.log(this.myContact);
      //   }
      // );

      this.discussSubscription = this.contactsService.contactSub.subscribe(
        (contacts : contact[])=>{
          this.userList = contacts; 
          console.log(this.userList);
        }
      );
      this.contactsService.getContacts(); 
      this.contactsService.emitContacts(); 

    this.userList.push(this.myContact);
    this.mySms= new sms(this.sms_content,this.sms_received,this.sms_sent,formatDate(Date.now(), 'yyyy-mm-dd hh:ii:ss','en-US'));
    console.log('liste de contact', this.userList);
    
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
    const date_sent = formatDate(Date.now(), 'yyyy-mm-dd hh:ii:ss','en-US');

    if( textsend !='' && this.selectedUser){
    this.mySms= new sms(textsend,this.sms_received,this.sms_sent,date_sent);
    this.messageText.push(this.mySms)


    this.myDiscuss = new discussion( date_sent , this.messageText);
    // this.discusService.onSaveSms(this.selectedUser._id, this.myDiscuss);
    //this.discusService.getSms(this.mySms);

    this.http
    .put<any>('http://localhost:3000/contacts/' + this.selectedUser._id ,
    {
    discuss :{
    endpoint:"2020-06-05T23:00:00.000Z",
      sms: [
          {
              content: "lorem dhfksdfsdfsdf ca marche bien",
              type_send: true,
              date_send: "2009-12-07T23:00:00.000Z",
              _id: "61d479e8b9b67ab17213b13a"
          }
        
      ]
  }}
    )
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
  this.messageText = this.selectedUser.discuss.sms;
  console.log('contact particulier', this.selectedUser);
  console.log('je cherche sms ******  ', this.messageText);
  //console.log('liste de disc',this.selectedUser.discuss.sms[0].content)
  console.log('je veux id ',this.selectedUser._id);
 
}


}
