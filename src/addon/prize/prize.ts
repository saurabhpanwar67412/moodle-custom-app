import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {PrizehistoryPage} from '@addon/prizehistory/prizehistory';

/**
 * Generated class for the PrizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prize',
  templateUrl: 'prize.html',
})
export class PrizePage {

  wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
  siteUrl ;
  coins_details; 
  userId: number;
  reward_details;
  userinfo= {}  ;
  learningPrize = {}  ;
  comphrensivePrize= {}  ;
  levelup = {}  ;
  profile = {}  ;
  params;
  level_popup;
  comprehensive_reward;
  dynamic_rewards = [];
  // country:any[]=[];
  redeem_history;
  history;
  rewardtype;
  segment: string;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sitesProvider: CoreSitesProvider,private http: HttpClient) {
      const currentSite = this.sitesProvider.getCurrentSite();
      this.siteUrl = currentSite.getURL();
      this.userId = this.sitesProvider.getCurrentSiteUserId();
      this.coins_details = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=coins_details&moodlewsrestformat=json&userid=" + this.userId;
      this.reward_details =  this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=reward_details&moodlewsrestformat=json&rewarddetails[userid]=" + this.userId;
      this.params = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=coins_details&moodlewsrestformat=json&userid=" + this.userId;
      this.level_popup = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&moodlewsrestformat=json&wsfunction=level_popup&userid=" + this.userId;
      this.comprehensive_reward = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=comprehensive_reward_details&moodlewsrestformat=json&rewarddetails[userid]=" + this.userId;
      this.segment = "learning";
      
 this.userdata();
 this.Coin_details();
 this.Comprehensive_reward();
 this.Level_popup();
 this.Reward_details();    

 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrizePage');
  }

  Coin_details() {
    this.http.get(this.coins_details).subscribe((response) => {
      this.userinfo = response ; 
      console.log("userinfo and api" ,  this.userinfo, this.coins_details );
});

  }

  Reward_details() {
    this.http.get(this.reward_details).subscribe((response) => {
     this.learningPrize = response ; 
      console.log("learningPrize and api ",this.learningPrize,this.reward_details );
});


  }

  userdata() {

    this.http.get(this.params).subscribe((response) => {
        this.profile = response ;

    console.log("user data and api", this.profile, this.params )  ;
});
}

Level_popup(){

  this.http.get(this.level_popup).subscribe((response) => {
    this.levelup = response ;

console.log("profile and api", this.levelup, this.level_popup)  ;
});
}


Comprehensive_reward() {
  this.http.get(this.comprehensive_reward).subscribe((response) => {
    this.comphrensivePrize = response ;
    console.log("response data now" , JSON.stringify(response));

   

console.log("comprehensive_reward_data and api", this.comprehensive_reward, this.comphrensivePrize)  ;
});


}
reward(){
  this.redeem_history = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=redeem_history&moodlewsrestformat=json&redeemdetails[userid]=" + this.userId + "&redeemdetails[rewardtype]=" + this.rewardtype;
  this.http.get(this.redeem_history).subscribe((response) => {
    this.history = response ;

console.log("rewards", this.history, this.rewardtype)  ;

});
setTimeout(() => {  this.navCtrl.push(PrizehistoryPage, {type:  this.rewardtype, history: this.history });
}, 1000);


}
getRewardtype(type, url){
   this.rewardtype = type;
   this.reward();
  
}




}
