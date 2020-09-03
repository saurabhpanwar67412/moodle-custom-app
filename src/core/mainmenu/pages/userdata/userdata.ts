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

/**
 * Generated class for the UserdataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({segment: 'core-mainmenu-userdata'})
@Component({
  selector: 'page-core-mainmenu-userdata',
  templateUrl: 'userdata.html',
})
export class UserdataPage {
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

  constructor(logger: CoreLoggerProvider, private pushNotificationsProvider: CorePushNotificationsProvider, private menuDelegate: CoreMainMenuDelegate, private sitesProvider: CoreSitesProvider,
    private navCtrl: NavController, private mainMenuProvider: CoreMainMenuProvider,
    eventsProvider: CoreEventsProvider, private loginHelper: CoreLoginHelperProvider,
    private filterProvider: CoreFilterProvider, private domUtils: CoreDomUtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserdataPage');
  }

}
