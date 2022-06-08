import { Component, OnInit } from '@angular/core';
import {item} from '../item';
import {ITEMS} from '../mock-items';
import { ItemService } from '../item.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  selectedItem?: item;

  items: item[] = [];

  constructor(private itemService: ItemService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getItems();
  }

  onSelect(item: item): void {
    this.selectedItem = item;
    this.messageService.add(`itemesComponent: Selected item id=${item.id}`);
  }

  getItems(): void {
    this.itemService.getitems()
        .subscribe(items => this.items = items);
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.itemService.additem({ name } as item)
      .subscribe(item => {
        this.items.push(item);
      });
  }

  delete(item: item): void {
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteitem(item.id).subscribe();
  }
}
