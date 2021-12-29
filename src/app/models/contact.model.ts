export class contact{
  photo!:string
  constructor(public firstname:string,
              public lastname:string,
              public phonenumber:number,
              public email?:string,
              public profession?:string,
              public birthday?:Date)
  {

      
  }

}