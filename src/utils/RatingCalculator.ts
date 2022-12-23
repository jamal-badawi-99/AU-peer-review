export const ratingCalculator = (ratArr: number[] | undefined) => {
  const hosRating = ratArr ?? [];
  if (hosRating.length > 0) {
    return hosRating.reduce((a, b) => a + b, 0) / hosRating.length;
  } else {
    return 0;
  }
};
