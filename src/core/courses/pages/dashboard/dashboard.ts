// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreTabsComponent } from '@components/tabs/tabs';
import { CoreBlockDelegate } from '@core/block/providers/delegate';
import { CoreBlockComponent } from '@core/block/components/block/block';
import { CoreSiteHomeProvider } from '@core/sitehome/providers/sitehome';
import { CoreSiteHomeIndexComponent } from '@core/sitehome/components/index/index';
import { CoreCoursesProvider } from '../../providers/courses';
import { CoreCoursesDashboardProvider } from '../../providers/dashboard';
import { CoreCoursesMyCoursesComponent } from '../../components/my-courses/my-courses';
import {LeaderboardPage} from '../../../../addon/leaderboard/leaderboard';
import {PrizePage} from '@addon/prize/prize';
import {AddonNotificationsListPage} from '@addon/notifications/pages/list/list';
import {SalestoolsPage} from '@addon/salestools/salestools';


/**
 * Page that displays the dashboard.
 */
@IonicPage({ segment: 'core-courses-dashboard' })
@Component({
    selector: 'page-core-courses-dashboard',
    templateUrl: 'dashboard.html',
})
export class CoreCoursesDashboardPage implements OnDestroy {
    @ViewChild(CoreTabsComponent) tabsComponent: CoreTabsComponent;
    @ViewChild(CoreSiteHomeIndexComponent) siteHomeComponent: CoreSiteHomeIndexComponent;
    @ViewChildren(CoreBlockComponent) blocksComponents: QueryList<CoreBlockComponent>;
    @ViewChild(CoreCoursesMyCoursesComponent) mcComponent: CoreCoursesMyCoursesComponent;

    firstSelectedTab: number;
    siteHomeEnabled = false;
    tabsReady = false;
    searchEnabled: boolean;
    tabs = [];
    siteName: string;
    blocks: any[];
    dashboardEnabled = false;
    userId: number;
    dashboardLoaded = false;
    wstoken = "69f716cb0481786ec50aa0bbe003d5a0";
    siteUrl ;
    siteInfo = String;
    params; 
    latestenrolledcourse;
    levelpopup ; 
    profile ; 
    enrolledcoursedata ; 
    levelpopupdata ;
    comprehensivelevelsdata ; 
    comprehensivelevels ; 
    tractor ; 
    progressBar ; 
    percent ; 
    ranking_get_ranking ;
    leaderboard ; 
    target_next_level;
    targetData;


    downloadEnabled: boolean;
    downloadEnabledIcon = 'square-outline'; // Disabled by default.
    downloadCourseEnabled: boolean;
    downloadCoursesEnabled: boolean;

    protected isDestroyed;
    protected updateSiteObserver;

    constructor(private navCtrl: NavController, private coursesProvider: CoreCoursesProvider,
            private sitesProvider: CoreSitesProvider, private siteHomeProvider: CoreSiteHomeProvider,
            private eventsProvider: CoreEventsProvider, private dashboardProvider: CoreCoursesDashboardProvider,
            private domUtils: CoreDomUtilsProvider, private blockDelegate: CoreBlockDelegate, private http: HttpClient) {
            const currentSite = this.sitesProvider.getCurrentSite();
            this.siteInfo = currentSite.getInfo();
            this.siteName = currentSite.getSiteName();
            this.siteUrl = currentSite.getURL();
            this.userId = this.sitesProvider.getCurrentSiteUserId();
            this.params = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=coins_details&moodlewsrestformat=json&userid=" + this.userId;
            this.latestenrolledcourse = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=latest_enrolled_course&moodlewsrestformat=json&userid=" + this.userId;
            this.levelpopup = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&moodlewsrestformat=json&wsfunction=level_popup&userid=" + this.userId;
            this.comprehensivelevels = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&wsfunction=comprehensive_levels&moodlewsrestformat=json&userid=" + this.userId;
            this.ranking_get_ranking = this.siteUrl + "/webservice/rest/server.php?wstoken=" + this.wstoken + "&moodlewsrestformat=json&wsfunction=blocks_ranking_get_ranking&moodlewsrestformat=json&userid=" + this.userId;
            this.target_next_level =  this.siteUrl +  "/webservice/rest/server.php?wstoken=" + this.wstoken +  "&wsfunction=target_next_lvl&moodlewsrestformat=json&userid=" + this.userId;
            console.log("this.target", this.target_next_level);
            console.log("ranking data", this.ranking_get_ranking);
            console.log("param api =>" , this.params);
            console.log("course => " , this.latestenrolledcourse);
            console.log("levelpopup => " , this.levelpopup);
            console.log("comprehensivelevels => " , this.comprehensivelevels);
         

            
            
            this.userdata();
            this.enrolled_course();
            this.levelpop();
            this.comprehensive();
            this.leaderboard_data();
    

            this.http.get(this.target_next_level).subscribe((response) => {
                this.targetData = response ;
                console.log("targetData" , JSON.stringify(response));
            
            
        });
        console.log("targetData", this.targetData, this.targetData)  ;


    }

  

