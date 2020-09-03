import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {PrizehistoryPage} from '@addon/prizehistory/prizehistory';


/**
 * Generated class for the RewardissuesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rewardissues',
  templateUrl: 'rewardissues.html',
})
export class RewardissuesPage {

  wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
  chkarr = [];
  siteUrl;
  userId;
  rewardtype;
  redeem_history;
  history = {}  ;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sitesProvider: CoreSitesProvider, private http: HttpClient) {
      const currentSite = this.sitesProvider.getCurrentSite();
      this.siteUrl = currentSite.getURL();
      this.userId = this.sitesProvider.getCurrentSiteUserId();
      this.rewardtype = this.navParams.get("type");
      this.rewardtype = this.navParams.get("rewardid");
      this.history = this.navParams.get("history");

      console.log("parameter" ,this.rewardtype,  );
      console.log("redeemhistory ", this.history);
      // this.redeemhistory();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardissuesPage');
  }

  redeemhistory() {
 

  this.http.get(this.redeem_history).subscribe((response) => {
    this.history = response ;

});

console.log("redeemhistory ", this.history);


  }

  submitIssue() {
    // this.siteurl + "/webservice/rest/server.php?wstoken=" + wstoken + "&wsfunction=raise_issue&moodlewsrestformat=json&raisedetails[userid]=" + userid + "&raisedetails[rewardid]=" + rewardid + "&raisedetails[issuetext]=" + value + "&raisedetails[rewardtype]=" + rewardtype

  }
  back() {
    this.navCtrl.pop();

  }

}
