import { contact } from "./contact.model";
import { sms } from "./sms.model";

export class discussion{
  constructor(public myContact: contact,
              public endPoint:Date,
              public sms:sms)
  {
      
  }

}