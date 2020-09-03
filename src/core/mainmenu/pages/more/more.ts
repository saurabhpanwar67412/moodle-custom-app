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

import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider, CoreSiteBasicInfo } from '@providers/sites';
import { CoreMainMenuDelegate, CoreMainMenuHandlerData } from '../../providers/delegate';
import { CoreMainMenuProvider, CoreMainMenuCustomItem } from '../../providers/mainmenu';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
import { CoreFilterProvider } from '@core/filter/providers/filter';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreLoggerProvider } from '@providers/logger';
import { CorePushNotificationsProvider } from '@core/pushnotifications/providers/pushnotifications';
import {SalestoolsPage} from '@addon/salestools/salestools';


/**
 * Page that displays the list of main menu options that aren't in the tabs.
 */
@IonicPage({segment: 'core-mainmenu-more'})
@Component({
    selector: 'page-core-mainmenu-more',
    templateUrl: 'more.html',
})
export class CoreMainMenuMorePage implements OnDestroy {
    sites: CoreSiteBasicInfo[];
    handlers: CoreMainMenuHandlerData[];
    allHandlers: CoreMainMenuHandlerData[];
    handlersLoaded: boolean;
    siteInfo: any;
    siteName: string;
    logoutLabel: string;
    showWeb: boolean;
    showHelp: boolean;
    docsUrl: string;
    customItems: CoreMainMenuCustomItem[];
    siteUrl: string;
    showDelete: boolean;
    protected logger;




    

    protected subscription;
    protected langObserver;
    protected updateSiteObserver;

    constructor( logger: CoreLoggerProvider, private pushNotificationsProvider: CorePushNotificationsProvider, private menuDelegate: CoreMainMenuDelegate, private sitesProvider: CoreSitesProvider,
            private navCtrl: NavController, private mainMenuProvider: CoreMainMenuProvider,
            eventsProvider: CoreEventsProvider, private loginHelper: CoreLoginHelperProvider,
            private filterProvider: CoreFilterProvider, private domUtils: CoreDomUtilsProvider,) {

        this.langObserver = eventsProvider.on(CoreEventsProvider.LANGUAGE_CHANGED, this.loadSiteInfo.bind(this));
        this.updateSiteObserver = eventsProvider.on(CoreEventsProvider.SITE_UPDATED, this.loadSiteInfo.bind(this),
            sitesProvider.getCurrentSiteId());
        this.loadSiteInfo();
    }

