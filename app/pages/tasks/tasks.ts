import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, PopoverController } from 'ionic-angular';
import { Keyboard, StatusBar } from 'ionic-native';

import { OptionsPopover } from './options-popover/options-popover';

import { SyncService } from '../../providers/sync';

import { ItemsService } from '../../providers/items';

@Component({
  templateUrl: 'build/pages/tasks/tasks.html'
})
export class TasksPage {
  sub: any;
  newtasktext: string = '';
  addingtask: Boolean = false;
  showaddingtask: Boolean = false;
  searching: Boolean = false;
  searchinput: any;
  searchtext: string = '';
  newtaskinput: any;
  items: any[] = [];

  constructor(
    private ref: ChangeDetectorRef,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private syncService: SyncService,
    private itemsService: ItemsService
  ) {
    this.items = this.itemsService.getInboxItems();
  }

  ionViewDidEnter() {
    this.newtaskinput = document.querySelector('ion-input[name="newtask"] input');
    this.searchinput = document.querySelector('ion-searchbar input');
    this.syncService.syncAll().subscribe(res => {
      this.items = this.itemsService.getInboxItems();
    }, err => {});
  }

  openSettings(event) {
    let popover = this.popoverCtrl.create(OptionsPopover);
    popover.present({ev: event});
  }


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  goToSearch(event) {

  }

  addTask(event) {
    this.showInput();
    this.addingtask = true;
    StatusBar.backgroundColorByHexString('#f4f4f4');
    Keyboard.onKeyboardHide()
    .subscribe(() => {
      if (this.addingtask) {
        this.closeInput();
      }
    });
  }

  showInput() {
    this.newtaskinput['focus']();
    Keyboard.onKeyboardShow()
    .subscribe(() => {
      if (this.addingtask) {
        this.showaddingtask = true;
        this.ref.detectChanges();
      }
    });
    if (Keyboard['installed']() === false) {
      this.showaddingtask = true;
    }
  }

  closeInput(event?) {
    this.addingtask = false;
    this.showaddingtask = false;
    StatusBar.backgroundColorByHexString('#c33433');
    this.ref.detectChanges();
    return false;
  }

  addNewTask(event) {
    this.newtasktext = '';
    // Add Task
    return false;
  }

  openSearch(event) {
    this.searching = true;
    setTimeout(() => {
      this.searchinput['focus']();
    }, 0);
    StatusBar.backgroundColorByHexString('#f4f4f4');
    this.sub = this.platform.registerBackButtonAction(() => {
      this.onSearchCancel(event);
    });
  }

  onSearchInput(event) {
    console.log(this.searchtext);
  }

  onSearchCancel(event) {
    this.searching = false;
    this.searchtext = '';
    this.sub();
    StatusBar.backgroundColorByHexString('#c33433');
  }

  onSearchFocus(event) {
    Keyboard.show();
  }
}
