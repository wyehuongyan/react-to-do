var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var Header = require('./header');
var List = require('./list');
var rootUrl = 'https://vivid-inferno-1060.firebaseio.com/';

var App = React.createClass({
	mixins: [ ReactFire ],
    getInitialState: function() {
        return {
            items: {},
            loaded: false
        }
    },
	componentWillMount: function() {
        this.fb = new Firebase(rootUrl + 'items/');
		this.bindAsObject(this.fb, 'items');
		// this.firebaseRefs.items will be set after binding (direct firebase reference)
        // also, this.state.items is set to to the firebase items. (but no creation permissions)

        this.fb.on('value', this.handleDataLoaded); // on method allows us to listen to firebase events
	},
  	render: function() {
		return <div className="row panel panel-default">
			<div className="col-md-8 col-md-offset-2">
				<h2 className="text-center">
					To-Do List
				</h2>
				<Header itemsStore={this.firebaseRefs.items} />
                <hr />
                <div className={"content " + (this.state.loaded ? 'loaded' : '')}>
                    <List items={this.state.items} />
                    {this.deleteButton()}
                </div>
			</div>
		</div>
	},
    deleteButton: function() {
        if(!this.state.loaded) {
            return
        } else {
            return <div className="text-center clear-complete">
                <hr />
                <button
                    type="button"
                    onClick={this.onDeleteDoneClick}
                    className="btn btn-default">
                    Clear Complete
                </button>
            </div>
        }
    },
    onDeleteDoneClick: function() {
        // loop through to find 'done' events in firebase datastore
        for(var key in this.state.items) {
            if(this.state.items[key].done === true) {
                this.fb.child(key).remove();
            }
        }
    },
    handleDataLoaded: function() {
        this.setState({loaded: true}); // firebase data has been loaded
    }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('.container'));
