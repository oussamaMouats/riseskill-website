import { Injectable, Optional, PipeTransform } from "@nestjs/common";

@Injectable()
export class OptionalParseIntPipe implements PipeTransform<string | undefined, number | undefined> {
  constructor(@Optional() private readonly defaultValue?: number) {}

  transform(value: string | undefined): number | undefined {
    if (value === undefined || value === "") {
      return this.defaultValue;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? this.defaultValue : parsed;
  }
}
