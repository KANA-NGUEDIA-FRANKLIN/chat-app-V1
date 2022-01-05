export class sms{

  years!:Date;

  constructor(  public content: string,
                public type_send: boolean,
                public type_rcept:boolean,
                public date_sent: any)
                
{ }

}