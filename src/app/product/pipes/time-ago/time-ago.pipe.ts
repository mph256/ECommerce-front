import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  timeDiff = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  };

  transform(value: Date | string): string {

    const now = Date.now();
    const then = new Date(value).getTime();
    const diff = now - then;

    if(diff < this.timeDiff.minute)
      return 'A few seconds ago';
    else if(diff < this.timeDiff.hour)
      return 'A few minutes ago';
    else if(diff < this.timeDiff.day)
      return 'A few hours ago';
    else if(diff < this.timeDiff.week)
      return 'A few days ago';
    else if(diff < this.timeDiff.month)
      return 'A few weeks ago';
    else if(diff < this.timeDiff.year)
      return 'A few months ago';
    else
      return 'More than a year ago';

  }

}
