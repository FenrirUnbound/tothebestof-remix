'use strict';

const client = require('./lastfm-client');

function searchForImage(images) {
  const comparisonScore = {
    extralarge: 10,
    large: 9,
    mega: 8,
    medium: 7,
    small: 5
  };

  // sort from most desired to least
  images.sort((a, b) => {
    const valA = comparisonScore[a.size] || 1;
    const valB = comparisonScore[b.size] || 1;

    return valB - valA;
  });

  return images[0]['#text'];
}

module.exports = (request, reply) => {
  const { artistName } = request.params;

  return client.getArtist(artistName)
  .then(artistInfo =>
    reply({
      data: {
        bio: artistInfo.bio.summary,
        link: artistInfo.url,
        name: artistInfo.name,
        image: searchForImage(artistInfo.image)
      }
    })
  ).catch(err => reply(err));  // TODO: redirect to search
}
