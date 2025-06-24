import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-bar',
  standalone: false,
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent {
  @Input() isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
