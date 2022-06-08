import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: [ './item-detail.component.scss' ]
})
export class ItemDetailComponent implements OnInit {
  item: item | undefined;

  constructor(
    private route: ActivatedRoute,
    private ItemService: ItemService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getitem();
  }

  getitem(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.ItemService.getitem(id)
      .subscribe(item => this.item = item);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.item) {
      this.ItemService.updateitem(this.item)
        .subscribe(() => this.goBack());
    }
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/