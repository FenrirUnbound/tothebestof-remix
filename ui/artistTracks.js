'use strict';

const MAX_TRACKS = 10;

function getArtist($http, artist) {
  return $http({
    method: 'GET',
    url: `/api/artists/${artist}`
  }).then(response => Promise.resolve(response.data.data));
}

function getTopTracks($http, artist) {
  return $http({
    method: 'GET',
    url: `/api/artists/${artist}/tracks`
  }).then(response => Promise.resolve(response.data.data.slice(0, MAX_TRACKS)));
}

function createVid($scope, artistName, videoIds) {
  // sigh. this is expensive AF
  $('#videoPort').replaceWith('<div id="videoPort"></div>');

  return new Promise((resolve) => {
    const first = videoIds.shift();
    const player = new YT.Player('videoPort', {
      height: '349',
      width: '560',
      playerVars: {
        playlist: videoIds.join(',')
      },
      videoId: first,
      events: {
        onReady: () => resolve()
      }
    });
  });
}

function getVideos($http, artist, tracks) {
  const request = ($http, artist, track) => {
    return $http({
      method: 'GET',
      url: encodeURI(`/api/artists/${artist}/videos/${track}`)
    });
  };

  const videoRequests = tracks.map((track) => request($http, artist, track.name));

  return Promise.all(videoRequests).then(results =>
    results.map((video) => video.data.data.id.videoId)
  );
}

function ArtistTracksController ($scope, $http, $routeParams) {
  $scope.loading = true;

  const artistName = $routeParams.artistName;

  const fetchArtistInfo = getArtist($http, artistName);
  const fetchTopTracks = getTopTracks($http, artistName);
  const fetchVideoIds = fetchTopTracks
    .then(topTracks => getVideos($http, artistName, topTracks));

  return Promise.all([
    fetchArtistInfo,
    fetchTopTracks,
    fetchVideoIds
  ]).then(([ artistInfo, topTracks, videoIds ]) => {
    $scope.artist = artistInfo;

    const maxPopularity = topTracks[0].listeners;
    $scope.topTracks = topTracks.map((track, index) => {
      return {
        name: track.name,
        popularity: track.listeners / maxPopularity * 100,
        videoId: videoIds[index]
      };
    });


    const title = `To The Best Of - ${artistName}`;
    const playlist = videoIds.join(',');
    const ytPlaylist = `https://www.youtube.com/watch_videos?video_ids=${playlist}&title=${title}`;
    $scope.ytPlaylist = ytPlaylist;
    console.log(ytPlaylist);

    //spotify stuff
    localStorage.setItem('artistName', encodeURIComponent(artistName));
    localStorage.setItem('tracks', topTracks.map(track => encodeURIComponent(track.name)).join(','));

    const clientId = encodeURIComponent('4bc5535d9ef24a01ab7879eaa2ad78e0');
    const scope = encodeURIComponent('playlist-modify-private');
    const redirectUri = encodeURIComponent('http://localhost:8080/spotify');
    $scope.spotPlaylist = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    console.log($scope.spotPlaylist);

    return createVid($scope, artistName, videoIds);
  }).then(() => {
    $scope.loading = false;

    $scope.$apply();
  });
}

module.exports = ['$scope', '$http', '$routeParams', ArtistTracksController];