    /**
     * View loaded.
     */
    ionViewDidLoad(): void {

        this.sitesProvider.getSortedSites().then((sites) => {
            if (sites.length == 0) {
                this.loginHelper.goToAddSite(true);
            }

            // Remove protocol from the url to show more url text.
            this.sites = sites.map((site) => {
                site.siteUrl = site.siteUrl.replace(/^https?:\/\//, '');
                site.badge = 0;
                this.pushNotificationsProvider.getSiteCounter(site.id).then((counter) => {
                    site.badge = counter;
                });

                return site;
            });

            this.showDelete = false;
        }).catch(() => {
            // Shouldn't happen.
        });
        // Load the handlers.
        this.subscription = this.menuDelegate.getHandlers().subscribe((handlers) => {
            this.allHandlers = handlers;

            this.initHandlers();
        });

        window.addEventListener('resize', this.initHandlers.bind(this));
    }

    /**
     * Page destroyed.
     */
    ngOnDestroy(): void {
        window.removeEventListener('resize', this.initHandlers.bind(this));
        this.langObserver && this.langObserver.off();
        this.updateSiteObserver && this.updateSiteObserver.off();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Init handlers on change (size or handlers).
     */
    initHandlers(): void {
        if (this.allHandlers) {
            // Calculate the main handlers not to display them in this view.
            const mainHandlers = this.allHandlers.filter((handler) => {
                return !handler.onlyInMore;
            }).slice(0, this.mainMenuProvider.getNumItems());

            // Get only the handlers that don't appear in the main view.
            this.handlers = this.allHandlers.filter((handler) => {
                return mainHandlers.indexOf(handler) == -1;
            });

            this.handlersLoaded = this.menuDelegate.areHandlersLoaded();
        }
    }

    /**
     * Load the site info required by the view.
     */
    protected loadSiteInfo(): void {
        const currentSite = this.sitesProvider.getCurrentSite();

        this.siteInfo = currentSite.getInfo();
        this.siteName = currentSite.getSiteName();
        this.siteUrl = currentSite.getURL();
        this.logoutLabel = this.loginHelper.getLogoutLabel(currentSite);
        this.showWeb = !currentSite.isFeatureDisabled('CoreMainMenuDelegate_website');
        this.showHelp = !currentSite.isFeatureDisabled('CoreMainMenuDelegate_help');

        currentSite.getDocsUrl().then((docsUrl) => {
            this.docsUrl = docsUrl;
        });

        this.mainMenuProvider.getCustomMenuItems().then((items) => {
            this.customItems = items;
        });
    }

    /**
     * Open a handler.
     *
     * @param handler Handler to open.
     */
    openHandler(handler: CoreMainMenuHandlerData): void {
        this.navCtrl.push(handler.page, handler.pageParams);
    }

    /**
     * Open an embedded custom item.
     *
     * @param item Item to open.
     */
    openItem(item: CoreMainMenuCustomItem): void {
        this.navCtrl.push('CoreViewerIframePage', {title: item.label, url: item.url});
    }

    /**
     * Open app settings page.
     */
    openAppSettings(): void {
        this.navCtrl.push('CoreAppSettingsPage');
    }

    /**
     * Open site settings page.
     */
    openSitePreferences(): void {
        this.navCtrl.push('CoreSitePreferencesPage');
    }

    /**
     * Logout the user.
     */
    logout(): void {
        this.sitesProvider.logout();
        debugger ; 
        this.loginHelper.goToSiteInitialPage(this.navCtrl);
  
        // this.navCtrl.push('CoreLoginCredentialsPage');
 
    }

      /**
     * Delete a site.
     *
     * @param e Click event.
     * @param index Position of the site.
     */
    deleteSite(e: Event, index: number): void {
 
        e.stopPropagation();

        console.log("e => and index " , e , index);
        

        const site = this.sites[index],
            siteName = site.siteName;

        this.filterProvider.formatText(siteName, {clean: true, singleLine: true, filter: false}, [], site.id).then((siteName) => {
       
            this.domUtils.showDeleteConfirm('core.login.confirmdeletesite', { sitename: siteName }).then(() => {
                this.sitesProvider.deleteSite(site.id).then(() => {
                    this.sites.splice(index, 1);
                    this.showDelete = false;
       
                    // If there are no sites left, go to add site.
                    this.sitesProvider.hasSites().then((hasSites) => {
                        if (!hasSites) {
                            this.loginHelper.goToAddSite(true, true);
                        }
                    });
                }).catch((error) => {
                    this.logger.error('Error deleting site ' + site.id, error);
                    this.domUtils.showErrorModalDefault(error, 'Delete site failed.');
                    this.domUtils.showErrorModal('core.login.errordeletesite', true);
                });
            }).catch(() => {
                // User cancelled, nothing to do.
            });
        });

    }

    /**
     * Login in a site.
     *
     * @param siteId The site ID.
     */
    login(siteId: string): void {
        const modal = this.domUtils.showModalLoading();

        this.sitesProvider.loadSite(siteId).then((loggedIn) => {
            if (loggedIn) {
                return this.loginHelper.goToSiteInitialPage();
            }
        }).catch((error) => {
            this.logger.error('Error loading site ' + siteId, error);
            this.domUtils.showErrorModalDefault(error, 'Error loading site.');
        }).finally(() => {
            modal.dismiss();
        });
    }

    /**
     * Toggle delete.
     */
    toggleDelete(): void {
        this.showDelete = !this.showDelete;
    }

    opensalestool() {
        this.navCtrl.push('SalestoolsPage');

    }

    
}
