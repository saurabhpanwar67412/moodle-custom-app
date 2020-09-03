import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTabsComponent } from '@components/tabs/tabs';
import { CoreBlockDelegate } from '@core/block/providers/delegate';
import { CoreBlockComponent } from '@core/block/components/block/block';
import { CoreSiteHomeProvider } from '@core/sitehome/providers/sitehome';
import { CoreSiteHomeIndexComponent } from '@core/sitehome/components/index/index';
import { NgZone } from '@angular/core';





/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
  userId: number;
  siteUrl ;
  ranking_get_ranking ;
  leaderboard = null;
  segment: string;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
            private sitesProvider: CoreSitesProvider, private siteHomeProvider: CoreSiteHomeProvider,
            private eventsProvider: CoreEventsProvider, private domUtils: CoreDomUtilsProvider, private blockDelegate: CoreBlockDelegate, private http: HttpClient, private zone: NgZone) {

              this.segment = "national";
    var modal = this.domUtils.showModalLoading();
    const currentSite = this.sitesProvider.getCurrentSite();
    this.siteUrl = currentSite.getURL();
    this.userId = this.sitesProvider.getCurrentSiteUserId();
    this.leaderboard = JSON.parse(this.navParams.get("jsonData"));
    console.log("leaderbboard data", this.leaderboard.usertype.usertype);
    //  this.ranking_get_ranking = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&moodlewsrestformat=json&wsfunction=blocks_ranking_get_ranking&moodlewsrestformat=json&userid=" + this.userId;
    // console.log("ranking data", this.ranking_get_ranking);
    // this.leaderboard_data();
    modal.dismiss();


   
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaderboardPage');
  }
  leaderboard_data() {
    this.http.get(this.ranking_get_ranking).subscribe((response) => {
      this.leaderboard = response ;
      console.log("response data now" , JSON.stringify(response));
  
     
  
  console.log("comprehensive_reward_data and api", this.leaderboard, this.leaderboard)  ;
  });
  
  
  }



}
