var viewModel = {
    users: ko.observableArray([]),
    selectedUser: ko.observable(null),
    currentPage: ko.observable(1),
    authorIde: ko.observable(null),
    totalPages: ko.observable(),
    pageNumbers: ko.pureComputed(function(){
        var pageNumbers=[];

        for(var i =1;i<=viewModel.totalPages(); i++){
             pageNumbers.push(i);
        }
        return pageNumbers;
    }),
    countries: ko.observableArray([]),
    loadPreviews: function () {
        $.getJSON("/api/users/" + viewModel.currentPage() + "/10/preview")
            .done(function (response) {
                viewModel.totalPages (response.totalPages);
                viewModel.users(response.data);
            });
    },
    editUser: function(userToEdit){
        $.getJSON("/api/users/" + userToEdit.id)
            .done(function(user){
                viewModel.selectedUser(user);
                viewModel.authorIde(user.id)
            });
    },
    removeSelectedUser: ko.pureComputed(function(){
        return viewModel.selectedUser()&&viewModel.selectedUser().id
    }),
    deleteUser: function() {
        $.ajax({
            url: "/api/users/"+ viewModel.selectedUser().id,
            type: "delete",
            success: function () {
                viewModel.users.remove(viewModel.selectedUser());
                viewModel.loadPreviews();
                viewModel.selectedUser(null);
                toastr.success("User delete")
            }
        })
    }
        ,
    loadCountries: function(){
        $.getJSON("/api/countries")
            .done(function(c){
                viewModel.countries(c)
            })
    },
    handleSaveUser: function(){
        var type = viewModel.selectedUser().id? "put" : "post";
        $.ajax({
            url: viewModel.selectedUser().id? "/api/users/": "/api/users/",
            type: type,
            data: JSON.stringify(viewModel.selectedUser().authorID),
            contentType: "application/json"
        }).done(function(savedData){
            viewModel.loadPreviews();
            viewModel.editUser(savedData);
            toastr.success("User are saved","SUCCESS")
        })
    },
    goToPrevPage: function(){
        if(viewModel.currentPage()<=1){
            return;
        }

        viewModel.goToPage(viewModel.currentPage() - 1);
    },
    goToNextPage: function(){
        if(viewModel.currentPage() >= viewModel.totalPages()){
            return;
        }
        viewModel.goToPage(viewModel.currentPage() +1);
    },
    goToPage: function (pageNum){
       viewModel.currentPage(pageNum);
        viewModel.loadPreviews();
    },
    addNewUser: function(){
        viewModel.selectedUser(viewModel.clearForm());
        $("#save").text("Save");
    },
    clearForm: function(){
        return {
            "id": "",
            "fullName": "",
            "email": "",
            "birthday": "",
            "profession": "",
            "address": "",
            "country": "",
            "shortInfo": "",
            "fullInfo": "",
            "photo": ""
        }
    },
    cancelForm: function(){
      viewModel.selectedUser(null);
    }
    };

viewModel.loadCountries();
viewModel.loadPreviews();
ko.applyBindings(viewModel);