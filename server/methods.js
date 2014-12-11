var cartId = "A";

Meteor.methods({
    removeAll: function(){
        Items.remove({});
        Categories.remove({});
        Modifiers.remove({});
        Addons.remove({});
        Carts.remove({});
        CartItems.remove({});
        Orders.remove({});
    },
    removeAllOrders: function(){
        Orders.remove({});
        OrderItems.remove({});
    },
    setCart: function(cart){
        Carts.remove({});
        Carts.insert(cart);
    },
    getOrders: function(){
        return Orders.find({}).fetch();
    },
    getOrderById: function(id){
        var order = Orders.findOne({_id: id});
        var items = OrderItems.find({_order: order._id}).fetch();
        order.items = items;
        return order;
    },
    addOrder: function(cart, items){
	    //var cart = Carts.findOne({_id: cart_id});
	    //var items = CartItems.find({_cart: cart._id}).fetch();
        //delete cart._id;
        //if (cart._origin) {
        if (cart._id) {
            //* case of update orders
            //var order_id = cart._origin;
            var order_id = cart._id;
            console.log("order id: "+order_id);
            cart.created_at = new Date(cart.created_at);
            cart.starting_at = new Date(cart.starting_at);
            Orders.update({_id: order_id}, cart);
            OrderItems.remove({_order: order_id});
        }
        else {
            var order_id = Meteor.call("addNewOrder", cart);
        }
        //* set order items
        for (var i=0; i<items.length; i++) {
            delete items[i]._id;
            items[i]._order = order_id;
            OrderItems.insert(items[i]);
        }
        var res = { order_id: order_id, order_type: cart.order_type }
	    //Meteor.call("initCart", cart_id);
        return res;
    },
    addNewOrder: function(cart){
        cart.created_at = new Date();
        var d = {
            year: moment().format("YYYY"), 
            month: moment().format("MM"),
            date: moment().format("DD"),
            day: moment().format("E"),
            hour: moment().format("HH")
        };
        console.log(d);
        cart.date = d;
        
        if (cart.eat_where == EAT_WHERE[1] && cart.order_type != ORDER_TYPE[0]) {
            //* Here and Phone or Online --> must wait
        }
        else if (cart.reserved_time) {
        }
        else 
            cart.starting_at = cart.created_at;
        cart.delay = 0;
        var current_number = 0;
        if (Orders.find().count() > 0) 
            current_number = Orders.findOne({},{sort:{order_number:-1}}).order_number;
        cart.order_number = current_number + 1;

        var order_id = Orders.insert(cart);

        if (cart.reserved_time) {
            var reserved_handle = Meteor.setInterval(function(){
                var reserved = cart.reserved_time;
                var starting_at = moment(cart.reserved_time).subtract(10, 'minutes')._d;
                if (starting_at < new Date()) {
                    Orders.update({_id: order_id}, {$set: {starting_at: starting_at}});
                    Meteor.clearInterval(reserved_handle);
                }
            }, 60 * 1000);
        }
        var delay = 0;
        var handle = Meteor.setInterval(function(){
            delay++;
            var order = Orders.findOne({_id: order_id});
            if (order.status == "Taken")
                Orders.update({_id: order_id}, {$set: {delay: delay}});
            else
                Meteor.clearInterval(handle);
        }, 60000);
        return order_id;
    },
    backToCart: function(order, orderItems){
        Meteor.call("initCart", cartId);
        order._origin = order._id;
	    delete order._id;
	    Meteor.call("updateCart", cartId, order);
        CartItems.remove({});
        for (var i=0; i<orderItems.length; i++) {
            orderItems[i]._origin = orderItems[i]._id;
            orderItems[i]._cart = cartId;
            delete orderItems[i]._id;
            CartItems.insert(orderItems[i]);
        }
        var cart = Carts.findOne({_id: "A" });
        cart.items = CartItems.find({_cart: cart._id}).fetch();
        return cart;
    },
    setPayStatus: function(order_item_id, pay_status) {
        var item = OrderItems.findOne({_id: order_item_id});
        item.pay_status = pay_status;
        OrderItems.update( {_id: item._id}, item);
    },
    setOrderStatus: function(order_id, order_status) {
        if (order_status == "Ready" || order_status == "Done") {
            var out_at = new Date();
            Orders.update({_id: order_id}, {$set: {status: order_status, out_at: out_at}});
        }
        else 
            Orders.update({_id: order_id}, {$set: {status: order_status}});
    },
    removeOrder: function(order_id) {
        Orders.update({_id: order_id}, {$set: {status: ORDER_STATUS_TYPE[3]}});
    },
    addPayment: function(order_id, credit, cash_in, change, payable) {
        var created_at = new Date();
        var payments_id = Payments.insert({
            created_at: created_at,
            credit: credit,
            cash_in: cash_in,
            change: change,
            cash: (cash_in - change),
            _order: order_id,
            sum: payable
        });
        var items = OrderItems.find({_order: order_id}).fetch();
        var unpaid_item = false;
        for (var i=0; i<items.length; i++) {
            if (items[i].pay_status == PAY_STATUS_TYPE[0]) {
                unpaid_item = true;
                OrderItems.update( {_id: items[i]._id}, {$set:{ pay_status: PAY_STATUS_TYPE[1] }});
            }
            else if (items[i].pay_status == PAY_STATUS_TYPE[1]) {
                items[i].pay_status = PAY_STATUS_TYPE[2];
                OrderItems.update( {_id: items[i]._id}, items[i]);
                items[i]._payments = payments_id;
                PaymentItems.insert(items[i]);
            }
        }
        if (unpaid_item == false) {
            var order = Orders.findOne({_id: order_id});
            if (order.status == "Ready")
                Orders.update({_id: order_id}, {$set: {pay_status: PAY_STATUS_TYPE[2], status: "Done"}});
            else if (order.status == "Taken" && order.order_type != ORDER_TYPE[0])
                Orders.update({_id: order_id}, {$set: {pay_status: PAY_STATUS_TYPE[2], starting_at: new Date()}});
            else
                Orders.update({_id: order_id}, {$set: {pay_status: PAY_STATUS_TYPE[2]}});
        }
        return { unpaid_item: unpaid_item, order_type: order.order_type, order_id: order._id };
        //return unpaid_item;
    }
});

