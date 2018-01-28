(function(angular) {
    angular.module('ngGitIssues', [])
    .controller('gitIssuesController', function($scope, $http) {
    var apiUrl = "https://api.github.com/repos/nodejs/node/issues"


    //TODO: Try Regex
    //TestCase : <https://api.github.com/repositories/27193779/issues?page=2>; rel="next", <https://api.github.com/repositories/27193779/issues?page=27>; rel="last"
    gextPageAndLastPage = function(linkHeader){
      try{
        var listUni = linkHeader.split("issues?page="),
            nextPage = parseInt( listUni[1].split(">")[0] ),
            lastPage = parseInt( listUni[2].split(">")[0] );

        return {
          "nextPage": nextPage,
          "lastPage": lastPage
        }
      }catch(e){
        console.error(e)
        return {
          "nextPage": 0,
          "lastPage": 0
        }
      }
    }

    $scope.navigateTo = function(pageNum){

      if($scope.model.page == pageNum) return

      // -1 for array index
      this.issueEndNum = (pageNum * 25) - 1;
      this.issueStartNum = this.issueEndNum - 25;
      var mainList = $scope.model.mainList;
      $scope.model.page = pageNum;

      if(mainList[this.issueStartNum] && mainList[this.issueEndNum]){
        $scope.model.issues =  mainList[this.issueStartNum, 25]
        return
      }

      var fromGithubPage = Math.floor(this.issueEndNum/30)

      if(!mainList[this.issueEndNum]){
        makeApiCall(fromGithubPage + 1, $scope)
      }

      if(!mainList[this.issueStartNum]){
        makeApiCall(fromGithubPage, $scope)
      }

      console.log("pageNum : ",pageNum)
      //console.log("issueRange : ",issueRange)

    }

    $scope.handleResponse = function(apiResponse, fromGithubPageNum){
      var mainList = $scope.model.mainList, i,
          mainListIndexStart = fromGithubPageNum * 30;

      for (i = 0; i < apiResponse.length; i++) {
         mainListIndex = mainListIndexStart + i;
         mainList[mainListIndex] = apiResponse[i];
      };

      $scope.model.mainList = mainList;
      $scope.model.issues = mainList[this.issueStartNum, 25]

      console.log("apiResponse : ",apiResponse)
      console.log("fromGithubPage : ",fromGithubPage)
    }

    makeApiCall = function(fromGithubPage, $scope){
      $http.get(apiUrl + "?page=" + fromGithubPage)
      .then(function(response) {
          $scope.handleResponse(response, fromGithubPage)
      })
      .catch(function(){
          $scope.model = {
            isApiError : true
          }
      });
    }

    developPagination = function(lastPage, scope){
      var maxPossibleIssues = lastPage * 30, i, pager = [];
      var totalPaginations = Math.floor(maxPossibleIssues / 25) + 1;
      console.log("lastPage : ", lastPage)

      //inflate array
      for(i=0 ; i<=totalPaginations ; i++) pager[i] = i+1

      //set model
      $scope.model.pager = pager
      return $scope
    }

    $scope.populateModel = function(linkHeader){
      nextNLastPage = gextPageAndLastPage(linkHeader)
      developPagination(nextNLastPage.lastPage, $scope)
    }


    $scope.init = function() {
      $http.get(apiUrl)
      .then(function(response) {
          $scope.model = {
            page : 1,
            pager : [],
            isError : false,
            isApiError : false,
            mainList : response.data,
            issues : response.data.slice(0,25),
          }
          $scope.populateModel(response.headers('Link'))
      }).catch(function(){
          $scope.model = {
            isError : true
          }
      });

    };

    $scope.init();
  });
  })(window.angular);
