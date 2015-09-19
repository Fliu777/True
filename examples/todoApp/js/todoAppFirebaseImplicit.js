/** @jsx React.DOM */
var TodoList3 = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});

var TodoApp3 = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      items: [],
      text: ''
    };
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase('https://jumpp.firebaseio.com/business/Active Orders');
    var ref = new Firebase("https://jumpp.firebaseio.com");
    this.bindAsArray(firebaseRef, 'items');
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  removeItem: function(key) {
    var firebaseRef = new Firebase('https://jumpp.firebaseio.com/business/Active Orders');
    firebaseRef.child(key).remove();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
	  var bizDB = new Firebase('https://jumpp.firebaseio.com/business/')
      bizDB.push({
        name: this.state.text,
        location: "-13.65,15.0"
      });
      //This is the unique ID
      var postID = this.firebaseRefs['items'].key();
      var customerCount = new Firebase('https://jumpp.firebaseio.com/business/'+postID+'analytics/customersToday');
      
      //transactional lock update!!!!
      customerCount.transaction(function (current_value) {
		return (current_value || 0) + 1;
		});
      
      this.setState({
        text: ''
      });
      
    }
  },
    handleUpdate: function(e) {
    e.preventDefault();
    //update the value of location
    if (this.state.text && this.state.text.trim().length !== 0) {
    var location = new Firebase('https://jumpp.firebaseio.com/business/-JzZjUM48rtjWMzPBujS');
	  location.update({ "name" : this.state.text , 
		  "location" : "-13.65,15.0"
		  });
      
      this.setState({
        text: ''
      });
      
    }
  },

  render: function() {
    return (
      <div>
        <TodoList3 items={ this.state.items } removeItem={ this.removeItem } />
        <form onSubmit={ this.handleSubmit }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
        </form>
        
        <form onSubmit={ this.handleUpdate }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'Update #' + (this.state.items.length + 1) }</button>
        </form>
        
      </div>
    );
  }
});

React.render(<TodoApp3 />, document.getElementById('todoApp3'));
