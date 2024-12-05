import * as iuliia from "iuliia";

export const trans = (text: string) => {
  return iuliia.translate(text.toLowerCase(), iuliia.MOSMETRO);
};