    /**
     * View loaded.
     * 
     */
    ionViewDidLoad(): void {
        this.searchEnabled = !this.coursesProvider.isSearchCoursesDisabledInSite();
        this.downloadCourseEnabled = !this.coursesProvider.isDownloadCourseDisabledInSite();
        this.downloadCoursesEnabled = !this.coursesProvider.isDownloadCoursesDisabledInSite();

        // Refresh the enabled flags if site is updated.
        this.updateSiteObserver = this.eventsProvider.on(CoreEventsProvider.SITE_UPDATED, () => {
            this.searchEnabled = !this.coursesProvider.isSearchCoursesDisabledInSite();
            this.downloadCourseEnabled = !this.coursesProvider.isDownloadCourseDisabledInSite();
            this.downloadCoursesEnabled = !this.coursesProvider.isDownloadCoursesDisabledInSite();

            this.switchDownload(this.downloadEnabled);

            this.loadSiteName();

        }, this.sitesProvider.getCurrentSiteId());

        const promises = [];

        promises.push(this.siteHomeProvider.isAvailable().then((enabled) => {
            this.siteHomeEnabled = enabled;
        }));

        promises.push(this.loadDashboardContent());

        // Decide which tab to load first.
        Promise.all(promises).finally(() => {
            if (this.siteHomeEnabled && this.dashboardEnabled) {
                const site = this.sitesProvider.getCurrentSite(),
                    displaySiteHome = site.getInfo() && site.getInfo().userhomepage === 0;

                this.firstSelectedTab = displaySiteHome ? 0 : 1;
            } else {
                this.firstSelectedTab = 0;
            }

            this.tabsReady = true;
        });
    }
    

    /**
     * User entered the page.
     */
    ionViewDidEnter(): void {
        this.tabsComponent && this.tabsComponent.ionViewDidEnter();
    }

    /**
     * User left the page.
     */
    ionViewDidLeave(): void {
        this.tabsComponent && this.tabsComponent.ionViewDidLeave();
    }

    /**
     * Go to search courses.
     */
    openSearch(): void {
        this.navCtrl.push('CoreCoursesSearchPage');
    }

    /**
     * Load the site name.
     */
    protected loadSiteName(): void {
        this.siteName = this.sitesProvider.getCurrentSite().getSiteName();
    }

    /**
     * Convenience function to fetch the dashboard data.
     *
     * @return Promise resolved when done.
     */
    protected loadDashboardContent(): Promise<any> {
        return this.dashboardProvider.isAvailable().then((available) => {
            if (available) {
                this.userId = this.sitesProvider.getCurrentSiteUserId();

                return this.dashboardProvider.getDashboardBlocks().then((blocks) => {
                    this.blocks = blocks;
                }).catch((error) => {
                    this.domUtils.showErrorModal(error);

                    // Cannot get the blocks, just show dashboard if needed.
                    this.loadFallbackBlocks();
                });
            } else if (!this.dashboardProvider.isDisabledInSite()) {
                // Not available, but not disabled either. Use fallback.
                this.loadFallbackBlocks();
            } else {
                // Disabled.
                this.blocks = [];
            }

        }).finally(() => {
            this.dashboardEnabled = this.blockDelegate.hasSupportedBlock(this.blocks);
            this.dashboardLoaded = true;
        });
    }

    /**
     * Refresh the dashboard data.
     *
     * @param refresher Refresher.
     */
    refreshDashboard(refresher: any): void {
        const promises = [];

        promises.push(this.dashboardProvider.invalidateDashboardBlocks());

        // Invalidate the blocks.
        this.blocksComponents.forEach((blockComponent) => {
            promises.push(blockComponent.invalidate().catch(() => {
                // Ignore errors.
            }));
        });

        Promise.all(promises).finally(() => {
            this.loadDashboardContent().finally(() => {
                refresher.complete();
            });
        });
    }

