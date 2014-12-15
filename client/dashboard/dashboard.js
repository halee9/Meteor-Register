Template.dashboard.helpers({
	sales: function(){
		var d = moment().format("YYYYMMDD");
		return Sales.findOne({_id:d});
	}
});

Template.order_list.helpers({
	orders: function(){
		var today = moment().startOf('day')._d;
		var orders = Orders.find({created_at: {$gt: today}}, {sort: {order_number: -1}}).fetch();
		if (orders) {
			for (var i=0; i<orders.length; i++) {
				orders[i].items = OrderItems.find({_order: orders[i]._id}).fetch();
			}
			return orders;
		}
	}
});
