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

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: 'https://www.hackers.com',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1,
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}


module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark,
}
