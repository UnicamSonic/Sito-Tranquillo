// Definizione del modulo 'home'
angular.module('home', [
    'ui.router'
]);

// Registra il componente 'home' sul modulo 'home
angular.module('home').component('home', {
    templateUrl: 'layout/frontend/home/home.template.html',
    controller: function($scope, $http, $location, $window) {
        var listaProva = this;
        listaProva.ordinamento = 'nome';

        $http.get('api/v1.0/prodotti').then(function(response) {
            listaProva.prodotti = response.data;
        });

        //Funzione per chiudere e riaprire la sidebar nella home page
        $scope.IsVisible = true;
        $scope.ShowHide = function() {
            //Se la sidebar è visibile allora verrà chiusa e viceversa
            if ($scope.IsVisible == true) {
                $scope.IsVisible = false;
            } else {
                $scope.IsVisible = true;
            }
        }

        listaProva.mettiNelCarrello = function(idprodotto){
            $http({
                method: 'POST',
                url: '/api/v1.0/utenti/aggiungialcarrello',
                data: { 'token': $window.localStorage.getItem("jwtToken"), 'prodotto':idprodotto,'quantita':1 }
            }).then(function successCallback(response){
                if(response.data.successo == true){
                    $location.path('/carrello');
                } else {
                    alert('Impossibile aggiungere al carrello');
                    
                }
                
            }).catch(function errorCallback(response){
                alert('Impossibile aggiungere al carrello.Effettua il login se non lo hai fatto, altrimenti controlla di non avere superato il numero di oggetti massimi');
            });
        };
    }
});