    /**
     * Refresh the dashboard data and My Courses.
     *
     * @param refresher Refresher.
     */
    refreshMyCourses(refresher: any): void {
        // First of all, refresh dashboard blocks, maybe a new block was added and now we can display the dashboard.
        this.dashboardProvider.invalidateDashboardBlocks().finally(() => {
            return this.loadDashboardContent();
        }).finally(() => {
            if (!this.dashboardEnabled) {
                // Dashboard still not enabled. Refresh my courses.
                this.mcComponent && this.mcComponent.refreshCourses(refresher);
            } else {
                this.tabsComponent.selectTab(1);
                refresher.complete();
            }
        });
    }

    /**
     * Toggle download enabled.
     */
    toggleDownload(): void {
        this.switchDownload(!this.downloadEnabled);
    }

    /**
     * Convenience function to switch download enabled.
     *
     * @param enable If enable or disable.
     */
    protected switchDownload(enable: boolean): void {
        this.downloadEnabled = (this.downloadCourseEnabled || this.downloadCoursesEnabled) && enable;
        this.downloadEnabledIcon = this.downloadEnabled ? 'checkbox-outline' : 'square-outline';
        this.eventsProvider.trigger(CoreCoursesProvider.EVENT_DASHBOARD_DOWNLOAD_ENABLED_CHANGED, {enabled: this.downloadEnabled});
    }

    /**
     * Load fallback blocks to shown before 3.6 when dashboard blocks are not supported.
     */
    protected loadFallbackBlocks(): void {
        this.blocks = [
            {
                name: 'myoverview',
                visible: true
            },
            {
                name: 'timeline',
                visible: true
            }
        ];
    }

    /**
     * Component being destroyed.
     */
    ngOnDestroy(): void {
        this.isDestroyed = true;
        this.updateSiteObserver && this.updateSiteObserver.off();
    }

    userdata() {

        this.http.get(this.params).subscribe((response) => {
            this.profile = response ;

        console.log("profile", this.profile)  ;
});
    }
 

    enrolled_course() {

        this.http.get(this.latestenrolledcourse).subscribe((response) => {
            this.enrolledcoursedata = response ; 

            console.log(response);
    });
        

    }

    levelpop() {
        this.http.get(this.levelpopup).subscribe((response) => {
            this.levelpopupdata = response ; 
            console.log(response);
    });

    }

    comprehensive() {
        this.http.get(this.comprehensivelevels).subscribe((response) => {
            this.comprehensivelevelsdata =  response;
            console.log("comprehensive", response);
            var percent = 100;
            if (this.comprehensivelevelsdata.level == 1) {
                percent = this.comprehensivelevelsdata.totalpercen / 2;
            } else if (this.comprehensivelevelsdata.level == 2) {
                percent = 50 + this.comprehensivelevelsdata.totalpercen / 2;
            }
            this.percent = percent;
            this.gettractor(percent);

        });
        
    }

    /*     Convenience function to get the tractor image depending on the percentage. */

    gettractor(percent) {

            this.progressBar = percent;
            console.log("progress bar ", this.progressBar)
            if (percent <= 16.5) {
                this.tractor = 1;
           
            } else if (percent <= 33) {
                this.tractor = 2;
              
            } else if (percent < 50) {
                this.tractor = 3;
               
            } else if (percent == 50) {
                this.tractor = 4;
               
            } else if (percent <= 66.5) {
                this.tractor = 4;
                
            } else if (percent <= 83) {
                this.tractor = 5;
                
            } else if (percent < 100) {
                this.tractor = 6;
              
            } else if (percent == 100) {
                this.tractor = 7;
             
            }

            console.log(this.tractor);
    
    
        };
 
        getprogressvalue() {

            return this.progressBar ; 
        }

        leaderboard_push() {
            
            let jsonData =  JSON.stringify(this.leaderboard);
            console.log("leaderboard pushed");
            this.navCtrl.push(LeaderboardPage, {jsonData : jsonData});
        }

        leaderboard_data(){
            this.http.get(this.ranking_get_ranking).subscribe((response) => {
                this.leaderboard = response ;
                console.log("response data now" , JSON.stringify(response));
            
               
            
            console.log("comprehensive_reward_data and api", this.leaderboard, this.leaderboard)  ;
        });
    }

        Rewards() {


            this.navCtrl.push('PrizePage');
            
        }

     
        notification() {
   
            this.navCtrl.push(AddonNotificationsListPage);
    
        }

        Target_next_level() {

            this.http.get(this.target_next_level).subscribe((response) => {
                this.targetData = response ;
             console.log("targetNextLevelData" , JSON.stringify(response));
            
        });

        console.log("Target_next_level", this.targetData)  ;

        }


        salestools() {
            
            console.log("salestool pushed");

            this.navCtrl.push(SalestoolsPage);
        
        }


}
