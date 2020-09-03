import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {CoreCourseHelperProvider} from '@core/course/providers/helper.ts';
import { CoreCourseSectionPage } from '@core/course/pages/section/section';


/**
 * Generated class for the SalestoolsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salestools',
  templateUrl: 'salestools.html',
})
export class SalestoolsPage {
  wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
  siteUrl ;
  userId: number;
  sales_tools  ;
  param;
  param_module;
  course_Sec;
  salestool_check;
 
data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private sitesProvider: CoreSitesProvider, private http: HttpClient,
    public helperservice:CoreCourseHelperProvider) {
      const currentSite = this.sitesProvider.getCurrentSite();
    this.siteUrl = currentSite.getURL();
    this.userId = this.sitesProvider.getCurrentSiteUserId();
    this.param = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=sales_tools&moodlewsrestformat=json&&userid=" + this.userId;
   console.log( "    this.param ",    this.param );
   
this.salestool();

  }

  salestool() { 

    this.http.get(this.param).subscribe((response) => {
      this.sales_tools = response ;
});
console.log("sales_tools", this.sales_tools);
console.log("salest tool lenght" , this.sales_tools)

}

  ionViewDidLoad() {
  
    console.log('ionViewDidLoad SalestoolsPage');
  }


  test(id,fullname,shortname,idnumber,visible,summary,summaryformat,format,showgrades,lang,enablecompletion,category,startdate) {
    
this.data =    {
   category: category,
   categoryname: null,
   color: 0,
   colorNumber: 5 ,
   completed: undefined,
   courseImage: false,
   coursestartdate: startdate,
   displayname: fullname,
   enablecompletion: true,
   format: format,
   fullname: fullname,
   id: id,
   idnumber: idnumber,
   lang: lang,
   shortname: shortname,
   showgrades: showgrades,
   summary:summary,
   summaryformat: summaryformat,
   visible: visible ,
  
  }

  

console.log("testing hardcoded data", this.data);

this.navCtrl.push(CoreCourseSectionPage, {course : this.data});

  }

  

}
