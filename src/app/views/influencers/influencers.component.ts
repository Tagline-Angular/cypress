import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { InfluencerService } from '../../shared/service/influencer.service';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UsernameValidator } from '../addbotuser/username.validator';

@Component({
  selector: 'app-influencers',
  templateUrl: './influencers.component.html',
  styleUrls: ['./influencers.component.css']
})
export class InfluencersComponent implements OnInit {
  public influencerForm!: FormGroup;
  public influencerList: any = [];
  public addButton: string = 'Add';
  public influencerToDelete: string;
  public isDeleting: boolean = false

  constructor(
    private influencerService: InfluencerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.influencerForm = this.fb.group({
      name: ['', [Validators.required, UsernameValidator.noWhiteSpace]],
      downloadCount: [0],
      createdDate: ['']
    })
    this.getAllInfluencers();
  }

  get f() {
    return this.influencerForm.controls;
  }

  onSubmit() {
    this.addButton = 'Adding...';
    this.influencerForm.patchValue({
      createdDate: new Date() //store exact current time
    })
    this.influencerService.addInfluencer(this.influencerForm.value).then((res: any) => {
      this.getNewInfluencer(res.id);
    }).catch(e => {
      console.log('Add influencer :>> ', e);
    });
  }


  addStaticLink(id: string, data: any) {
    const url = window.location.href.split('#')[0] + '#/download/' + id;
    const details = {
      ...data,
      staticUrl: url
    }
    this.influencerService.addInfluencerLink(id, details).then((res) => {
      this.createInfluencerLink(id);
    })
  }

  getNewInfluencer(id) {
    this.influencerService.getInfluencer(id).subscribe((res) => {
      const data: any = res.map((e) => {
        return e.payload.doc.data();
      })
      if (!data[0]?.staticUrl) this.addStaticLink(id, data[0]);
    })
  }

  getAllInfluencers() {
    this.influencerService.getAllInfluencers().subscribe((res) => {
      this.influencerList = res.map((e: any) => {
        return Object.assign(
          {
            id: e.payload.doc.id,
          }, e.payload.doc.data());
      });
    })
  }

  getInfluencerDetails(id: string, url: string) {
    this.influencerService.getInfluencer(id).subscribe((res) => {
      const data: any = res.map((e) => {
        return e.payload.doc.data()
      })
      if (data[0]?.url && data[0]?.url.length) {
        return;
      }
      this.addInfluencerLink(url, data, id)
    }
    )
  }

  copyText(url: any) {
    navigator.clipboard.writeText(url).then(() => {
      this.toastr.show(
        'Copied to clipboard !',
        '',
        { positionClass: 'toast-bottom-center', messageClass: 'text-center', titleClass: 'd-none' }
      );
    });
  }

  addInfluencerLink(url: string, data: any, id: string) {
    if (data[0]?.url && data[0].url?.length) { return }
    data = {
      ...data[0],
      url: url
    }
    this.influencerService.addInfluencerLink(id, data).then((res) => {
      this.influencerForm.patchValue({
        name: ''
      })
      this.toastr.success("Influencer added");
      this.addButton = 'Add';
    })
  }

  createInfluencerLink(id: string) {
    const data: any = {
      dynamicLinkInfo: {
        "domainUriPrefix": 'https://trueconvosios.page.link',
        "link": `https://play.google.com/store/apps/details?id=com.trueconvos.socialapp&inf=${id}`,
        "androidInfo": {
          "androidPackageName": 'com.trueconvos.socialapp',
        },
        "iosInfo": {
          "iosBundleId": 'com.theexotech.true.convos',
          "iosIpadBundleId": "com.theexotech.true.convos",
          "iosAppStoreId": "1545810479"
        },
      },
      suffix: {
        "option": "SHORT"
      }
    }

    this.influencerService.createInfluencerLink(data).subscribe((res: any) => {
      if (res) {
        this.getInfluencerDetails(id, res.shortLink);
      }
    })
  }

  handleDeleteModal(id: string) {
    this.influencerToDelete = id;
  }

  deleteInfluencer() {
    this.isDeleting = true
    this.influencerService.deleteInfluencer(this.influencerToDelete).then(() => {
      this.toastr.success("Influencer deleted");
      this.influencerToDelete = '';
      this.isDeleting = false;
    })
  }
}
