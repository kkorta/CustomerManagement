import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css']
})
export class CustomerPageComponent implements OnInit {
  dataSource: any;
  myForm!: FormGroup ;
  editForm! : FormGroup;
  users! : number;
  currEditing = false;
  editedUserId = -1;
  maxId : number = -1;
  constructor(private ds : DataServiceService, private fb : FormBuilder) {
    this.LoadUser();
   
    
   }
  value = 1;
  data: any;
  user: any;
  ngOnInit(): void {
    console.log(this.data);
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      address: new FormControl('', [Validators.required, Validators.minLength(3)]),
      vatId: new FormControl('', [Validators.minLength(12), Validators.maxLength(12)])
    });

    this.editForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      address: new FormControl('', [Validators.required, Validators.minLength(3)]),
      vatId: new FormControl('', [Validators.minLength(12), Validators.maxLength(12)])
    });

  }

  LoadUser(){
    this.ds.getData().subscribe(res => {
      this.data = res;
      for (let x of this.data){
        this.maxId = Math.max(x.id, this.maxId)
      }
    })
    
    
  }
  
  deleteUser(id : number){
    this.ds.deleteUser(id).subscribe(
  

    )
    this.reloadPage();
    
  }
  reloadPage() {
    window.location.reload();
  }

  submit(){
  
    this.users = this.data.length;
    if (this.myForm.valid) {
      let myDate = new Date();
      let formattedDate = new DatePipe('en-US').transform(myDate, 'dd.MM.yyyy');
      const newCustomer = {
        id: this.maxId + 1,
        firstname: this.myForm.get('firstName')!.value,
        lastname: this.myForm.get('lastName')!.value,
        address: this.myForm.get('address')!.value,
        vatId: this.myForm.get('vatId')!.value,
        creationDate: formattedDate
      };
      this.ds.addUser(newCustomer).subscribe(

      );
      this.reloadPage();
      this.maxId + 1;
      this.myForm.reset();
    }
  }

  startEdit(id: number){
      this.currEditing = true;
      this.editedUserId = id;
      this.ds.getUserById(id).subscribe(res => {
        this.user = res;
        this.editForm = new FormGroup({
          firstName: new FormControl('' + this.user.firstname, [Validators.required, Validators.minLength(2)]),
          lastName: new FormControl('' + this.user.lastname , [Validators.required, Validators.minLength(2)]),
          address: new FormControl('' + this.user.address, [Validators.required, Validators.minLength(3)]),
          vatId: new FormControl('' + this.user.vatId, [Validators.minLength(12), Validators.maxLength(12)])
        });
      })
      

  }
  goBack(){
    this.currEditing = false;
  }

  submitEdit(){
    if (this.editForm.valid) {
      let myDate = new Date();
      let formattedDate = new DatePipe('en-US').transform(myDate, 'dd.MM.yyyy');
      const updatedCustomer = {
        id: this.editedUserId,
        firstname: this.editForm.get('firstName')!.value,
        lastname: this.editForm.get('lastName')!.value,
        address: this.editForm.get('address')!.value,
        vatId: this.editForm.get('vatId')!.value,
        creationDate: formattedDate
      };
      this.ds.updateUser(this.editedUserId, updatedCustomer).subscribe()
    }
    this.reloadPage();
    this.currEditing = false;
  }

}

