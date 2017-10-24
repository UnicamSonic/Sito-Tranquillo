// Definizione del modulo 'utente'
angular.module('utente', [
    'ui.router',
    'ngMessages'
]);

// Registra il componente 'utente' sul modulo 'utente'
angular.module('utente').component('utente', {
    templateUrl: 'layout/frontend/utente/utente.template.html',
    controller: function($scope, $http, $window, $stateParams) {
        var ctrl = this;
        var id = $stateParams.id;
        var utenteOrig;
        $http.post('api/v1.0/utenti/get', { token: $window.localStorage.getItem("jwtToken") }).then(function(response) {
            ctrl.utente = response.data;
            console.log(ctrl.utente);
            delete ctrl.utente._id;
            utenteOrig = angular.copy(ctrl.utente);
        });
        ctrl.reset = function() {
            ctrl.utente = angular.copy(utenteOrig);
        };
        ctrl.aggiornaUtente = function() {
            ctrl.utente.token = $window.localStorage.getItem("jwtToken");
            $http.put('api/v1.0/utenti/aggiorna/' + id, ctrl.utente).then(
                function(res) {
                    $location.path('');
                },
                function(err) {
                    console.log('errore!\n', err.data);
                }
            )
        };
    }
});