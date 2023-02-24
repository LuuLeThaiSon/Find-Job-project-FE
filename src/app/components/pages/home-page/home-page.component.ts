import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {JobService} from "../../service/job.service";
import {Job} from "../../model/job";
import {Locations} from "../../model/locations";
import {LocationsService} from "../../service/locations.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers:[MessageService]
})
export class HomePageComponent implements AfterViewInit{
  jobs: Job[] = [];
  partTimeJobs: Job[] = [];
  fullTimeJobs: Job[] = [];
  locations: Locations[] = [];
  highDemandJobs: Job[] = [];
  topOfferJobs:Job[] = [];

  constructor(private elementRef:ElementRef,
              private jobService: JobService,
              private locationsService: LocationsService,
              private messageService: MessageService) {
    this.findAll();
    this.findAllLocations();
    this.findTopOfferJobs();
    this.findTopDemandJobs()
  };

  findAll() {
    return this.jobService.findAll().subscribe((data) => {
      this.jobs = data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].type) {
          this.fullTimeJobs.push(data[i])
        } else {
          this.partTimeJobs.push(data[i])
        }
      };
    })
  }

  findTopDemandJobs(){
    return this.jobService.findAll().subscribe((data) => {
      this.highDemandJobs = data.sort((a, b) => a.quantity - b.quantity);
    })
  }

  findTopOfferJobs() {
    return this.jobService.findAll().subscribe((data) => {
      this.topOfferJobs = data.sort((a, b) => a.salaryMax - b.salaryMax);
    })
  }

  findAllLocations() {
    return this.locationsService.findAll().subscribe((data) => {
      this.locations = data;
      console.log(this.locations)
    })
  }

  ngAfterViewInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../../assets/libs/choices.js/public/assets/scripts/choices.min.js";
    this.elementRef.nativeElement.appendChild(s);

    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = "../../assets/libs/swiper/swiper-bundle.min.js";
    this.elementRef.nativeElement.appendChild(s1);

    var s2 = document.createElement("script");
    s2.type = "text/javascript";
    s2.src = "../../assets/js/pages/job-list.init.js";
    this.elementRef.nativeElement.appendChild(s2);

    var s3 = document.createElement("script");
    s3.type = "text/javascript";
    s3.src = "../../assets/js/pages/index.init.js";
    this.elementRef.nativeElement.appendChild(s3);

    var s4 = document.createElement("script");
    s4.type = "text/javascript";
    s4.src = "../../assets/js/app.js";
    this.elementRef.nativeElement.appendChild(s4);

    var s5 = document.createElement("script");
    s5.type = "text/javascript";
    s5.src = "../../assets/js/pages/switcher.init.js";
    this.elementRef.nativeElement.appendChild(s5);

    var s7 = document.createElement("script");
    s7.type = "text/javascript";
    s7.src = "https://unicons.iconscout.com/release/v4.0.0/script/monochrome/bundle.js";
    this.elementRef.nativeElement.appendChild(s7);
  }

  showSuccess() {
    this.messageService.add({severity: 'success', summary: 'success', detail: 'Login successfully!'})
  }

  showInfo() {
    this.messageService.add({severity: 'info', summary: 'Info', detail: 'Wish you have a good day!', key: 'ab'});
  }

  showWarn() {
    this.messageService.add({severity: 'warn', summary: 'Warn', detail: 'Message Content'});
  }

  showError() {
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Login fail! You can try again!'});
  }

  showCustom() {
    this.messageService.add({severity: 'custom', summary: 'Custom', detail: 'Message Content', icon: 'pi-file'});
  }

  showTopLeft() {
    this.messageService.add({key: 'tl', severity: 'info', summary: 'Info', detail: 'Message Content'});
  }

  showTopCenter() {
    this.messageService.add({key: 'tc', severity: 'warn', summary: 'Warn', detail: 'Message Content'});
  }

  showBottomCenter() {
    this.messageService.add({key: 'bc', severity: 'success', summary: 'Success', detail: 'Message Content'});
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Are you sure?',
      detail: 'Confirm to proceed',
      id: 1
    });
  }

  showMultiple() {
    this.messageService.addAll([
      {severity: 'success', summary: 'Message 1', detail: 'Message Content'},
      {severity: 'info', summary: 'Message 2', detail: 'Message Content'},
      {severity: 'warn', summary: 'Message 3', detail: 'Message Content'}
    ]);
  }

  showSticky() {
    this.messageService.add({severity: 'info', summary: 'Sticky', detail: 'Message Content', sticky: true});
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
}
