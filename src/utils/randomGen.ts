import { map, shuffle } from 'lodash';

export const getRandomUserIds = async (userIds: string[], n: number) => {
  let res: { [key: string]: string[] } = {};

  while (map(res).flat().length !== userIds.length * n) {
    const items = userIds.flatMap((userId) => Array(n).fill(userId));

    res = userIds.reduce((acc, userId) => {
      const otherUserIds = items.filter((id) => id !== userId);
      const uniqueOtherUserIds = shuffle(otherUserIds).filter(
        (value, index, self) => self.indexOf(value) === index
      );
      const randomUserIds = uniqueOtherUserIds.slice(0, n);
      randomUserIds.forEach((id) => {
        const index = items.indexOf(id);
        if (index > -1) {
          items.splice(index, 1);
        }
      });
      acc[userId] = randomUserIds;
      return acc;
    }, {} as { [key: string]: string[] });
  }

  return res;
};