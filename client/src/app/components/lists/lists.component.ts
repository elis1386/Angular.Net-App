import { Component, inject } from '@angular/core';
import { LikesService } from '../../services/likes.service';
import { Member } from '../../models/member';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from '../member/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, ButtonsModule, MemberCardComponent, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent {
  likeService = inject(LikesService);
  memberService = inject(MembersService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadLikes();
  }
  getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Members who like you';
      default:
        return 'Mutual';
    }
  }

  loadLikes() {
    this.likeService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  pageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
  ngOnDestroy() {
    this.likeService.paginatedResult.set(null);
  }
}
