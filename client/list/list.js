Session.setDefault("selected_list_order", null);

Template.unpaid_orders.helpers({
    unpaid_orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ pay_status: "Unpaid", created_at: {$gt: today}}, {sort: {order_number: -1}}).fetch();

        for (var i=0; i<orders.length; i++) {
            orders[i].items = OrderItems.find({_order: orders[i]._id}).fetch();
        }
        return orders;
    }
})

Template.list.helpers({
    paid_orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ pay_status: "Paid", status: {$in: ['Taken', 'Ready']}, created_at: {$gt: today}}, {sort: {order_number: -1}}).fetch();

        for (var i=0; i<orders.length; i++) {
            orders[i].items = OrderItems.find({_order: orders[i]._id}).fetch();
        }
        return orders;
    },
    completed_orders: function () {
        var today = moment().startOf('day')._d;
        var orders = Orders.find({ status: {$in: ['Done', 'Removed']}, created_at: {$gt: today}}, {sort: {order_number: -1}}).fetch();

        for (var i=0; i<orders.length; i++) {
            orders[i].items = OrderItems.find({_order: orders[i]._id}).fetch();
        }
        return orders;
    }
});

Template.each_order.helpers({
    qty_show: function () {
        if (this.qty > 1) return true;
        else return false;
    },
    currency: function(number) {
        return "$" + Number(number).toFixed(2);
    },
    selected: function() {
        return Session.equals("selected_list_order", this._id) ? "selected" : '';
    },
    show: function() {
        //console.log(Session.get("selected_list_order"));
        return Session.equals("selected_list_order", this._id) ? true : false;
    },
    last_two: function(number) {
        return (number % 100);
    },
    hours: function(t) {
        if (t)
        return 'at ' + moment(t).format("h:mm");
    },
    order_status_icon: function(){
        if (this.status == "Taken") return "fire";
        else if (this.status == "Ready" || this.status == "Done") return "exclamation-circle";
        else if (this.status == "Canceled") return "trash-o";
    },
    order_type_icon: function(){
        if (this.order_type == "Walk-in") return "male";
        else if (this.order_type == "Phone") return "phone";
        else if (this.order_type == "Online") return "bolt";
    },
    eat_where_icon: function(){
        if (this.eat_where == "Here") return "cutlery";
        else if (this.eat_where == "Togo") return "gift";
    },
    payment_action: function(){
        return (this.pay_status != "Paid") ? true : false;
    },
    modify_action: function(){
        return (this.status == "Taken" || this.status == "Ready") ? true : false;
    },
    remove_action: function(){
        return (this.status != "Removed") ? true : false;
    }
});

Template.each_order.events({
    "click": function(e, theTemplate){
        //console.log("bubble");
        var id = theTemplate.data._id;
        if (Session.equals("selected_list_order", id))
            Session.set("selected_list_order", null);
        else
            Session.set("selected_list_order", id);
    },
    "click button.paying": function(e, temp){
        e.preventDefault();
        var id = temp.data._id;
        Router.go("/payment/"+id);
    },
    "click button.modify": function(e, temp){
        e.preventDefault();
        //console.log(temp.data);
        var id = temp.data._id;
        Router.go("/register/"+id);
    },
    "click button.remove": function(e, temp){
        e.preventDefault();
        var id = temp.data._id;
        bootbox.confirm("Are you sure?", function(result) {
            if (result == true) {
                Meteor.call('removeOrder', id, function (error, result) {});
            }
        });
    }
});

