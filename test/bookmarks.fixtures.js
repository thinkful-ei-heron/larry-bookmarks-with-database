function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Geo Guessr',
      url: 'https://www.geoguessr.com',
      rating: 3,
      description: 'Figure out where you are in the world by looking at a street view',
    },
    {
      id: 2,
      title: 'A Good Movie To Watch',
      url: 'http://agoodmovietowatch.com',
      rating: 4,
      description: 'Random quality movie selections that are off the beaten path',
    },
    {
      id: 3,
      title: 'YouTube Time Machine',
      url: 'http://yttm.tv',
      rating: 5,
      description: 'Pick a year and watch every available clip from that year on Youtube',
    }
  ];
}

module.exports = {
  makeBookmarksArray,
}
