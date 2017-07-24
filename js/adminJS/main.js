var viewModel = {
    users: ko.observableArray([]),
    selectedArticles: ko.observable(null),
    title: ko.observable(null),
    articles: ko.observableArray([]),
    totalPages: ko.observable(),
    currentPage: ko.observable(1),
    formEditArticles: ko.observableArray([]),
    selectedUser: ko.observable(null),
    authorIDE: ko.observable("20CD6BE6-E533-FFA4-2DFB-D0AF3D7F64BB"),
    loadPreviews: function () {
        $.getJSON("/api/users/" + viewModel.currentPage() + "/20")
            .done(function (articles) {
                viewModel.users(articles.data)
            })
    },
    editUserArticles: function (thisUser) {
            loadArticles(thisUser.id)

    },
    removeArticles: function (user) {
        getDeleteArticles(user.authorID,user.id,"delete");
        loadArticles(user.authorID);
        toastr.success("Статтю під назвою:"+user.title+",блогера- "+user.authorFullName+" видалено")
    },
    editArticles: function(articles){
        getDeleteArticles(articles.authorID,articles.id,"get");
        viewModel.formEditArticles(articles.data);
        viewModel.selectedArticles(articles);
        viewModel.authorIDE(articles.authorID);
        viewModel.title(articles.title)
    },
    handleSaveArticles: function(articles){
        var type = viewModel.title(null)? "post" : "put";
        $.ajax({
            url: "/api/users/"+viewModel.authorIDE()+"/articles",
             type: type,
            contentType: "application/json",
            data: JSON.stringify(viewModel.selectedArticles())
        })
            .done(function(){
                toastr.success("User saved");
                viewModel.loadPreviews();
                viewModel.selectedUser(articles);
                viewModel.selectedArticles(null);

            })

    },
    goBackPage: function(user){
   viewModel.selectedUser(user);
   viewModel.selectedArticles(null)
    },
    postArticles: function(postArt){
        viewModel.selectedArticles(clearForm());
        viewModel.authorIDE(null);
        viewModel.selectedUser(postArt);
        viewModel.authorIDE(postArt.authorID);
    }

};
function clearForm(){
    return {
        "id" :"",
        "title": "",
        "content": "",
        "shortContent": "",
        "thumbnail": ""
    };

}
function loadArticles(object) {
    $.getJSON("/api/users/" + object + "/articles/1/10")
        .done(function (articles) {
            viewModel.articles(articles.data);
            viewModel.selectedUser(articles);
        })
}
        function getDeleteArticles(author,articlesID,type){
            $.ajax({
                url: "/api/users/" + author + "/articles/" + articlesID,
                type: type
            });
        }
viewModel.loadPreviews();
ko.applyBindings(viewModel);