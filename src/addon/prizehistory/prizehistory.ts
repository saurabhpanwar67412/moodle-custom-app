import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {RewardissuesPage} from '@addon/rewardissues/rewardissues';


/**
 * Generated class for the PrizehistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prizehistory',
  templateUrl: 'prizehistory.html',
})
export class PrizehistoryPage {
  wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
  siteUrl ;
  userId: number;
  rewardtype ; 
  history =  {}  ; 
  redeem_history ;
  rewardid ; 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sitesProvider: CoreSitesProvider, private http: HttpClient) {
      const currentSite = this.sitesProvider.getCurrentSite();
      this.siteUrl = currentSite.getURL();
      this.rewardtype = this.navParams.get("type");
      this.history = this.navParams.get("history");
      console.log('history data and type', this.history, this.rewardtype);
      this.userId = this.sitesProvider.getCurrentSiteUserId();
      this.redeem_history = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=redeem_history&moodlewsrestformat=json&redeemdetails[userid]=" + this.userId + "&redeemdetails[rewardtype]=" + this.rewardtype;


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrizehistoryPage');
  }

  getRewardtype(rewardid, url) {
    this.rewardid = rewardid;
    this.redeem_history = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=redeem_history&moodlewsrestformat=json&redeemdetails[userid]=" + this.userId + "&redeemdetails[rewardtype]=" + this.rewardid;
    console.log("redeem history" ,  this.redeem_history);
    this.http.get(this.redeem_history).subscribe((response) => {
      this.history = response ;
      setTimeout(() => {      this.navCtrl.push(RewardissuesPage,{rewardid:rewardid,url:url,history:this.history  });
}, 1000);



  });


}

  

  }