function isSameItem(items, item){
    for (var i=0; i<items.length; i++) {
        if (items[i]._item == item._id) {
            if (items[i].option.length < 1)
                return items[i]._id;
        }
    }
    return false;
}

function setCustomOption(option, id){
    var cart = getCart();
    var items = cart.items;
    var item = items[id];
    item.custom_option = option;
    cart = getCartTotal(cart);
    Carts.update( { _id: "A" }, cart );
    console.log(getCart());
}


function setItemId(items){
    for (var i=0; i<items.length; i++) {
        items[i].id = i;
    }
    return items;
}

function getCartTotal(cart) {
	console.log(cart);
    var sum = { total: 0, subtotal: 0, tax: 0 };
    for (var i=0; i < cart.items.length; i++) {
        var unit_price = cart.items[i].price;
        for (var j=0; j<cart.items[i].option.length; j++) {
            unit_price += cart.items[i].option[j].price;
        }
        if (cart.items[i].custom_option) {
        	unit_price += parseFloat(cart.items[i].custom_option.price);
        }
        cart.items[i].subtotal = unit_price * cart.items[i].qty;
        sum.subtotal += cart.items[i].subtotal;
    }
    var tax_text = (sum.subtotal * (TAX/100)).toFixed(2);
    sum.tax = parseFloat(tax_text);
    sum.total = sum.subtotal + sum.tax;
    cart.sum = sum;
    return cart;
}

function setCartTotal(id) {
	var cart = Meteor.call("getCart");
    var sum = { total: 0, subtotal: 0, tax: 0 };
    var items = CartItems.find({ _cart: id }).fetch();
    for (var i=0; i < items.length; i++) {
        var unit_price = items[i].price;
        for (var j=0; j<items[i].option.length; j++) {
            unit_price += items[i].option[j].price;
        }
        if (items[i].custom_option) {
        	unit_price += parseFloat(items[i].custom_option.price);
        }
        items[i].subtotal = unit_price * items[i].qty;
        CartItems.update( { _id: items[i]._id }, items[i] );
        sum.subtotal += items[i].subtotal;
    }

    var tax_text = (sum.subtotal * (TAX/100)).toFixed(2);
    sum.tax = parseFloat(tax_text);
    sum.total = sum.subtotal + sum.tax;
    cart.sum = sum;
    return Carts.update( { _id: id }, cart );
}
