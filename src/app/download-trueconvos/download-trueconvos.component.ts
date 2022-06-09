import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfluencerService } from '../shared/service/influencer.service';

@Component({
  selector: 'app-download-trueconvos',
  templateUrl: './download-trueconvos.component.html',
  styleUrls: ['./download-trueconvos.component.css']
})
export class DownloadTrueconvosComponent implements OnInit {
  public influencerId: string;
  public influencerDetails: any;
  public showDownload: boolean = false;
  public showError: boolean = false;
  public redirectUrl: string;

  constructor(private route: ActivatedRoute, private influencerService: InfluencerService, private router: Router) {
    this.influencerId = this.route.snapshot.params['id'];;
  }

  ngOnInit(): void {
    this.influencerService.getInfluencer(this.influencerId).subscribe((res) => {
      this.influencerDetails = res.map((e) => {
        return Object.assign({
          id: e.payload.doc.id
        }, e.payload.doc.data())
      })
      if (this.influencerDetails && this.influencerDetails.length) {
        this.showDownload = true;
      } else {
        this.showError = true;
      }
    })
  }

  public redirectToDownload() {
    window.location.href = this.influencerDetails[0].url;
  }
}