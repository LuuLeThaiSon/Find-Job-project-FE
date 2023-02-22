import {Component, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../model/role";
import {Company} from "../../model/company";
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../../service/company.service";
import {finalize} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {HeaderComponent} from "../../common/header/header.component";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[MessageService]
})
export class RegisterComponent {
  companies: Company[] = []
  company!: Company
  formRegister!: FormGroup
  passwordSend = {to: '', subject: '', message: null, messageC: ''}
  role: Role[] = []
  imageFile?: any
  path!: string
  pathName!: string
  selectedOption: any;




  ngOnInit(): void {
    this.loading = true
    this.formRegister = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      password: new FormControl('', [Validators.required, Validators.min(8)]),
      tel: new FormControl('', [Validators.required]),
      shortName: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      numberOfEmployees: new FormControl('', [Validators.required]),
      googleMap: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      role: new FormGroup({
        id: new FormControl('', [Validators.required])
      })

    })
    this.companyService.findAllRole().subscribe((data) => {
      this.role = data
      data.shift()
      for (let a of data) {
        this.selectedOption = data[1].id
      }
    })
  }

  constructor(private routerActive: ActivatedRoute,
              private router: Router,
              private companyService: CompanyService,
              private storage: AngularFireStorage,
              private messageService: MessageService
  ) {
  }

  submitAvatar(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      if (this.pathName !== this.imageFile.name) {
        this.pathName = this.imageFile.name
        const imagePath = `image/${this.imageFile.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(imagePath);
        this.storage.upload(imagePath, this.imageFile).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.path = url
            });
          })
        ).subscribe()
      }
    }
  }

  onSubmit() {
    this.loading = false;
    console.log(this.formRegister.value)
    if (this.imageFile !== undefined) {
      const imagePath = `${this.imageFile.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(imagePath);
      this.storage.upload(imagePath, this.imageFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.passwordSend.to = this.formRegister.get('email')?.value
            this.passwordSend.subject = 'Congratulation you become a company!'
            // @ts-ignore
            this.passwordSend.message = this.formRegister.get('password')?.value
            this.company = this.formRegister.value
            this.company.status = true
            this.company.avatar = url
            this.company.password = null
            this.company.role = {id: 2, name: 'COMPANY'}
            this.company.numberOfEmployees = 0
            this.companyService.getPassword(this.passwordSend).subscribe((data) => {
              this.company.password = data.message
              this.companyService.saveCompany(this.company).subscribe(() => {
                setTimeout(() => {
                  this.loading = false
                }, 1000)
                setTimeout(() => {
                  this.loading = true
                  this.router.navigate(['/login']).finally()
                },2000)
              })
            })
          });
        })
      ).subscribe()
    } else {
      this.passwordSend.to = this.formRegister.get('email')?.value
      this.passwordSend.subject = 'Congratulation you become a company!'
      // @ts-ignore
      this.passwordSend.message = this.formRegister.get('password')?.value
      this.company = this.formRegister.value
      this.company.status = true
      this.company.avatar = ""
      this.company.password = null
      this.company.role = {id: 2, name: 'COMPANY'}
      this.company.numberOfEmployees = 0
      this.companyService.getPassword(this.passwordSend).subscribe((data) => {
        this.company.password = data.message
        this.companyService.saveCompany(this.company).subscribe(() => {
          setTimeout(() => {
            this.showSuccess2()
          },500)
          setTimeout(() => {
            this.loading = false
          }, 2000)
        })
        setTimeout(() => {
          this.loading = true
          this.router.navigate(['/login']).finally()
        },2000)
        return
      })
    }
  }


  checkName(name: string): void {
    this.companyService.findAllCompany().subscribe((data) => {
      for (let a of data) {
        if (a.name.toLowerCase() === name.toLowerCase()) {
          setTimeout(() => {
            this.showError()
          },50,1)
          this.formRegister.get('name')?.setValue('')
        }
      }
    })
  }

  checkEmail(mail: string): void {
    this.companyService.findAllCompany().subscribe((data) => {
      for (let a of data) {
        if (a.email.toLowerCase() === mail.toLowerCase()) {
          setTimeout(() => {
            this.showError1()
            this.formRegister.get('email')?.setValue('')
          },50,1)
        }
      }
    })
  }


  @ViewChild(HeaderComponent)
  header: HeaderComponent | undefined;

  loading!: boolean;

  showSuccess() {
    this.messageService.add({severity: 'success', summary: 'success', detail: 'You can use this name', key:'ab'})
  }

  showSuccess2() {
    this.messageService.add({severity: 'success', summary: 'success', detail: 'Register Successfully! Pls check your mail box to get password!', key:'ab'})
  }

  showSuccess1() {
    this.messageService.add({severity: 'success', summary: 'success', detail: 'You can use this email', key: 'ab'})
  }

  showInfo() {
    this.messageService.add({severity: 'info', summary: 'Info', detail: 'Wish you have a good day!', key: 'ab'});
  }

  showWarn() {
    this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Message Content'});
  }

  showError() {
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Username existed. Please choose another name!', key:'ab'});
  }

  showError1() {
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email existed. Please choose another email!', key:'ab'});
  }

  clear() {
    this.messageService.clear();
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
  }
}


