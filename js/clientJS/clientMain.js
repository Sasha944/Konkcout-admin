var viewModel = {
    articles: ko.observableArray([]),
totalPages: ko.observable(),
currentPage: ko.observable(1),
selectedArticles: ko.observable(null),
clickArticles: function(articlesClick){
$.getJSON("/api/users/"+articlesClick.authorID+"/articles/"+articlesClick.id)
    .done(function(articles){
    viewModel.selectedArticles(articles);
    $("body").css("background","silver");
    })
},
loadPreviews: function(){
$.getJSON("/api/articles/"+ viewModel.currentPage()+"/10")
    .done(function(responce){
        viewModel.articles(responce.data);
        viewModel.totalPages(responce.totalPages);
    })
},
    pageNumbers: ko.pureComputed(function(){
var pageNumbers = [];
for(var i=1;i<=viewModel.totalPages();i++){
pageNumbers.push(i)
}
return pageNumbers;
    }),
    nextPage: function(pages){
    viewModel.currentPage(pages);
    viewModel.loadPreviews();
    },
    goToPrevPage: function(){
if(viewModel.currentPage()===1){
    return;
}
viewModel.nextPage(viewModel.currentPage()-1)
    },
    goToNextPage: function(){
        if(viewModel.currentPage()===viewModel.totalPages()){
            return;
        }
        viewModel.nextPage(viewModel.currentPage()+1)
    }
};
viewModel.loadPreviews();
ko.applyBindings(viewModel);