var hawkApp = (function(publicMethods) {

    this.config = {
        apiVersion : "v1",
        models : [],
        collections : [],
        modelViews : [],
        interval : 5
    };

    publicMethods.initialLoad = function(){

        var ScoreModel = Backbone.Model.extend({
            urlRoot: '/api/v1/hawkScores'
        });

        var scoreModel = new ScoreModel;

        scoreModel.fetch();

        config.models['scoreModel'] = scoreModel;

        var ScoreView = React.createClass({

            getInitialState: function() {
                return {hawkScoreData: config.models['scoreModel'].attributes};
            },
            updateConfig : function() {
                console.log("react watch config");
                this.setState({hawkScoreData : config.models['scoreModel'].attributes})
            },
            componentDidMount: function() {
                this.interval = setInterval(this.updateConfig, config.interval * 1000);
            },
            componentWillUnmount: function() {
                clearInterval(this.interval);
            },
            render : function() {
                return (
                    <div className="center">
                        <p> The next game is on {this.state.hawkScoreData.day} at {this.state.hawkScoreData.time}</p>
                        <p> Seahawks : {this.state.hawkScoreData.seahawkScore} </p>
                        <p> {this.state.hawkScoreData.enemyName} : {this.state.hawkScoreData.enemyScore} </p>
                    </div>
                );
            }
        });

        React.render(
            <ScoreView />,
            document.getElementById('app-mount')
        );

    };

    publicMethods.refreshScore = function() {
        //
        config.models['scoreModel'].fetch;

        var currentModel = config.models['scoreModel'].attributes,
            localBodyCopy = $('body'),
            classToAdd;

        localBodyCopy.removeClass();

        if(currentModel.seahawkScore < currentModel.enemyScore){
            classToAdd = "hawksWinning";
        } else if(currentModel.seahawkScore > currentModel.enemyScore){
            classToAdd = "hawksLosing";
        } else {
            classToAdd = "tie";
        }

        localBodyCopy.addClass(classToAdd);
    };

    publicMethods.watchForChanges = function() {

        self = this;
        setInterval(function(){
            self.refreshScore();}
        , config.interval * 1000);

    };

    publicMethods.onPageReady = function() {

        self = this;
        $(function(){
            //
            self.initialLoad();
            self.watchForChanges();
        });

    };

    publicMethods.init = function(){

        this.onPageReady();

    };

    return publicMethods;

})(hawkApp || {});



window.hawkApp = hawkApp;
window.hawkApp.init();