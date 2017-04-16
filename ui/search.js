'use strict';

function initialCriteria(path) {
  if (!path) {
    return '';
  }

  const parts = path.split('/');

  if (parts.length < 2) {
    return '';
  }

  return parts.pop();
}

function SearchController($scope, $sanitize, $location) {
  $scope.searchText = initialCriteria($location.path());

  $scope.search = () => {
    const artistName = $sanitize($scope.searchText);

    if (!artistName) { return; }

    $location.path(`/artists/${artistName}`);
  };
}

module.exports = ['$scope', '$sanitize', '$location', SearchController];
