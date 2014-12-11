Session.set("clock", null);

var clock_handle = Meteor.setInterval(function(){
    Session.set("clock", moment().format('h:mm'));
}, 1000);

Template.header.helpers({
    clock: function(){
        return Session.get("clock");
    },
    total: function(){
    	var today = moment().format("YYYYMMDD");
    	var sale = Sales.findOne({_id: today});
    	return (sale) ? sale.total : null;
    }
});