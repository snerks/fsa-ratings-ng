export const formatRatingValue = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  }

  if (value === 'AwaitingInspection') {
    return 'Awaiting Inspection';
  }

  return value;
};
