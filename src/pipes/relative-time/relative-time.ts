import { Pipe, PipeTransform } from "@angular/core";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
/* npm install date-fns --save */
@Pipe({
  name: "relativeTime"
})
export class RelativeTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return distanceInWordsToNow(new Date(value), { addSuffix: true });
  }
}
