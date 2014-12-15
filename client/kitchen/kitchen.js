

Template.walkin_list.helpers({
    orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ status: "Taken", order_type: "Walk-in", created_at: {$gt: today} }, {sort: {order_number: 1}}).fetch();
        for (var i=0; i<orders.length; i++){
            orders[i].items = OrderItems.find({ _order: orders[i]._id, _category: {$ne: "Mer"} }).fetch();
            if (orders[i].items.length < 1) {
                orders.splice(i,1);
                i--;
            }
        }
        return orders;
    }
});

Template.online_list.helpers({
    orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ 
            status: "Taken", 
            order_type: {$in: ["Phone", "Online"]},
            starting_at: {$exists: true},
            created_at: {$gt: today}
            //eat_where: "Togo",
            }, {sort: {starting_at: 1}}).fetch();
        for (var i=0; i<orders.length; i++){
            orders[i].items = OrderItems.find({ _order: orders[i]._id, _category: {$ne: "Mer"} }).fetch();
            if (orders[i].items.length < 1) {
                orders.splice(i,1);
                i--;
            }
        }
        return orders;
    }
});

Template.finished_list.helpers({
    orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ 
            status: {$in: ["Done", "Ready"]}, 
            created_at: {$gt: today}
            }, {sort: {out_at: -1}}).fetch();
        for (var i=0; i<orders.length; i++){
            orders[i].items = OrderItems.find({ _order: orders[i]._id, _category: {$ne: "Mer"} }).fetch();
            if (orders[i].items.length < 1) {
                orders.splice(i,1);
                i--;
            }
        }
        return orders;
    }
});

Template.special_list.helpers({
    orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ 
            status: "Taken", 
            order_type: {$in: ["Phone", "Online"]},
            starting_at: {$exists: false},
            created_at: {$gt: today}
            }, {sort: {order_number: 1}}).fetch();
        for (var i=0; i<orders.length; i++){
            orders[i].items = OrderItems.find({ _order: orders[i]._id }).fetch();
        }
        return orders;
    }
});

Template.kitchen_item.helpers({
    last_two: function(number) {
        return (number % 100);
    },
    hours: function(t) {
        if (t)
        return 'at ' + moment(t).format("hh:mm a");
    },
    togo: function() {
        if (this.eat_where == "Togo") return true;
        return false;
    },
    qty_show: function(){
        if (this.qty > 1) return true;
        else return false;
    },
    kitchen_out: function(){
        if (this.status != 'Taken') return 'kitchen_out';
        return '';
    },
    order_tag: function(){
        //if (this.order_type == 'Walk-in')
        return this.eat_where.substr(0,1);
        //else return this.order_type.substr(0,1);
    },
    first_letter: function(str){
        return str.substr(0,1);
    },
    job_color: function(){
        return (this.job == "Wok") ? "red" : "";
    }
});

Template.kitchen_item.events({
    'click .order_number': function () {
        if (this.status == 'Taken') {
            if (this.pay_status == 'Paid') var order_status = 'Done';
            else var order_status = 'Ready';
        }
        else {
            var order_status = 'Taken';
        }
        Meteor.call('setOrderStatus', this._id, order_status, function (error, result) {});
    },
    'dblclick .eat_where': function () {
        console.log(this);
        Session.set("kitchen_ticket", JSON.stringify(this));
        Meteor.setTimeout(function(){
            window.print();
        }, 100);
     }
});

Session.set("kitchen_ticket", null);

Template.kitchen_ticket.helpers({
    order: function(){
        var now = moment()._d;
        Orders.find({eat_where: "Togo", status: "Taken", created_at: {$gt: now}}).observe({
            added: function(order){
                var handle = Meteor.setTimeout(function(){
                    var items = OrderItems.find({_order: order._id}).fetch();
                    if (items.length > 0) {
                        order.items = items;
                        Session.set("kitchen_ticket", JSON.stringify(order));
                        Meteor.setTimeout(function(){
                            console.log("window print");
                            //window.print();
                        }, 100);
                    }
                }, 200);
            }
        });
        return JSON.parse(Session.get("kitchen_ticket"));
    },
    multiple: function(){
        return (this.qty > 1) ? true : false;
    }
});

Template.kitchen_ticket.rendered = function(){
    if (this.data) {
        console.log("printing");
    }
};

